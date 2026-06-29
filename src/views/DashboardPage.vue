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
import apiClient from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      posts: [],
      loading: true,
      user: null
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    }
  },
  async created() {
    // Get current user from store
    this.user = this.authStore.user;
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      this.loading = true;
      try {
        const response = await apiClient.get('/posts');
        this.posts = response.data;
        console.log('Posts fetched:', this.posts.length);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response && error.response.status === 401) {
          this.authStore.logout();
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    
    // Check if current user is the author
    isAuthor(post) {
      if (!this.user || !post) return false;
  
      // Get author ID - handles both object and string
      const authorId = post.author?._id || post.author?.id || post.author;
      const userId = this.user._id || this.user.id || this.user;
  
      // Compare as strings
      return String(authorId) === String(userId);
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

<style scoped>
@import '../assets/css/dashboard.css';

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h1 {
  margin: 0;
}

.welcome {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.welcome p {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.category-badge {
  background: #42b883;
  color: white;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.author {
  color: #42b883;
  font-weight: 500;
}

.meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}
</style>