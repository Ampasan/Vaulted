import api from './api';

export const paymentService = {
  chargeCard: async (paymentData) => {
    console.log("chargeCard payload:", JSON.stringify(paymentData, null, 2));
    try {
      const response = await api.post('/payments/charge', paymentData);
      console.log("chargeCard response:", response.data);
      return response.data;
    } catch (error) {
      console.error("chargeCard error response:", error.response?.data || error.message);
      throw error;
    }
  },

  createVirtualAccount: async (data) => {
    try {
      const response = await api.post('/payments/create-va', data);
      return response.data;
    } catch (error) {
      console.error("createVirtualAccount error response:", error.response?.data || error.message);
      throw error;
    }
  },

  getSavedCards: async () => {
    const response = await api.get('/payments/saved-cards');
    return response.data;
  },
};

export default paymentService;