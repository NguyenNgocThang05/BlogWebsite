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
      <button type="submit" :disabled="loading" class="btn-primary">
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
import LoginPage from './LoginPage.js';
export default LoginPage;
</script>

<style scoped>
@import '../assets/css/auth.css';
</style>