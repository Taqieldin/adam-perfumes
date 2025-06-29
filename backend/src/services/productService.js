const { Product, Category, Review, Inventory, Branch, WishList, Offer } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class ProductService {
  // Get all products with filters and pagination
  async getProducts(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        inStock = true,
        featured,
        onSale
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = { isActive: true };
      const includeClause = [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'nameAr', 'slug']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating'],
          required: false
        }
      ];

      // Apply filters
      if (category) {
        whereClause.categoryId = category;
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { nameAr: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { descriptionAr: { [Op.like]: `%${search}%` } },
          { tags: { [Op.like]: `%${search}%` } }
        ];
      }

      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = minPrice;
        if (maxPrice) whereClause.price[Op.lte] = maxPrice;
      }

      if (featured !== undefined) {
        whereClause.isFeatured = featured;
      }

      if (onSale !== undefined) {
        whereClause.isOnSale = onSale;
      }

      // Add inventory check if inStock filter is applied
      if (inStock) {
        includeClause.push({
          model: Inventory,
          as: 'inventory',
          attributes: ['quantity', 'availableQuantity'],
          where: { quantity: { [Op.gt]: 0 } },
          required: true
        });
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true
      });

      // Calculate average rating for each product
      const productsWithRating = rows.map(product => {
        const productData = product.toJSON();
        const reviews = productData.reviews || [];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        delete productData.reviews;
        return {
          ...productData,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length
        };
      });

      return {
        products: productsWithRating,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching products:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  // Get single product by ID
  async getProductById(productId, userId = null) {
    try {
      const product = await Product.findOne({
        where: { id: productId, isActive: true },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'nameAr', 'slug']
          },
          {
            model: Review,
            as: 'reviews',
            attributes: ['id', 'rating', 'comment', 'createdAt'],
            include: [{
              model: require('../models').User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }]
          },
          {
            model: Inventory,
            as: 'inventory',
            include: [{
              model: Branch,
              as: 'branch',
              attributes: ['id', 'name', 'nameAr', 'city']
            }]
          }
        ]
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const productData = product.toJSON();
      
      // Calculate average rating
      const reviews = productData.reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Calculate total stock across all branches
      const totalStock = productData.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;

      // Check if product is in user's wishlist
      let isInWishlist = false;
      if (userId) {
        const wishlistItem = await WishList.findOne({
          where: { userId, productId, isActive: true }
        });
        isInWishlist = !!wishlistItem;
      }

      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        totalStock,
        isInWishlist
      };
    } catch (error) {
      logger.error('Error fetching product:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch product', 500);
    }
  }

  // Update product (Admin only)
  async updateProduct(productId, updateData, updatedBy) {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Update product fields
      await product.update({
        ...updateData,
        updatedBy
      });

      logger.info(`Product ${productId} updated by user ${updatedBy}`);

      return await this.getProductById(productId);
    } catch (error) {
      logger.error(`Error updating product ${productId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update product', 500);
    }
  }

  // Create new product (Admin only)
  async createProduct(productData, createdBy) {
    try {
      const product = await Product.create({
        ...productData,
        createdBy
      });

      return await this.getProductById(product.id);
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new AppError('Failed to create product', 500);
    }
  }

  // Delete product (Admin only) - Soft delete
  async deleteProduct(productId, deletedBy) {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Soft delete by setting isActive to false
      product.isActive = false;
      product.updatedBy = deletedBy; // Track who performed the action
      await product.save();

      logger.info(`Product ${productId} soft-deleted by user ${deletedBy}`);

      return { message: 'Product deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting product ${productId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete product', 500);
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const products = await Product.findAll({
        where: { 
          isActive: true, 
          isFeatured: true 
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'nameAr']
          }
        ],
        limit: parseInt(limit),
        order: [['featuredOrder', 'ASC'], ['createdAt', 'DESC']]
      });

      return products;
    } catch (error) {
      logger.error('Error fetching featured products:', error);
      throw new AppError('Failed to fetch featured products', 500);
    }
  }

  // Get products on sale
  async getSaleProducts(limit = 20) {
    try {
      const products = await Product.findAll({
        where: { 
          isActive: true, 
          isOnSale: true,
          salePrice: { [Op.lt]: Product.sequelize.col('price') }
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'nameAr']
          }
        ],
        limit: parseInt(limit),
        order: [['saleEndDate', 'ASC']]
      });

      return products;
    } catch (error) {
      logger.error('Error fetching sale products:', error);
      throw new AppError('Failed to fetch sale products', 500);
    }
  }

  // Get related products
  async getRelatedProducts(productId, limit = 6) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const relatedProducts = await Product.findAll({
        where: {
          id: { [Op.ne]: productId },
          categoryId: product.categoryId,
          isActive: true
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'nameAr']
          }
        ],
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });

      return relatedProducts;
    } catch (error) {
      logger.error('Error fetching related products:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch related products', 500);
    }
  }

  // Search products with advanced filters
  async searchProducts(searchQuery, filters = {}) {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        rating,
        inStock = true,
        sortBy = 'relevance'
      } = filters;

      let whereClause = {
        isActive: true,
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } },
          { nameAr: { [Op.like]: `%${searchQuery}%` } },
          { description: { [Op.like]: `%${searchQuery}%` } },
          { descriptionAr: { [Op.like]: `%${searchQuery}%` } },
          { tags: { [Op.like]: `%${searchQuery}%` } }
        ]
      };

      // Apply additional filters
      if (category) whereClause.categoryId = category;
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = minPrice;
        if (maxPrice) whereClause.price[Op.lte] = maxPrice;
      }

      const includeClause = [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'nameAr']
        }
      ];

      if (inStock) {
        includeClause.push({
          model: Inventory,
          as: 'inventory',
          where: { quantity: { [Op.gt]: 0 } },
          required: true
        });
      }

      let orderClause = [['createdAt', 'DESC']];
      if (sortBy === 'price_low') orderClause = [['price', 'ASC']];
      if (sortBy === 'price_high') orderClause = [['price', 'DESC']];
      if (sortBy === 'newest') orderClause = [['createdAt', 'DESC']];

      const products = await Product.findAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: 50 // Limit search results
      });

      return products;
    } catch (error) {
      logger.error('Error searching products:', error);
      throw new AppError('Failed to search products', 500);
    }
  }

  // Get product inventory across branches
  async getProductInventory(productId) {
    try {
      const inventory = await Inventory.findAll({
        where: { productId },
        include: [
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'nameAr', 'city', 'phone']
          }
        ],
        order: [['quantity', 'DESC']]
      });

      return inventory;
    } catch (error) {
      logger.error('Error fetching product inventory:', error);
      throw new AppError('Failed to fetch product inventory', 500);
    }
  }

  // Update product inventory (Admin only)
  async updateInventory(productId, branchId, quantity, updatedBy) {
    try {
      const [inventory, created] = await Inventory.findOrCreate({
        where: { productId, branchId },
        defaults: { quantity, updatedBy }
      });

      if (!created) {
        await inventory.update({ quantity, updatedBy });
      }

      return inventory;
    } catch (error) {
      logger.error('Error updating inventory:', error);
      throw new AppError('Failed to update inventory', 500);
    }
  }
}

module.exports = ProductService;