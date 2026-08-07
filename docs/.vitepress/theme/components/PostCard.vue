<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Post } from '../../../posts.data';

defineProps<{
  post: Post;
}>();
</script>

<template>
  <article class="post-card">
    <h3><a :href="withBase(post.url)">{{ post.title }}</a></h3>
    <time class="post-card__meta" :datetime="post.date.value">{{ post.date.label }}</time>
  </article>
</template>
