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