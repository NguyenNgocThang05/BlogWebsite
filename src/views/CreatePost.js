import apiClient from '@/plugins/axios';

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tagsInput: '',
      },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    async createPost() {
      this.loading = true;
      this.message = '';
      this.error = false;
      
      const postData = {
        title: this.post.title,
        content: this.post.content,
        excerpt: this.post.excerpt,
        category: this.post.category || 'Uncategorized',
        tags: this.post.tagsInput ? this.post.tagsInput.split(',').map(t => t.trim()) : [],
      };
      
      try {
        await apiClient.post('/posts', postData);
        this.message = 'Post created successfully!';
        this.error = false;
        this.loading = false; //Reset loading on success
        setTimeout(() => {
          this.$router.push('/');
        }, 1500);
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to create post';
        this.error = true;
        this.loading = false; //Already false, but keep for clarity
      }
    }
  }
};