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