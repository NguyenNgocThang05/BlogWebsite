<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="logo">📝 My Blog</router-link>
        <div class="nav-links">
          <router-link v-if="authStore.isLoggedIn" to="/">Dashboard</router-link>
          <router-link v-if="authStore.isLoggedIn" to="/create">New Post</router-link>
          <router-link v-if="!authStore.isLoggedIn" to="/login">Login</router-link>
          <router-link v-if="!authStore.isLoggedIn" to="/register">Register</router-link>
          <a v-if="authStore.isLoggedIn" @click="handleLogout" href="#" class="logout">Logout</a>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    handleLogout() {
      this.authStore.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/components.css';
</style>