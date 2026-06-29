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
          this.$router.push('/');
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        }
      }
    }
  }
};