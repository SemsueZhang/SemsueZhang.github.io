<script setup lang="ts">
import type { Post } from '../../../posts.data';
import PostList from './PostList.vue';

const props = defineProps<{
  posts: Post[];
}>();
</script>

<template>
  <section class="post-directory" aria-label="文章目录">
    <PostList :posts="props.posts" />
  </section>
</template>
