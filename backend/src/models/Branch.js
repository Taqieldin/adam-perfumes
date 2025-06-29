const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Branch name in multiple languages'
  },
  code: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
    comment: 'Unique branch code (e.g., MST01, SLL02)'
  },
  type: {
    type: DataTypes.ENUM('retail', 'warehouse', 'outlet', 'flagship'),
    defaultValue: 'retail',
    allowNull: false
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Complete branch address'
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'GPS coordinates: {lat: 0, lng: 0}'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  managerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Branch manager user ID'
  },
  operatingHours: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Operating hours for each day of the week'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  canFulfillOrders: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  totalSales: {
    type: DataTypes.DECIMAL(12, 3),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional branch metadata'
  }
}, {
  tableName: 'branches',
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['managerId']
    },
    {
      fields: ['isActive']
    }
  ]
});

// Instance methods
Branch.prototype.getName = function(language = 'en') {
  return this.name[language] || this.name.en || '';
};

Branch.prototype.getFormattedAddress = function() {
  const addr = this.address;
  let formatted = addr.street || '';
  if (addr.area) formatted += `, ${addr.area}`;
  if (addr.city) formatted += `, ${addr.city}`;
  return formatted;
};

// Class methods
Branch.findActive = function() {
  return this.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });
};

Branch.findByCode = function(code) {
  return this.findOne({ where: { code } });
};

module.exports = Branch;