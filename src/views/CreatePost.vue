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
        
        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input v-model="post.tagsInput" type="text" placeholder="e.g., vue, javascript, node" />
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Creating...' : 'Create Post' }}
          </button>
          <router-link to="/" class="btn-secondary">Cancel</router-link>
        </div>
        
        <div v-if="message" :class="['message', error ? 'error' : 'success']">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import CreatePost from './CreatePost.js';
export default CreatePost;
</script>

<style scoped>
@import '../assets/css/posts.css';
</style>