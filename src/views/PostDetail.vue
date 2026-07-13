<template>
  <div class="post-detail">
    <div class="container">
      <router-link to="/" class="back-link">← Back to Home</router-link>
      <br>
      <br>
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
          <button @click="deletePost" class="btn-danger">Delete Post</button>
        </div>

        <!-- ====== COMMENT SECTION ====== -->
        <div class="comment-section">
          <h3>Comments ({{ comments.length }})</h3>
          
          <!-- Add Comment -->
          <div v-if="authStore.isLoggedIn" class="add-comment">
            <div class="comment-avatar">
              {{ authStore.user?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="comment-input">
              <input 
                v-model="newComment" 
                placeholder="Write a comment..."
                @keyup.enter="submitComment"
              />
              <button @click="submitComment" :disabled="!newComment.trim() || commentLoading">
                Post
              </button>
            </div>
          </div>
          <p v-else class="login-prompt">
            <router-link to="/login">Login</router-link> to comment
          </p>

          <!-- Comments List -->
          <div v-if="commentLoading" class="loading-text">Loading comments...</div>
          <div v-else-if="comments.length === 0" class="no-comments">
            No comments yet. Be the first!
          </div>
          <div v-else class="comments-list">
            <div v-for="comment in comments" :key="comment._id" class="comment">
              <div class="comment-avatar-small">
                {{ comment.author?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="comment-body">
                <div class="comment-meta">
                  <span class="comment-author">{{ comment.author?.username || 'Unknown' }}</span>
                  <span class="comment-time">{{ timeAgo(comment.createdAt) }}</span>
                </div>
                <p>{{ comment.content }}</p>
                <button 
                  v-if="isCommentAuthor(comment)" 
                  @click="deleteComment(comment._id)"
                  class="delete-comment"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- ====== END COMMENT SECTION ====== -->

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