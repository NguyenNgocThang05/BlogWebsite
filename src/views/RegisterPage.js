import apiClient from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      user: { username: '', email: '', password: '' },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    async register() {
      this.loading = true;
      this.message = '';
      this.error = false;
      
      try {
        const response = await apiClient.post('/auth/register', this.user);
        
        // Use the store - it handles localStorage automatically
        const authStore = useAuthStore();
        authStore.setAuth(response.data.token, response.data.user);
        
        this.message = 'Registration successful!';
        this.error = false;
        
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
        
      } catch (err) {
        this.message = err.response?.data?.message || 'Registration failed';
        this.error = true;
      } finally {
        this.loading = false;
      }
    }
  }
};