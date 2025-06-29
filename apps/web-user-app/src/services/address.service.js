import apiClient from './api-client';

const addressService = {
  createAddress(addressData) {
    return apiClient.post('/addresses', addressData);
  },

  updateAddress(addressId, addressData) {
    return apiClient.patch(`/addresses/${addressId}`, addressData);
  },

  deleteAddress(addressId) {
    return apiClient.delete(`/addresses/${addressId}`);
  },

  setDefaultAddress(addressId) {
    return apiClient.post(`/addresses/${addressId}/set-default`);
  },
};

export default addressService;
