<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Post } from '../../../posts.data';
import TagList from './TagList.vue';

defineProps<{
  post: Post;
}>();
</script>

<template>
  <article class="post-card">
    <div class="post-card__meta">
      <time :datetime="post.date.value">{{ post.date.label }}</time>
      <span aria-hidden="true">·</span>
      <span>{{ post.category }}</span>
    </div>
    <h3><a :href="withBase(post.url)">{{ post.title }}</a></h3>
    <p>{{ post.description }}</p>
    <TagList :tags="post.tags" />
  </article>
</template>
