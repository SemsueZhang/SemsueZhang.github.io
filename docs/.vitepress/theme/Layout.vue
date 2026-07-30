<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import DefaultPage from './components/DefaultPage.vue';
import HomePage from './components/HomePage.vue';
import PostPage from './components/PostPage.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
import { recordPageView } from './utils/readingStats';

const { frontmatter } = useData();
const route = useRoute();
let trackerReady = false;

onMounted(() => {
  recordPageView();
  trackerReady = true;
});

watch(
  () => route.path,
  () => {
    if (trackerReady) recordPageView();
  }
);

const layout = computed(() => {
  const value = frontmatter.value.layout;
  return value === 'home' || value === 'post' || value === 'page' ? value : 'page';
});
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <SiteHeader />

    <main id="main-content" class="site-main">
      <HomePage v-if="layout === 'home'" />
      <PostPage v-else-if="layout === 'post'" />
      <DefaultPage v-else />
    </main>

    <SiteFooter v-if="layout !== 'post'" />
  </div>
</template>
