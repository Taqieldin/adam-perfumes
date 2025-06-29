'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create categories table first
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create brands table
    await queryInterface.createTable('brands', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create products table
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      short_description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      short_description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      brand_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'brands',
          key: 'id'
        }
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      sale_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      min_stock_level: {
        type: Sequelize.INTEGER,
        defaultValue: 5
      },
      max_stock_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1000
      },
      weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      dimensions: {
        type: Sequelize.JSON,
        allowNull: true // {length, width, height}
      },
      images: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      video_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fragrance_notes: {
        type: Sequelize.JSON,
        allowNull: true // {top: [], middle: [], base: []}
      },
      concentration: {
        type: Sequelize.ENUM('eau_de_parfum', 'eau_de_toilette', 'parfum', 'eau_de_cologne', 'eau_fraiche'),
        allowNull: true
      },
      volume: {
        type: Sequelize.STRING,
        allowNull: true // e.g., "100ml", "50ml"
      },
      gender: {
        type: Sequelize.ENUM('men', 'women', 'unisex'),
        allowNull: true
      },
      season: {
        type: Sequelize.JSON,
        allowNull: true // ["spring", "summer", "autumn", "winter"]
      },
      occasion: {
        type: Sequelize.JSON,
        allowNull: true // ["casual", "formal", "evening", "daytime"]
      },
      longevity: {
        type: Sequelize.ENUM('poor', 'weak', 'moderate', 'long_lasting', 'eternal'),
        allowNull: true
      },
      sillage: {
        type: Sequelize.ENUM('intimate', 'moderate', 'strong', 'enormous'),
        allowNull: true
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00
      },
      review_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      purchase_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_new: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_bestseller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_digital: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      requires_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      meta_title_en: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_title_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      attributes: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('categories', ['slug']);
    await queryInterface.addIndex('categories', ['parent_id']);
    await queryInterface.addIndex('categories', ['is_active']);
    
    await queryInterface.addIndex('brands', ['name']);
    await queryInterface.addIndex('brands', ['is_active']);
    
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['barcode']);
    await queryInterface.addIndex('products', ['slug']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['brand_id']);
    await queryInterface.addIndex('products', ['price']);
    await queryInterface.addIndex('products', ['is_active']);
    await queryInterface.addIndex('products', ['is_featured']);
    await queryInterface.addIndex('products', ['is_new']);
    await queryInterface.addIndex('products', ['is_bestseller']);
    await queryInterface.addIndex('products', ['rating']);
    await queryInterface.addIndex('products', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('brands');
    await queryInterface.dropTable('categories');
  }
};