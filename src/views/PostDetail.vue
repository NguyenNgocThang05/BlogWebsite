<template>
  <div class="post-detail">
    <div class="container">
      <div v-if="loading" class="loading">Loading post...</div>
      <div v-else-if="post" class="post">
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>By {{ post.author?.username || 'Unknown' }}</span>
          <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <span v-if="post.category" class="category">{{ post.category }}</span>
        </div>
        <div class="content">{{ post.content }}</div>
        <div v-if="post.tags && post.tags.length" class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <div v-if="isAuthor" class="actions">
          <router-link :to="`/edit/${post._id}`" class="btn-edit">Edit Post</router-link>
          <button @click="deletePost" class="btn-delete">Delete Post</button>
        </div>
        <router-link to="/" class="back-link">← Back to Home</router-link>
      </div>
      <div v-else class="not-found">
        <h2>Post not found</h2>
        <router-link to="/">Go back home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
  data() {
    return {
      post: null,
      loading: true,
      currentUser: null
    };
  },
  computed: {
    isAuthor() {
      if (!this.post || !this.currentUser) return false;
      return this.post.author?._id === this.currentUser._id;
    }
  },
  async created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    await this.fetchPost();
  },
  methods: {
    async fetchPost() {
      try {
        const response = await apiClient.get(`/posts/${this.$route.params.id}`);
        this.post = response.data;
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        this.loading = false;
      }
    },
    async deletePost() {
      if (confirm('Are you sure you want to delete this post?')) {
        try {
          await apiClient.delete(`/posts/${this.post._id}`);
          this.$router.push('/dashboard');
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        }
      }
    }
  }
};
</script>

<style scoped>@import '../assets/css/posts.css';</style>