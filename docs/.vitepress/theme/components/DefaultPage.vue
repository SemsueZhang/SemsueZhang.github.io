<script setup lang="ts">
import { computed } from 'vue';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { useRoute } from 'vitepress';

const route = useRoute();
const isIndexPage = computed(() => /^(\/posts\/|\/tags\/|\/categories\/|\/archive\/)/.test(route.path));
</script>

<template>
  <article class="default-page prose-content" :class="{ 'default-page--index': isIndexPage }">
    <Content />
  </article>
</template>
