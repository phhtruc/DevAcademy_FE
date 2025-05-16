import { defineStore } from 'pinia';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userData: {},
    userRole: null
  }),
  
  getters: {
    isAdmin: (state) => state.userRole === '[ADMIN]',
    isTeacher: (state) => state.userRole === '[TEACHER]',
    isUser: (state) => state.userRole === '[USER]'
  },
  
  actions: {
    checkAuth() {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const roles = localStorage.getItem('roles');
      
      if (token && userStr) {
        try {
          this.userData = JSON.parse(userStr);
          this.isLoggedIn = true;
          this.userRole = roles || 'USER';
          console.log('Auth state updated:', this.isLoggedIn, this.userRole);
        } catch (err) {
          console.error('Error parsing user data', err);
          this.logout();
        }
      } else {
        this.isLoggedIn = false;
        this.userData = {};
        this.userRole = null;
      }
    },
    
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('roles');
      localStorage.removeItem('user');
      
      this.isLoggedIn = false;
      this.userData = {};
      this.userRole = null;
      
      router.push('/');
    }
  }
});