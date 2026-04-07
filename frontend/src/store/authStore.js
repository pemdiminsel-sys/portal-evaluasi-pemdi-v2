import { create } from 'zustand';
import api from '../services/api';
import { supabase } from '../services/supabase';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke('api', {
        body: { 
          action: 'login',
          email, 
          password 
        }
      });
      
      if (error) throw error;
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
