'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing products table if it exists and recreate with correct structure for Adam Perfumes
    await queryInterface.dropTable('products').catch(() => {});
    
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      short_description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Pricing in OMR (Omani Rial)
      price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Price in OMR'
      },
      compare_price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Original price for sale items in OMR'
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Cost price for profit calculation in OMR'
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      // Inventory management across 21 branches
      total_stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total stock across all branches'
      },
      available_stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Available stock for online orders'
      },
      reserved_stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Stock reserved for pending orders'
      },
      low_stock_threshold: {
        type: Sequelize.INTEGER,
        defaultValue: 5
      },
      track_inventory: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      allow_backorder: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Physical attributes
      weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Weight in grams'
      },
      volume: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Volume in ml'
      },
      dimensions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Length, width, height in cm'
      },
      // Fragrance specific attributes
      fragrance_type: {
        type: Sequelize.ENUM('eau_de_parfum', 'eau_de_toilette', 'parfum', 'eau_de_cologne', 'eau_fraiche', 'perfume_oil'),
        allowNull: true
      },
      concentration: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Fragrance concentration percentage'
      },
      gender: {
        type: Sequelize.ENUM('men', 'women', 'unisex'),
        allowNull: true
      },
      fragrance_family: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'e.g., Oriental, Fresh, Floral, Woody'
      },
      top_notes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of top fragrance notes'
      },
      middle_notes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of middle/heart fragrance notes'
      },
      base_notes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of base fragrance notes'
      },
      longevity: {
        type: Sequelize.ENUM('very_weak', 'weak', 'moderate', 'long_lasting', 'eternal'),
        allowNull: true
      },
      sillage: {
        type: Sequelize.ENUM('intimate', 'moderate', 'strong', 'enormous'),
        allowNull: true
      },
      season: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Suitable seasons: spring, summer, fall, winter'
      },
      occasion: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Suitable occasions: daily, evening, office, special'
      },
      // Media
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of product image URLs'
      },
      featured_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      video_url: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Product video for video shopping feature'
      },
      // Status and visibility
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'draft', 'archived'),
        defaultValue: 'active'
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_bestseller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_new_arrival: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_on_sale: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // SEO for website
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Important dates
      launch_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sale_start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sale_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Analytics and performance
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      purchase_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating_average: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00
      },
      rating_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Additional data
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Product tags for search and filtering'
      },
      attributes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional product attributes'
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

    // Add indexes for performance
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['slug']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['status']);
    await queryInterface.addIndex('products', ['is_featured']);
    await queryInterface.addIndex('products', ['is_bestseller']);
    await queryInterface.addIndex('products', ['is_new_arrival']);
    await queryInterface.addIndex('products', ['is_on_sale']);
    await queryInterface.addIndex('products', ['fragrance_type']);
    await queryInterface.addIndex('products', ['gender']);
    await queryInterface.addIndex('products', ['price']);
    await queryInterface.addIndex('products', ['available_stock']);
    await queryInterface.addIndex('products', ['rating_average']);
    await queryInterface.addIndex('products', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};