import api from './api';

export const assetService = {
  getMarketplaceItems: async () => {
    const response = await api.get('/marketplace');
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  getMyCollection: async () => {
    const response = await api.get('/items/my/collection');
    return response.data;
  },

  listItemOnMarketplace: async (itemId, price) => {
    const response = await api.post(`/marketplace/${itemId}/list`, { price });
    return response.data;
  },

  buyMarketplaceItem: async (itemId) => {
    const response = await api.post(`/marketplace/${itemId}/buy`);
    return response.data;
  },

  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  createAuction: async (auctionData) => {
    const response = await api.post('/auctions', auctionData);
    return response.data;
  },

  getAuctions: async (status) => {
    const response = await api.get('/auctions', { params: { status } });
    return response.data;
  },

  getAuctionById: async (id) => {
    const response = await api.get(`/auctions/${id}`);
    return response.data;
  },

  placeBid: async (id, amount) => {
    const response = await api.post(`/auctions/${id}/bid`, { amount });
    return response.data;
  },
};

export default assetService;
