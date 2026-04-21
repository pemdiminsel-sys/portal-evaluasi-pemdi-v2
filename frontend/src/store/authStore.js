import { create } from 'zustand';
import api from '../services/api';
import { supabase } from '../services/supabase';

const getSafeUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

const getSafeToken = () => {
  const token = localStorage.getItem('token');
  // Hapus token yang tidak valid (undefined, null, string kosong)
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  return token;
};

const useAuthStore = create((set) => ({
  user: getSafeUser(),
  token: getSafeToken(),
  isAuthenticated: !!getSafeToken(),
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

      const { user } = data;
      // Edge function tidak mengembalikan token — generate pseudo-token dari user id
      const token = `auth_${user.id}_${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error('Full login error:', error);
      
      let errorMsg = 'Terjadi kesalahan sistem.';
      if (error.message) {
        errorMsg = `Supabase Error: ${error.message}`;
      } else if (!error.response) {
        errorMsg = 'Gagal terhubung ke Server Supabase. Cek koneksi internet atau firewall.';
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
