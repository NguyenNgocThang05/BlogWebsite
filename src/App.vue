<template>
  <div id="app">
    <!-- Only show navbar if logged in or on public pages -->
    <nav v-if="showNavbar" class="navbar">
      <div class="container">
        <router-link to="/" class="logo">📝 My Blog</router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link v-if="isLoggedIn" to="/dashboard">Dashboard</router-link>
          <router-link v-if="isLoggedIn" to="/create">New Post</router-link>
          <a v-if="isLoggedIn" @click="logout" href="#" class="logout">Logout</a>
        </div>
      </div>
    </nav>
    
    <!-- Show simple header for login/register -->
    <div v-else class="auth-header">
      <div class="container">
        <router-link to="/" class="logo">📝 My Blog</router-link>
      </div>
    </div>
    
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    showNavbar() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  watch: {
    $route(to) {
      const isLoggedIn = !!localStorage.getItem('token');
      const protectedRoutes = ['Home', 'Dashboard', 'CreatePost', 'PostDetail', 'EditPost'];
      
      if (protectedRoutes.includes(to.name) && !isLoggedIn) {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<!-- Import all CSS files -->
<style>
@import './assets/css/main.css';
@import './assets/css/components.css';
</style>