<template>
  <div class="auth-container">
    <h2>Create Account</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Username</label>
        <input v-model="user.username" type="text" required minlength="3" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="user.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="user.password" type="password" required minlength="6" />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      <div v-if="message" :class="['message', error ? 'error' : 'success']">
        {{ message }}
      </div>
    </form>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';

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
  try {
    const response = await apiClient.post('/auth/register', this.user);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    this.message = 'Registration successful!';
    this.error = false;
    setTimeout(() => this.$router.push('/dashboard'), 1000);
  } catch (err) {
    this.message = err.response?.data?.message || 'Registration failed';
    this.error = true;
  } finally {
    this.loading = false;
  }
}
  }
};
</script>

<style scoped>@import '../assets/css/auth.css';</style>