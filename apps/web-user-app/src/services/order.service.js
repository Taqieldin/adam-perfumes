/** @typedef {import('@shared/types/order').Order} Order */

import apiClient from '../utils/api';

const orderService = {
  /**
   * Get all orders for the current user
   * @returns {Promise<Order[]>} A list of the user's orders
   */
  getOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get a single order by its ID
   * @param {string} id - The ID of the order
   * @returns {Promise<Order>} The order details
   */
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new order
   * @param {object} orderData - The data for the new order
   * @returns {Promise<Order>} The newly created order
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error.response?.data || error;
    }
  },
};

export default orderService;
