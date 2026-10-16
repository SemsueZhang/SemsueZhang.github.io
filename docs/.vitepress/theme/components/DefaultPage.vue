<script setup lang="ts">
import { computed, ref } from 'vue';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { useRoute, withBase } from 'vitepress';
import MacWindowReader from './MacWindowReader.vue';
import { useReaderWindow } from '../utils/useReaderWindow';

const route = useRoute();
const pagePath = computed(() => `/${route.path.slice(withBase('/').length)}`);
const isIndexPage = computed(() => /^\/(posts|tags|categories|archive)\//.test(pagePath.value));
const scrollElement = ref<HTMLElement | null>(null);
const { readerElement, isExpanded, isFullscreen, fullscreenError, toggleWindowSize, toggleFullscreen } = useReaderWindow(scrollElement);

const indexTitle = computed(() => {
  if (pagePath.value.startsWith('/posts/')) return '文章';
  if (pagePath.value.startsWith('/tags/')) return '标签';
  if (pagePath.value.startsWith('/categories/')) return '分类';
  return '归档';
});
</script>

<template>
  <div
    v-if="isIndexPage"
    ref="readerElement"
    class="post-layout directory-layout"
    :class="{ 'post-layout--windowed': !isExpanded }"
  >
    <MacWindowReader
      :key="route.path"
      class="post-page directory-window"
      :label="indexTitle"
      window-label="目录"
      close-href="/"
      close-label="返回首页"
      :expanded="isExpanded"
      :fullscreen="isFullscreen"
      :fullscreen-error="fullscreenError"
      @toggle-window-size="toggleWindowSize"
      @toggle-fullscreen="toggleFullscreen"
    >
      <div ref="scrollElement" class="directory-content prose-content" tabindex="0" :aria-label="`${indexTitle}目录`">
        <Content />
      </div>
    </MacWindowReader>
  </div>
  <article v-else class="default-page prose-content">
    <Content />
  </article>
</template>
