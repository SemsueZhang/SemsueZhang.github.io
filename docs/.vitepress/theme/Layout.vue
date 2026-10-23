<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import DefaultPage from './components/DefaultPage.vue';
import HomePage from './components/HomePage.vue';
import PostPage from './components/PostPage.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
import TodoPage from './components/TodoPage.vue';
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
  return value === 'home' || value === 'post' || value === 'page' || value === 'todo' || value === 'todo-index' ? value : 'page';
});
const isWindowPage = computed(() => layout.value === 'post' || layout.value === 'todo' || layout.value === 'todo-index');
</script>

<template>
  <div class="site-shell" :style="{ '--site-wallpaper': `url('${withBase('/images/landscape-lake.png')}')` }">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <SiteHeader />

    <main id="main-content" class="site-main" :class="{ 'site-main--post': isWindowPage }">
      <HomePage v-if="layout === 'home'">
        <Content />
      </HomePage>
      <PostPage v-else-if="layout === 'post'" />
      <TodoPage v-else-if="layout === 'todo' || layout === 'todo-index'" />
      <DefaultPage v-else />
    </main>

    <SiteFooter v-if="!isWindowPage" />
  </div>
</template>
