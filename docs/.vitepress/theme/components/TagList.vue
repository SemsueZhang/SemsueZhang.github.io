<script setup lang="ts">
import { withBase } from 'vitepress';
import { taxonomyPath } from '../../utils/taxonomy';

defineProps<{
  tags: string[];
}>();
</script>

<template>
  <ul class="tag-list" aria-label="文章标签">
    <li v-for="tag in tags" :key="tag">
      <a :href="withBase(taxonomyPath('tag', tag))">{{ tag }}</a>
    </li>
  </ul>
</template>
