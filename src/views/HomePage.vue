<template>
  <div class="home">
    <div class="container">
      <h1>Latest Posts</h1>
      
      <!-- Show loading -->
      <div v-if="loading" class="loading">Loading posts...</div>
      
      <!-- Show empty state -->
      <div v-else-if="posts.length === 0" class="empty">
        <p>No posts yet. Be the first to create one!</p>
        <router-link to="/create" class="btn-primary">Create Your First Post</router-link>
      </div>
      
      <!-- Show posts -->
      <div v-else class="posts-grid">
        <div v-for="post in posts" :key="post._id" class="post-card">
          <router-link :to="`/post/${post._id}`">
            <h2>{{ post.title }}</h2>
            <p class="excerpt">{{ post.excerpt || post.content.substring(0, 150) + '...' }}</p>
            <div class="post-meta">
              <span>By {{ post.author?.username || 'Unknown' }}</span>
              <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
            <div v-if="post.category" class="category">
              {{ post.category }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
  data() {
    return {
      posts: [],
      loading: true
    };
  },
  async created() {
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await apiClient.get('/posts');
        this.posts = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        // If unauthorized, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>@import '../assets/css/posts.css';</style>