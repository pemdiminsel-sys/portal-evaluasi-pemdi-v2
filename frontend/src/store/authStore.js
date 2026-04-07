import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/login', {
        email,
        password,
        device_name: 'browser',
      });
      
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      let errorMsg = 'Terjadi kesalahan sistem.';
      
      if (!error.response) {
        errorMsg = 'Gagal terhubung ke Server. Periksa VITE_API_BASE_URL atau status Backend di Vercel.';
      } else {
        errorMsg = error.response.data.message || 'Email atau Password salah.';
      }

      return { success: false, message: errorMsg };
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
