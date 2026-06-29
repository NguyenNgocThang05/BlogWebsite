<template>
  <div class="post-detail">
    <div class="container">
      <div v-if="loading" class="loading">Loading post...</div>
      <div v-else-if="post" class="post">
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>By {{ post.author?.username || 'Unknown' }}</span>
          <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <span v-if="post.category" class="category">{{ post.category }}</span>
        </div>
        <div class="content">{{ post.content }}</div>
        <div v-if="post.tags && post.tags.length" class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
        <div v-if="isAuthor" class="actions">
          <router-link :to="`/edit/${post._id}`" class="btn-edit">Edit Post</router-link>
          <button @click="deletePost" class="btn-delete">Delete Post</button>
        </div>
        <router-link to="/" class="back-link">← Back to Home</router-link>
      </div>
      <div v-else class="not-found">
        <h2>Post not found</h2>
        <router-link to="/">Go back home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import PostDetail from './PostDetail.js';
export default PostDetail;
</script>

<style scoped>@import '../assets/css/posts.css';</style>