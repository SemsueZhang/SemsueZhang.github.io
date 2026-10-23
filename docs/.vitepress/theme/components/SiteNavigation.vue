<script setup lang="ts">
import { useRoute, withBase } from 'vitepress';

interface NavigationItem {
  text: string;
  link: string;
}

defineProps<{ items: NavigationItem[] }>();

const route = useRoute();

function isCurrent(link: string) {
  const path = withBase(link);
  return link === '/' ? route.path === path : route.path.startsWith(path);
}
</script>

<template>
  <nav class="site-navigation" aria-label="主导航">
    <a
      v-for="item in items"
      :key="item.link"
      :href="withBase(item.link)"
      :aria-current="isCurrent(item.link) ? 'page' : undefined"
    >
      {{ item.text }}
    </a>
  </nav>
</template>
