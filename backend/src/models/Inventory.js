const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  reservedQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Quantity reserved for pending orders'
  },
  availableQuantity: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.quantity - this.reservedQuantity;
    }
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  reorderQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    validate: {
      min: 0
    },
    comment: 'Cost price for this inventory item'
  },
  lastRestockDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastSaleDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalSold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional inventory metadata'
  }
}, {
  tableName: 'inventory',
  indexes: [
    {
      fields: ['productId']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['quantity']
    },
    {
      fields: ['isActive']
    },
    {
      unique: true,
      fields: ['productId', 'branchId']
    }
  ]
});

// Instance methods
Inventory.prototype.isLowStock = function() {
  return this.quantity <= this.lowStockThreshold;
};

Inventory.prototype.isOutOfStock = function() {
  return this.availableQuantity <= 0;
};

Inventory.prototype.canFulfill = function(requestedQuantity) {
  return this.availableQuantity >= requestedQuantity;
};

Inventory.prototype.reserveStock = async function(quantity) {
  if (!this.canFulfill(quantity)) {
    throw new Error('Insufficient stock to reserve');
  }
  
  this.reservedQuantity += quantity;
  await this.save();
  
  return this;
};

Inventory.prototype.releaseReservedStock = async function(quantity) {
  const releaseAmount = Math.min(quantity, this.reservedQuantity);
  this.reservedQuantity -= releaseAmount;
  await this.save();
  
  return this;
};

Inventory.prototype.fulfillOrder = async function(quantity) {
  if (!this.canFulfill(quantity)) {
    throw new Error('Insufficient stock to fulfill order');
  }
  
  // Reduce both reserved and actual quantity
  const reservedToReduce = Math.min(quantity, this.reservedQuantity);
  this.reservedQuantity -= reservedToReduce;
  this.quantity -= quantity;
  this.totalSold += quantity;
  this.lastSaleDate = new Date();
  
  await this.save();
  
  // Update product total stock
  await this.updateProductStock();
  
  return this;
};

Inventory.prototype.addStock = async function(quantity, costPrice = null) {
  this.quantity += quantity;
  this.lastRestockDate = new Date();
  
  if (costPrice) {
    this.costPrice = costPrice;
  }
  
  await this.save();
  
  // Update product total stock
  await this.updateProductStock();
  
  return this;
};

Inventory.prototype.adjustStock = async function(newQuantity, reason = null) {
  const oldQuantity = this.quantity;
  this.quantity = newQuantity;
  
  if (reason) {
    this.notes = this.notes ? `${this.notes}\n${reason}` : reason;
  }
  
  await this.save();
  
  // Update product total stock
  await this.updateProductStock();
  
  // Log stock adjustment
  const logger = require('../utils/logger');
  logger.logUserAction('system', 'STOCK_ADJUSTED', {
    inventoryId: this.id,
    productId: this.productId,
    branchId: this.branchId,
    oldQuantity,
    newQuantity,
    reason
  });
  
  return this;
};

Inventory.prototype.updateProductStock = async function() {
  const Product = require('./Product');
  
  // Calculate total stock across all branches for this product
  const totalStock = await Inventory.sum('quantity', {
    where: {
      productId: this.productId,
      isActive: true
    }
  });
  
  // Update product stock quantity
  await Product.update(
    { stockQuantity: totalStock || 0 },
    { where: { id: this.productId } }
  );
};

// Class methods
Inventory.findByProduct = function(productId) {
  return this.findAll({
    where: { productId, isActive: true },
    include: ['branch'],
    order: [['quantity', 'DESC']]
  });
};

Inventory.findByBranch = function(branchId) {
  return this.findAll({
    where: { branchId, isActive: true },
    include: ['product'],
    order: [['quantity', 'ASC']]
  });
};

Inventory.findLowStock = function(branchId = null) {
  const where = {
    isActive: true,
    [sequelize.Op.and]: [
      sequelize.literal('quantity <= lowStockThreshold')
    ]
  };
  
  if (branchId) {
    where.branchId = branchId;
  }
  
  return this.findAll({
    where,
    include: ['product', 'branch'],
    order: [['quantity', 'ASC']]
  });
};

Inventory.findOutOfStock = function(branchId = null) {
  const where = {
    isActive: true,
    [sequelize.Op.or]: [
      { quantity: 0 },
      sequelize.literal('quantity <= reservedQuantity')
    ]
  };
  
  if (branchId) {
    where.branchId = branchId;
  }
  
  return this.findAll({
    where,
    include: ['product', 'branch'],
    order: [['lastSaleDate', 'DESC']]
  });
};

Inventory.findAvailableStock = async function(productId, requestedQuantity) {
  // Find branches that have sufficient stock for the requested quantity
  const availableInventory = await this.findAll({
    where: {
      productId,
      isActive: true,
      [sequelize.Op.and]: [
        sequelize.literal('(quantity - reservedQuantity) >= ?')
      ]
    },
    replacements: [requestedQuantity],
    include: ['branch'],
    order: [
      // Prioritize branches with more stock
      ['quantity', 'DESC'],
      // Then by branch priority (flagship > retail > outlet)
      [sequelize.literal("CASE WHEN branch.type = 'flagship' THEN 1 WHEN branch.type = 'retail' THEN 2 WHEN branch.type = 'outlet' THEN 3 ELSE 4 END")]
    ]
  });
  
  return availableInventory;
};

Inventory.getProductAvailability = async function(productId) {
  const inventory = await this.findAll({
    where: { productId, isActive: true },
    include: ['branch'],
    attributes: [
      'branchId',
      'quantity',
      'reservedQuantity',
      [sequelize.literal('quantity - reservedQuantity'), 'availableQuantity']
    ]
  });
  
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = inventory.reduce((sum, item) => sum + item.reservedQuantity, 0);
  const totalAvailable = totalQuantity - totalReserved;
  
  return {
    totalQuantity,
    totalReserved,
    totalAvailable,
    branches: inventory.map(item => ({
      branchId: item.branchId,
      branchName: item.branch?.getName(),
      quantity: item.quantity,
      reserved: item.reservedQuantity,
      available: item.quantity - item.reservedQuantity
    }))
  };
};

Inventory.reserveStockForOrder = async function(orderItems) {
  const reservations = [];
  
  for (const item of orderItems) {
    const { productId, quantity } = item;
    
    // Find available inventory for this product
    const availableInventory = await this.findAvailableStock(productId, quantity);
    
    if (availableInventory.length === 0) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }
    
    // Reserve from the first available branch (highest priority)
    const inventory = availableInventory[0];
    await inventory.reserveStock(quantity);
    
    reservations.push({
      productId,
      branchId: inventory.branchId,
      quantity,
      inventoryId: inventory.id
    });
  }
  
  return reservations;
};

Inventory.getInventoryStats = async function(branchId = null) {
  const where = { isActive: true };
  if (branchId) where.branchId = branchId;
  
  const stats = await this.findAll({
    where,
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalProducts'],
      [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      [sequelize.fn('SUM', sequelize.col('reservedQuantity')), 'totalReserved'],
      [sequelize.fn('COUNT', sequelize.literal('CASE WHEN quantity <= lowStockThreshold THEN 1 END')), 'lowStockCount'],
      [sequelize.fn('COUNT', sequelize.literal('CASE WHEN quantity = 0 THEN 1 END')), 'outOfStockCount']
    ],
    raw: true
  });
  
  return {
    totalProducts: parseInt(stats[0]?.totalProducts || 0),
    totalQuantity: parseInt(stats[0]?.totalQuantity || 0),
    totalReserved: parseInt(stats[0]?.totalReserved || 0),
    totalAvailable: parseInt(stats[0]?.totalQuantity || 0) - parseInt(stats[0]?.totalReserved || 0),
    lowStockCount: parseInt(stats[0]?.lowStockCount || 0),
    outOfStockCount: parseInt(stats[0]?.outOfStockCount || 0)
  };
};

module.exports = Inventory;