const axios = require('axios');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

const INSTAGRAM_API_URL = 'https://graph.instagram.com';

class InstagramService {
  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!this.accessToken) {
      logger.warn('INSTAGRAM_ACCESS_TOKEN is not set. Instagram integration will be disabled.');
    }

    this.api = axios.create({
      baseURL: INSTAGRAM_API_URL,
    });
  }

  /**
   * Fetches the latest media posts from the user's Instagram account.
   * @param {number} limit - The number of posts to fetch.
   * @returns {Promise<Array>}
   */
  async getLatestPosts(limit = 9) {
    if (!this.accessToken) {
      throw new AppError('Instagram integration is not configured.', 503);
    }

    try {
      // First, get the user's media IDs
      const mediaEdgeUrl = `/me/media`;
      const response = await this.api.get(mediaEdgeUrl, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
          access_token: this.accessToken,
          limit,
        },
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to fetch Instagram posts:', error.response ? error.response.data : error.message);
      throw new AppError('Could not retrieve Instagram posts.', 502);
    }
  }
}

module.exports = InstagramService;
