<template>
  <div class="create-post">
    <div class="container">
      <h1>Create New Post</h1>
      <form @submit.prevent="createPost">
        <div class="form-group">
          <label>Title *</label>
          <input v-model="post.title" type="text" required />
        </div>
        
        <div class="form-group">
          <label>Content *</label>
          <textarea v-model="post.content" rows="10" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Excerpt (optional)</label>
          <textarea v-model="post.excerpt" rows="3" placeholder="Short summary..."></textarea>
        </div>
        
        <div class="form-group">
          <label>Category</label>
          <input v-model="post.category" type="text" placeholder="e.g., Technology" />
        </div>
        
        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input v-model="post.tagsInput" type="text" placeholder="e.g., vue, javascript, node" />
        </div>
        
        <div class="form-group">
          <label>Status</label>
          <select v-model="post.status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Post' }}
          </button>
          <router-link to="/dashboard" class="btn-cancel">Cancel</router-link>
        </div>
        
        <div v-if="message" :class="['message', error ? 'error' : 'success']">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tagsInput: '',
        status: 'draft'
      },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    async createPost() {
      this.loading = true;
      this.message = '';
      this.error = false;
      
      const postData = {
        title: this.post.title,
        content: this.post.content,
        excerpt: this.post.excerpt,
        category: this.post.category || 'Uncategorized',
        tags: this.post.tagsInput ? this.post.tagsInput.split(',').map(t => t.trim()) : [],
        status: this.post.status
      };
      
      try {
        await apiClient.post('/posts', postData);
        this.message = 'Post created successfully!';
        this.error = false;
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1500);
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to create post';
        this.error = true;
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>@import '../assets/css/posts.css';</style>