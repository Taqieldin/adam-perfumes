'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      firebase_uid: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true // Nullable for social login users
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      profile_picture: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      language: {
        type: Sequelize.ENUM('en', 'ar'),
        defaultValue: 'en'
      },
      role: {
        type: Sequelize.ENUM('customer', 'admin', 'super_admin', 'store_manager'),
        defaultValue: 'customer'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      login_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      wallet_balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      loyalty_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      referral_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      referred_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      fcm_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      preferences: {
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
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['phone']);
    await queryInterface.addIndex('users', ['firebase_uid']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['is_active']);
    await queryInterface.addIndex('users', ['referral_code']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};