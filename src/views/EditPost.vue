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
            <select v-model="post.category">
              <option value="">Select a category...</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Saving...' : 'Update Post' }}
            </button>
            <router-link to="/" class="btn-secondary">Cancel</router-link>
          </div>
          
          <div v-if="message" :class="['message', error ? 'error' : 'success']">
            {{ message }}
          </div>
        </form>
      </div>
      <div v-else class="not-found">
        <h2>Post not found</h2>
        <p>The post you're looking for doesn't exist or has been deleted.</p>
        <router-link to="/" class="btn-primary">Go back to dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

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
        
        // Check if current user is the author
        const authStore = useAuthStore();
        if (this.post.author?._id !== authStore.user?._id) {
          this.message = "You don't have permission to edit this post";
          this.error = true;
          setTimeout(() => this.$router.push('/'), 2000);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        if (error.response && error.response.status === 404) {
          this.message = 'Post not found';
          this.error = true;
        }
      } finally {
        this.loading = false;
      }
    },
    async updatePost() {
      this.saving = true;
      this.message = '';
      this.error = false;
      
      try {
        await apiClient.put(`/posts/${this.post._id}`, this.post);
        this.message = 'Post updated successfully!';
        this.error = false;
        this.saving = false;
        setTimeout(() => {
          this.$router.push(`/post/${this.post._id}`);
        }, 1500);
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to update post';
        this.error = true;
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
@import '../assets/css/posts.css';

/* Extra style for the not found page */
.not-found {
  text-align: center;
  padding: 50px 0;
}

.not-found h2 {
  color: #333;
  margin-bottom: 15px;
}

.not-found p {
  color: #666;
  margin-bottom: 20px;
}
</style>