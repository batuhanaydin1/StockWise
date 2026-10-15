import api from './api';

export const categoryService = {
  // Tüm kategorileri getirir
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // ID'ye göre kategori getirir
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
