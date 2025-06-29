'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_notes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      note_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'notes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      note_type: {
        type: Sequelize.ENUM('top', 'middle', 'base'),
        allowNull: false
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

    await queryInterface.addConstraint('product_notes', {
      fields: ['product_id', 'note_id'],
      type: 'unique',
      name: 'product_notes_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_notes');
  }
};
