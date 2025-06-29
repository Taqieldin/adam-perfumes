const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Multi-language support
  name: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Category name in multiple languages: {en: "English Name", ar: "Arabic Name"}'
  },
  description: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Category description in multiple languages'
  },
  // Hierarchy support
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'Parent category ID for nested categories'
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Category hierarchy level (0 = root, 1 = child, etc.)'
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Full path from root to this category (e.g., "perfumes/men/eau-de-parfum")'
  },
  // Display and ordering
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Order for displaying categories'
  },
  // Media
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Category image URL'
  },
  icon: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Category icon URL or icon class'
  },
  banner: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Category banner image URL'
  },
  // SEO
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
  metaKeywords: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'SEO meta keywords in multiple languages'
  },
  // Status and visibility
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether category is visible in navigation'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether category is featured on homepage'
  },
  // Product count (denormalized for performance)
  productCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of active products in this category'
  },
  // Commission settings (for affiliate/branch management)
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Commission rate percentage for this category'
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isVisible']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['level']
    },
    {
      fields: ['sortOrder']
    },
    {
      fields: ['path']
    }
  ],
  hooks: {
    beforeCreate: async (category) => {
      // Generate slug if not provided
      if (!category.slug && category.name && category.name.en) {
        category.slug = await generateUniqueSlug(category.name.en, Category);
      }
      
      // Set level and path based on parent
      if (category.parentId) {
        const parent = await Category.findByPk(category.parentId);
        if (parent) {
          category.level = parent.level + 1;
          category.path = parent.path ? `${parent.path}/${category.slug}` : category.slug;
        }
      } else {
        category.level = 0;
        category.path = category.slug;
      }
    },
    beforeUpdate: async (category) => {
      // Update slug if name changed
      if (category.changed('name') && category.name && category.name.en) {
        category.slug = await generateUniqueSlug(category.name.en, Category, category.id);
      }
      
      // Update path if slug or parent changed
      if (category.changed('slug') || category.changed('parentId')) {
        if (category.parentId) {
          const parent = await Category.findByPk(category.parentId);
          if (parent) {
            category.level = parent.level + 1;
            category.path = parent.path ? `${parent.path}/${category.slug}` : category.slug;
          }
        } else {
          category.level = 0;
          category.path = category.slug;
        }
        
        // Update all children paths
        await updateChildrenPaths(category);
      }
    },
    afterDestroy: async (category) => {
      // Update product count for parent categories
      await updateParentProductCounts(category.parentId);
    }
  }
});

// Instance methods
Category.prototype.getName = function(language = 'en') {
  return this.name && this.name[language] ? this.name[language] : this.name.en || '';
};

Category.prototype.getDescription = function(language = 'en') {
  return this.description && this.description[language] ? this.description[language] : this.description?.en || '';
};

Category.prototype.getMetaTitle = function(language = 'en') {
  return this.metaTitle && this.metaTitle[language] ? this.metaTitle[language] : this.metaTitle?.en || this.getName(language);
};

Category.prototype.getMetaDescription = function(language = 'en') {
  return this.metaDescription && this.metaDescription[language] ? this.metaDescription[language] : this.metaDescription?.en || '';
};

Category.prototype.isRoot = function() {
  return this.level === 0 && !this.parentId;
};

Category.prototype.hasChildren = async function() {
  const childCount = await Category.count({ where: { parentId: this.id } });
  return childCount > 0;
};

Category.prototype.getChildren = function(options = {}) {
  return Category.findAll({
    where: { parentId: this.id },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    ...options
  });
};

Category.prototype.getParent = function() {
  if (!this.parentId) return null;
  return Category.findByPk(this.parentId);
};

Category.prototype.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parentId) {
    const parent = await Category.findByPk(current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
};

Category.prototype.getBreadcrumb = async function(language = 'en') {
  const ancestors = await this.getAncestors();
  const breadcrumb = ancestors.map(cat => ({
    id: cat.id,
    name: cat.getName(language),
    slug: cat.slug,
    path: cat.path
  }));
  
  breadcrumb.push({
    id: this.id,
    name: this.getName(language),
    slug: this.slug,
    path: this.path
  });
  
  return breadcrumb;
};

Category.prototype.updateProductCount = async function() {
  const Product = require('./Product');
  const count = await Product.count({
    where: { 
      categoryId: this.id,
      status: 'active'
    }
  });
  
  this.productCount = count;
  await this.save();
  
  // Update parent counts recursively
  if (this.parentId) {
    const parent = await Category.findByPk(this.parentId);
    if (parent) {
      await parent.updateProductCount();
    }
  }
};

// Class methods
Category.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Category.findByPath = function(path) {
  return this.findOne({ where: { path } });
};

Category.findRoots = function(options = {}) {
  return this.findAll({
    where: { parentId: null, status: 'active', isVisible: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    ...options
  });
};

Category.findFeatured = function(limit = 10) {
  return this.findAll({
    where: { isFeatured: true, status: 'active', isVisible: true },
    limit,
    order: [['sortOrder', 'ASC'], ['name', 'ASC']]
  });
};

Category.buildTree = async function(parentId = null, language = 'en') {
  const categories = await this.findAll({
    where: { 
      parentId,
      status: 'active',
      isVisible: true
    },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']]
  });
  
  const tree = [];
  for (const category of categories) {
    const children = await this.buildTree(category.id, language);
    tree.push({
      id: category.id,
      name: category.getName(language),
      slug: category.slug,
      path: category.path,
      image: category.image,
      icon: category.icon,
      productCount: category.productCount,
      children
    });
  }
  
  return tree;
};

// Helper functions
async function generateUniqueSlug(text, model, excludeId = null) {
  let baseSlug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const whereClause = { slug };
    if (excludeId) {
      whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }
    
    const existing = await model.findOne({ where: whereClause });
    if (!existing) break;
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

async function updateChildrenPaths(category) {
  const children = await Category.findAll({ where: { parentId: category.id } });
  
  for (const child of children) {
    child.path = category.path ? `${category.path}/${child.slug}` : child.slug;
    child.level = category.level + 1;
    await child.save();
    
    // Recursively update grandchildren
    await updateChildrenPaths(child);
  }
}

async function updateParentProductCounts(parentId) {
  if (!parentId) return;
  
  const parent = await Category.findByPk(parentId);
  if (parent) {
    await parent.updateProductCount();
  }
}

module.exports = Category;