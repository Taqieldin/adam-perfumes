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
    allowNull: false,
    unique: true,
    comment: 'Stock Keeping Unit - unique product identifier'
  },
  barcode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  // Multi-language support
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
    comment: 'Short product description for listings'
  },
  // Category
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  // Brand information
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Pricing
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Original price for showing discounts'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Cost price for profit calculations'
  },
  // Inventory
  trackInventory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  // Product specifications
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Weight in grams'
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Dimensions object: {length: 0, width: 0, height: 0} in cm'
  },
  // Perfume specific attributes
  fragrance: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Fragrance details: {type: "eau_de_parfum", concentration: "15%", notes: {top: [], middle: [], base: []}}'
  },
  gender: {
    type: DataTypes.ENUM('men', 'women', 'unisex'),
    allowNull: true
  },
  size: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Size like "50ml", "100ml", etc.'
  },
  // Media
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
  // SEO
  slug: {
    type: DataTypes.STRING(200),
    allowNull: true,
    unique: true
  },
  metaTitle: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'SEO meta title in multiple languages'
  },
  metaDescription: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'SEO meta description in multiple languages'
  },
  // Status and visibility
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft', 'archived'),
    defaultValue: 'draft'
  },
  visibility: {
    type: DataTypes.ENUM('visible', 'hidden', 'catalog_only'),
    defaultValue: 'visible'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Shipping
  requiresShipping: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  shippingClass: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // Ratings and reviews
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Sales data
  totalSales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Tags for filtering
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tags for filtering and search'
  },
  // Variants (for products with multiple options)
  hasVariants: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Parent product ID for variants'
  },
  variantOptions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Variant options like size, color, etc.'
  },
  // Promotion and discount eligibility
  allowDiscounts: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Gift card specific
  isGiftCard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  giftCardType: {
    type: DataTypes.ENUM('fixed', 'variable'),
    allowNull: true
  },
  // Digital product
  isDigital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['sku']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['visibility']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['brand']
    },
    {
      fields: ['price']
    },
    {
      fields: ['stockQuantity']
    },
    {
      fields: ['averageRating']
    },
    {
      fields: ['totalSales']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['slug']
    }
  ],
  hooks: {
    beforeCreate: async (product) => {
      // Generate slug if not provided
      if (!product.slug && product.name && product.name.en) {
        product.slug = generateSlug(product.name.en);
      }
    },
    beforeUpdate: async (product) => {
      // Update slug if name changed
      if (product.changed('name') && product.name && product.name.en && !product.slug) {
        product.slug = generateSlug(product.name.en);
      }
    }
  }
});

// Instance methods
Product.prototype.getName = function(language = 'en') {
  return this.name && this.name[language] ? this.name[language] : this.name.en || '';
};

Product.prototype.getDescription = function(language = 'en') {
  return this.description && this.description[language] ? this.description[language] : this.description?.en || '';
};

Product.prototype.getShortDescription = function(language = 'en') {
  return this.shortDescription && this.shortDescription[language] ? this.shortDescription[language] : this.shortDescription?.en || '';
};

Product.prototype.isInStock = function() {
  if (!this.trackInventory) return true;
  return this.stockQuantity > 0;
};

Product.prototype.isLowStock = function() {
  if (!this.trackInventory) return false;
  return this.stockQuantity <= this.lowStockThreshold;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
};

Product.prototype.getPrimaryImage = function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
};

Product.prototype.addImage = function(imageUrl) {
  const images = this.images || [];
  if (!images.includes(imageUrl)) {
    images.push(imageUrl);
    this.images = images;
  }
};

Product.prototype.removeImage = function(imageUrl) {
  const images = this.images || [];
  this.images = images.filter(img => img !== imageUrl);
};

Product.prototype.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRating = (this.averageRating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.averageRating = totalRating / this.reviewCount;
  }
};

// Class methods
Product.findBySku = function(sku) {
  return this.findOne({ where: { sku } });
};

Product.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Product.findFeatured = function(limit = 10) {
  return this.findAll({
    where: { featured: true, status: 'active', visibility: 'visible' },
    limit,
    order: [['createdAt', 'DESC']]
  });
};

Product.findByCategory = function(categoryId, options = {}) {
  return this.findAll({
    where: { 
      categoryId, 
      status: 'active', 
      visibility: 'visible' 
    },
    ...options
  });
};

Product.searchProducts = function(query, options = {}) {
  const { Op } = require('sequelize');
  return this.findAll({
    where: {
      [Op.or]: [
        { '$name.en$': { [Op.like]: `%${query}%` } },
        { '$name.ar$': { [Op.like]: `%${query}%` } },
        { '$description.en$': { [Op.like]: `%${query}%` } },
        { '$description.ar$': { [Op.like]: `%${query}%` } },
        { brand: { [Op.like]: `%${query}%` } },
        { sku: { [Op.like]: `%${query}%` } }
      ],
      status: 'active',
      visibility: 'visible'
    },
    ...options
  });
};

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

module.exports = Product;