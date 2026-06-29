<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input v-model="credentials.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="credentials.password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <div v-if="message" :class="['message', error ? 'error' : 'success']">
        {{ message }}
      </div>
    </form>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';

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
  try {
    const response = await apiClient.post('/auth/login', this.credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    this.message = 'Login successful!';
    this.error = false;
    setTimeout(() => this.$router.push('/dashboard'), 1000);
  } catch (err) {
    this.message = err.response?.data?.message || 'Login failed';
    this.error = true;
  } finally {
    this.loading = false;
  }
}
  }
};
</script>

<style scoped>@import '../assets/css/auth.css';</style>