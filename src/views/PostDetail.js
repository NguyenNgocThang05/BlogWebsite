import apiClient from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      post: null,
      loading: true,
      comments: [],
      newComment: '',
      commentLoading: false
    };
  },
  
  computed: {
    isAuthor() {
      if (!this.post || !this.currentUser) return false;
      return this.post.author?._id === this.currentUser._id;
    },
    
    authStore() {
      return useAuthStore();
    }
  },
  
  async created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    await this.fetchPost();
    await this.fetchComments();
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
          this.$router.push('/');
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        }
      }
    },
    
    // ===== COMMENT METHODS =====
    async fetchComments() {
      try {
        const response = await apiClient.get(`/comments/${this.$route.params.id}`);
        this.comments = response.data || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
        this.comments = [];
      }
    },
    
    async submitComment() {
      if (!this.newComment.trim()) return;
      
      this.commentLoading = true;
      try {
        const response = await apiClient.post('/comments', {
          content: this.newComment.trim(),
          postId: this.$route.params.id
        });
        this.comments.unshift(response.data);
        this.newComment = '';
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment');
      } finally {
        this.commentLoading = false;
      }
    },
    
    isCommentAuthor(comment) {
      if (!this.currentUser || !comment.author) return false;
      return String(comment.author._id) === String(this.currentUser._id);
    },
    
    async deleteComment(commentId) {
      if (!confirm('Delete this comment?')) return;
      try {
        await apiClient.delete(`/comments/${commentId}`);
        this.comments = this.comments.filter(c => c._id !== commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    },
    
    // ===== UTILITY METHODS =====
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    
    timeAgo(date) {
      const now = new Date();
      const past = new Date(date);
      const diff = Math.floor((now - past) / 1000);
      
      if (diff < 60) return 'Just now';
      if (diff < 3600) return Math.floor(diff / 60) + 'm';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h';
      if (diff < 604800) return Math.floor(diff / 86400) + 'd';
      return past.toLocaleDateString();
    }
  }
};