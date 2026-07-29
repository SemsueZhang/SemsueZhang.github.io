<script setup lang="ts">
import type { Post } from '../../../posts.data';
import PostCard from './PostCard.vue';

defineProps<{
  posts: Post[];
}>();
</script>

<template>
  <div v-if="posts.length" class="post-list">
    <PostCard v-for="post in posts" :key="post.url" :post="post" />
  </div>
  <p v-else class="post-list__empty">暂时还没有已发布的文章。</p>
</template>
