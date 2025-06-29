/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/product').Product, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: 'Stock Keeping Unit'
  },
  barcode: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },
  name: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Product name in multiple languages: {en: "English Name", ar: "Arabic Name"}'
  },
  description: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Product description in multiple languages'
  },
  shortDescription: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Short product description in multiple languages'
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Price in OMR'
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    comment: 'Original price for discount display'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    comment: 'Cost price for profit calculation'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'OMR'
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Weight in grams'
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Product dimensions: {length: 0, width: 0, height: 0}'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of image URLs'
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of video URLs for video shopping'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Product tags for search and filtering'
  },
  attributes: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Product attributes like size, color, fragrance notes, etc.'
  },
  variants: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Product variants with different attributes'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDigital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Digital products like gift cards'
  },
  requiresShipping: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  trackQuantity: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowBackorder: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  minQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Minimum quantity per order'
  },
  maxQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum quantity per order'
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total stock across all branches'
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  seoTitle: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'SEO title in multiple languages'
  },
  seoDescription: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'SEO description in multiple languages'
  },
  seoKeywords: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'SEO keywords'
  },
  slug: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'URL slug in multiple languages'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  trending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  newArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  onSale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  saleStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  saleEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  purchaseCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wishlistCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Product availability start date'
  },
  availableUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Product availability end date'
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Points earned when purchasing this product'
  },
  shippingClass: {
    type: DataTypes.ENUM('standard', 'express', 'fragile', 'hazardous'),
    defaultValue: 'standard'
  },
  taxClass: {
    type: DataTypes.STRING(50),
    defaultValue: 'standard'
  },
  vendor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Product vendor/supplier'
  },
  manufacturerCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  originCountry: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Product expiry date for perfumes'
  },
  batchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about the product'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional product metadata'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['sku']
    },
    {
      fields: ['barcode']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['brand']
    },
    {
      fields: ['price']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['trending']
    },
    {
      fields: ['newArrival']
    },
    {
      fields: ['bestSeller']
    },
    {
      fields: ['onSale']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['stockQuantity']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeCreate: async (product) => {
      // Generate SKU if not provided
      if (!product.sku) {
        product.sku = await generateSKU();
      }
      
      // Set sale status based on dates
      if (product.saleStartDate && product.saleEndDate) {
        const now = new Date();
        product.onSale = now >= product.saleStartDate && now <= product.saleEndDate;
      }
    },
    beforeUpdate: async (product) => {
      // Update sale status based on dates
      if (product.changed('saleStartDate') || product.changed('saleEndDate')) {
        const now = new Date();
        product.onSale = product.saleStartDate && product.saleEndDate && 
                        now >= product.saleStartDate && now <= product.saleEndDate;
      }
    }
  }
});

// Instance methods
Product.prototype.getDisplayPrice = function() {
  return this.onSale && this.comparePrice ? this.price : this.price;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.onSale || !this.comparePrice) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
};

Product.prototype.isInStock = function() {
  if (!this.trackQuantity) return true;
  return this.stockQuantity > 0 || this.allowBackorder;
};

Product.prototype.isAvailable = function() {
  const now = new Date();
  const availableFrom = this.availableFrom ? new Date(this.availableFrom) : null;
  const availableUntil = this.availableUntil ? new Date(this.availableUntil) : null;
  
  if (availableFrom && now < availableFrom) return false;
  if (availableUntil && now > availableUntil) return false;
  
  return this.isActive && this.isInStock();
};

Product.prototype.incrementViewCount = async function() {
  this.viewCount += 1;
  await this.save();
};

Product.prototype.incrementPurchaseCount = async function(quantity = 1) {
  this.purchaseCount += quantity;
  await this.save();
};

Product.prototype.updateRating = async function() {
  const Review = require('./Review');
  const reviews = await Review.findAll({
    where: { productId: this.id },
    attributes: ['rating']
  });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / reviews.length).toFixed(2);
    this.reviewCount = reviews.length;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }
  
  await this.save();
};

// Class methods
Product.findBySKU = function(sku) {
  return this.findOne({ where: { sku } });
};

Product.findByBarcode = function(barcode) {
  return this.findOne({ where: { barcode } });
};

Product.findFeatured = function(limit = 10) {
  return this.findAll({
    where: { featured: true, isActive: true },
    limit,
    order: [['createdAt', 'DESC']]
  });
};

Product.findTrending = function(limit = 10) {
  return this.findAll({
    where: { trending: true, isActive: true },
    limit,
    order: [['viewCount', 'DESC']]
  });
};

Product.findNewArrivals = function(limit = 10) {
  return this.findAll({
    where: { newArrival: true, isActive: true },
    limit,
    order: [['createdAt', 'DESC']]
  });
};

Product.findBestSellers = function(limit = 10) {
  return this.findAll({
    where: { bestSeller: true, isActive: true },
    limit,
    order: [['purchaseCount', 'DESC']]
  });
};

Product.findOnSale = function(limit = 10) {
  return this.findAll({
    where: { onSale: true, isActive: true },
    limit,
    order: [['createdAt', 'DESC']]
  });
};

// Helper function to generate SKU
async function generateSKU() {
  const prefix = 'AP'; // Adam Perfumes
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

module.exports = Product;