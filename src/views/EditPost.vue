<template>
  <div class="edit-post">
    <div class="container">
      <h1>Edit Post</h1>
      <div v-if="loading" class="loading">Loading post...</div>
      <div v-else-if="post">
        <form @submit.prevent="updatePost">
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
            <label>Status</label>
            <select v-model="post.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" :disabled="saving">
              {{ saving ? 'Saving...' : 'Update Post' }}
            </button>
            <router-link to="/dashboard" class="btn-cancel">Cancel</router-link>
          </div>
          
          <div v-if="message" :class="['message', error ? 'error' : 'success']">
            {{ message }}
          </div>
        </form>
      </div>
      <div v-else class="not-found">
        <h2>Post not found</h2>
        <router-link to="/dashboard">Go back to dashboard</router-link>
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
      saving: false,
      message: '',
      error: false
    };
  },
  async created() {
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
    async updatePost() {
      this.saving = true;
      this.message = '';
      this.error = false;
      
      try {
        const response = await apiClient.put(`/posts/${this.post._id}`, this.post);
        this.post = response.data;
        this.message = 'Post updated successfully!';
        this.error = false;
        setTimeout(() => {
          this.$router.push(`/post/${this.post._id}`);
        }, 1500);
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to update post';
        this.error = true;
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>@import '../assets/css/posts.css';</style>