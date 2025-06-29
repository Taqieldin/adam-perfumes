/** @typedef {import('@shared/types/user').User} User */

import apiClient from '../utils/api';

const userService = {
  /**
   * Get the current user's profile
   * @returns {Promise<User>} The user's profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Update the current user's profile
   * @param {Partial<User>} profileData - The data to update
   * @returns {Promise<User>} The updated user profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch('/users/me', profileData);
      return response.data.data.user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error.response?.data || error;
    }
  },
};

export default userService;
