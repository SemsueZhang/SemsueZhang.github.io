<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Post } from '../../../posts.data';
import MacWindowCard from './MacWindowCard.vue';
import TagList from './TagList.vue';

defineProps<{
  post: Post;
}>();
</script>

<template>
  <MacWindowCard class="post-card" :label="post.category">
    <div class="post-card__meta">
      <time :datetime="post.date.value">{{ post.date.label }}</time>
    </div>
    <h3><a :href="withBase(post.url)">{{ post.title }}</a></h3>
    <p>{{ post.description }}</p>
    <TagList :tags="post.tags" />
  </MacWindowCard>
</template>
