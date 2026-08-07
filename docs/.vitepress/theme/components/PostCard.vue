<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Post } from '../../../posts.data';

defineProps<{
  post: Post;
}>();
</script>

<template>
  <article class="post-card">
    <span class="post-card__folder" aria-hidden="true"></span>
    <div class="post-card__content">
      <h3><a :href="withBase(post.url)">{{ post.title }}</a></h3>
      <p>{{ post.description }}</p>
    </div>
    <time class="post-card__meta" :datetime="post.date.value">{{ post.date.label }}</time>
  </article>
</template>
