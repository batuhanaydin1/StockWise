import api from './api';

export const productService = {
  // Tüm ürünleri filtre ve sıralama ile getirir
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // ID'ye göre ürün detayı getirir
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Kritik stoktaki ürünleri getirir
  getLowStock: async () => {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  // Son kullanma tarihi geçmiş ürünleri getirir
  getExpired: async () => {
    const response = await api.get('/products/expired');
    return response.data;
  },

  // Tarihi yaklaşan ürünleri getirir (varsayılan 7 gün)
  getNearingExpiration: async (days = 7) => {
    const response = await api.get('/products/nearing-expiration', {
      params: { days },
    });
    return response.data;
  },

  // Kontrol paneli sayaçlarını getirir
  getDashboardSummary: async () => {
    const response = await api.get('/products/dashboard-summary');
    return response.data;
  },

  // Yeni ürün ekler
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Ürünü günceller
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Ürünü siler
  delete: async (id) => {
    await api.delete(`/products/${id}`);
    return true;
  },
};
