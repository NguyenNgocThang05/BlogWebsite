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
import EditPost from './EditPost.js';
export default EditPost;
</script>

<style scoped>
@import '../assets/css/posts.css';
</style>