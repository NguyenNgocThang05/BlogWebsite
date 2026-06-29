import apiClient from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      credentials: { email: '', password: '' },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.message = '';
      this.error = false;
      
      try {
        const response = await apiClient.post('/auth/login', this.credentials);
        
        // Use the store - it handles localStorage automatically
        const authStore = useAuthStore();
        authStore.setAuth(response.data.token, response.data.user);
        
        this.message = 'Login successful!';
        this.error = false;
        
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
        
      } catch (err) {
        this.message = err.response?.data?.message || 'Login failed';
        this.error = true;
      } finally {
        this.loading = false;
      }
    }
  }
};