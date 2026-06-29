<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>All Posts</h1>
        <router-link to="/create" class="btn-primary">Create New Post</router-link>
      </div>
      
      <div v-if="user" class="welcome">
        <p>Welcome back, {{ user.username }}!</p>
      </div>
      
      <!-- Show loading state -->
      <div v-if="loading" class="loading">Loading posts...</div>
      
      <!-- Show empty state -->
      <div v-else-if="posts.length === 0" class="empty">
        <p>No posts yet. Be the first to create one!</p>
        <router-link to="/create" class="btn-primary">Create Your First Post</router-link>
      </div>
      
      <!-- Show posts from ALL users -->
      <div v-else class="posts-list">
        <div v-for="post in posts" :key="post._id" class="post-item">
          <div class="post-info">
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt || post.content.substring(0, 100) + '...' }}</p>
            <div class="meta">
              <span class="author">By {{ post.author?.username || 'Unknown' }}</span>
              <span v-if="post.category" class="category-badge">{{ post.category }}</span>
              <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="post-actions">
            <router-link :to="`/post/${post._id}`" class="btn-view">View</router-link>
            <!-- Only show Edit/Delete if user is the author -->
            <router-link 
              v-if="isAuthor(post)" 
              :to="`/edit/${post._id}`" 
              class="btn-edit"
            >
              Edit
            </router-link>
            <button 
              v-if="isAuthor(post)" 
              @click="deletePost(post._id)" 
              class="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardPage from './DashboardPage.js';
export default DashboardPage;
</script>

<style scoped>
@import '../assets/css/dashboard.css';
</style>