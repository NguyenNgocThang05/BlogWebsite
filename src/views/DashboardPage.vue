<template>
  <div class="dashboard">
    <div class="container">
      <h1>My Dashboard</h1>
      <div v-if="user" class="welcome">
        <p>Welcome back, {{ user.username }}!</p>
        <router-link to="/create" class="btn-primary">Create New Post</router-link>
      </div>
      
      <div v-if="loading" class="loading">Loading your posts...</div>
      <div v-else-if="posts.length === 0" class="empty">
        <p>You haven't created any posts yet.</p>
        <router-link to="/create" class="btn-primary">Create Your First Post</router-link>
      </div>
      <div v-else class="posts-list">
        <div v-for="post in posts" :key="post._id" class="post-item">
          <div class="post-info">
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt || post.content.substring(0, 100) + '...' }}</p>
            <div class="meta">
              <span :class="['status', post.status]">
                {{ post.status }}
              </span>
              <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="post-actions">
            <router-link :to="`/post/${post._id}`" class="btn-view">View</router-link>
            <router-link :to="`/edit/${post._id}`" class="btn-edit">Edit</router-link>
            <button @click="deletePost(post._id)" class="btn-delete">Delete</button>
          </div>
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
      user: null,
      posts: [],
      loading: true
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    this.fetchMyPosts();
  },
  methods: {
    async fetchMyPosts() {
      try {
        const response = await apiClient.get('/posts/drafts');
        this.posts = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        this.loading = false;
      }
    },
    async deletePost(id) {
      if (confirm('Are you sure you want to delete this post?')) {
        try {
          await apiClient.delete(`/posts/${id}`);
          this.posts = this.posts.filter(post => post._id !== id);
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        }
      }
    }
  }
};
</script>

<style scoped>@import '../assets/css/dashboard.css'</style>