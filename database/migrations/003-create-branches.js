'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique branch code (e.g., MSC01, SLL02)'
      },
      // Location details
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      governorate: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Oman governorate (Muscat, Dhofar, etc.)'
      },
      governorate_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Geographic coordinates for geolocation features
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      // Contact information
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      whatsapp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Operating hours
      operating_hours: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Weekly operating hours schedule'
      },
      // Branch manager and staff
      manager_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      manager_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      staff_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Branch specifications
      size_sqm: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Branch size in square meters'
      },
      storage_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Maximum inventory capacity'
      },
      // Status and features
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_flagship: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Main/flagship branch'
      },
      supports_online_orders: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can fulfill online orders'
      },
      supports_pickup: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Supports click & collect'
      },
      supports_returns: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Accepts returns and exchanges'
      },
      // Services offered
      services: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Services offered: consultation, gift_wrapping, etc.'
      },
      // Branch image and branding
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Multiple branch images'
      },
      // Opening and renovation dates
      opening_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_renovation: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Performance metrics
      monthly_target: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Monthly sales target in OMR'
      },
      // Additional information
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.addIndex('branches', ['code']);
    await queryInterface.addIndex('branches', ['city']);
    await queryInterface.addIndex('branches', ['governorate']);
    await queryInterface.addIndex('branches', ['is_active']);
    await queryInterface.addIndex('branches', ['is_flagship']);
    await queryInterface.addIndex('branches', ['supports_online_orders']);
    await queryInterface.addIndex('branches', ['latitude', 'longitude']);
    await queryInterface.addIndex('branches', ['sort_order']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('branches');
  }
};