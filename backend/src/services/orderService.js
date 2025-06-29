const { Order, OrderItem, Product, Cart, CartItem } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class OrderService {
  /**
   * Get all orders for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Order[]>}
   */
  async getOrdersForUser(userId) {
    try {
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'nameAr', 'images'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!orders) {
        return [];
      }

      return orders;
    } catch (error) {
      logger.error(`Error fetching orders for user ${userId}:`, error);
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  /**
   * Create a new order from the user's cart.
   * @param {string} userId - The ID of the user creating the order.
   * @param {object} orderData - Data for the order (e.g., shippingAddressId, paymentMethod).
   * @returns {Promise<Order>}
   */
  async createOrder(userId, orderData) {
    const { shippingAddressId, billingAddressId, paymentMethod } = orderData;
    const sequelize = require('../config/database').sequelize;
    let transaction;

    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      // 1. Get the user's cart and items
      const cart = await Cart.findOne({
        where: { userId, status: 'active' },
        include: {
          model: CartItem,
          as: 'cartItems',
          include: { model: Product, as: 'product', include: ['inventory'] },
        },
        transaction,
      });

      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        throw new AppError('Your cart is empty.', 400);
      }

      const { cartItems } = cart;

      // 2. Validate stock and prepare order items
      const orderItemsData = [];
      let subtotal = 0;

      for (const item of cartItems) {
        const product = item.product;
        if (!product || !product.inventory || product.inventory.availableQuantity < item.quantity) {
          throw new AppError(`Sorry, '${product.name}' is out of stock.`, 400);
        }
        subtotal += item.totalPrice;
        orderItemsData.push({
          productId: item.productId,
          productSku: product.sku,
          productName: product.name,
          productImage: product.images[0]?.url,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
      }

      // 3. Create the Order
      const totalAmount = subtotal + (cart.shippingCost || 0) - (cart.discountAmount || 0) + (cart.taxAmount || 0);
      const order = await Order.create({
        userId,
        orderNumber: `AP-${Date.now()}`,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingAddressId,
        billingAddressId,
        subtotal: cart.subtotal,
        shippingAmount: cart.shippingCost,
        discountAmount: cart.discountAmount,
        taxAmount: cart.taxAmount,
        totalAmount: cart.totalAmount,
        currency: cart.currency,
      }, { transaction });

      // 4. Create OrderItems
      const finalOrderItems = orderItemsData.map(item => ({ ...item, orderId: order.id }));
      await OrderItem.bulkCreate(finalOrderItems, { transaction });

      // 5. Update inventory for each product
      for (const item of cartItems) {
        const productInventory = item.product.inventory;
        await productInventory.decrement('availableQuantity', { by: item.quantity, transaction });
      }

      // 6. Update and clear the cart
      cart.status = 'converted';
      cart.orderId = order.id;
      cart.convertedAt = new Date();
      await cart.save({ transaction });
      await CartItem.destroy({ where: { cartId: cart.id }, transaction });

      // Commit the transaction
      await transaction.commit();

      logger.info(`Order ${order.id} created successfully for user ${userId}`);
      return order;

    } catch (error) {
      // Rollback the transaction if any error occurs
      if (transaction) await transaction.rollback();
      logger.error(`Error creating order for user ${userId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create order.', 500);
    }
  }

  /**
   * Get a single order by ID, with authorization check.
   * @param {string} orderId - The ID of the order.
   * @param {object} user - The authenticated user object.
   * @returns {Promise<Order>}
   */
  async getOrderById(orderId, user) {
    try {
      const order = await Order.findOne({
        where: { id: orderId },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'nameAr', 'images', 'slug'],
              },
            ],
          },
          {
            model: require('../models').User,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: require('../models').Address,
            as: 'shippingAddress',
          },
          {
            model: require('../models').Address,
            as: 'billingAddress',
          },
        ],
      });

      if (!order) {
        throw new AppError('Order not found.', 404);
      }

      // Authorization check: User must be the owner or an admin
      if (order.userId !== user.id && user.role !== 'admin') {
        throw new AppError('You are not authorized to view this order.', 403);
      }

      return order;
    } catch (error) {
      logger.error(`Error fetching order ${orderId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch order.', 500);
    }
  }

  /**
   * Cancel an order.
   * @param {string} orderId - The ID of the order to cancel.
   * @param {object} user - The authenticated user object.
   * @returns {Promise<Order>}
   */
  async cancelOrder(orderId, user) {
    const sequelize = require('../config/database').sequelize;
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const order = await Order.findOne({
        where: { id: orderId },
        include: [{ model: OrderItem, as: 'orderItems' }],
        transaction,
      });

      if (!order) {
        throw new AppError('Order not found.', 404);
      }

      if (order.userId !== user.id) {
        throw new AppError('You are not authorized to cancel this order.', 403);
      }

      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new AppError(`Order cannot be cancelled. Current status: ${order.status}`, 400);
      }

      // Update order status
      order.status = 'cancelled';
      // Assuming payment will be refunded. This might trigger another process.
      order.paymentStatus = 'refunded'; 
      await order.save({ transaction });

      // Restore inventory
      for (const item of order.orderItems) {
        await Product.increment('inventory.availableQuantity', {
          by: item.quantity,
          where: { id: item.productId },
          transaction,
        });
      }

      await transaction.commit();

      logger.info(`Order ${orderId} cancelled by user ${user.id}`);
      return order;

    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`Error cancelling order ${orderId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel order.', 500);
    }
  }

  /**
   * Get all orders (for admins).
   * @param {object} filters - Filtering and pagination options.
   * @returns {Promise<{orders: Order[], pagination: object}>}
   */
  async getAllOrders(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        userId,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Apply filters
      if (status) {
        whereClause.status = status;
      }
      if (userId) {
        whereClause.userId = userId;
      }
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        whereClause.createdAt = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        whereClause.createdAt = {
          [Op.lte]: new Date(endDate),
        };
      }

      const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: require('../models').User,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true,
      });

      return {
        orders: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching all orders:', error);
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  /**
   * Update the status of an order (Admin).
   * @param {string} orderId - The ID of the order.
   * @param {string} status - The new status.
   * @returns {Promise<Order>}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'refunded',
        'returned',
        'failed',
      ];

      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status: ${status}.`, 400);
      }

      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new AppError('Order not found.', 404);
      }

      order.status = status;
      await order.save();

      // TODO: Trigger notifications or other events based on status change
      logger.info(`Order ${orderId} status updated to ${status} by an admin.`);

      return order;
    } catch (error) {
      logger.error(`Error updating status for order ${orderId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update order status.', 500);
    }
  }

  /**
   * Handle a successful payment for an order.
   * @param {string} orderId - The ID of the order.
   * @param {string} transactionId - The payment transaction ID.
   * @returns {Promise<Order>}
   */
  async handleSuccessfulPayment(orderId, transactionId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        // If order not found, it's a critical issue but not a client error.
        // We log it and let the webhook return a success to Stripe.
        logger.error(`Webhook received for non-existent order ID: ${orderId}`);
        return;
      }

      order.status = 'confirmed';
      order.paymentStatus = 'paid';
      order.paymentTransactionId = transactionId;
      await order.save();

      logger.info(`Order ${orderId} marked as paid. Transaction ID: ${transactionId}`);
      // TODO: Trigger user notification about successful payment

      return order;

    } catch (error) {
      logger.error(`Failed to handle successful payment for order ${orderId}:`, error);
      // We throw here to potentially let a higher-level system know about the failure.
      throw new AppError(`Failed to update order ${orderId} after payment.`, 500);
    }
  }
}

module.exports = OrderService;
