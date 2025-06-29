/** @typedef {import('@shared/types/product').Product} Product */

import apiClient from '../utils/api';

const productService = {
  /**
   * Get all products
   * @param {object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise<{data: Product[], total: number, page: number, limit: number}>} The response data from the API
   */
  getProducts: async (params) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get a single product by its ID
   * @param {string} id - The ID of the product
   * @returns {Promise<Product>} The response data from the API
   */
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },
};

export default productService;
