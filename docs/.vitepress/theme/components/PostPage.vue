<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { data as postsData } from '../../../posts.data';
import { taxonomyPath } from '../../utils/taxonomy';
import PostMeta from './PostMeta.vue';
import TableOfContents from './TableOfContents.vue';
import TagList from './TagList.vue';
import CodeCopyControls from './CodeCopyControls.vue';
import MacWindowReader from './MacWindowReader.vue';
import ReadingTools from './ReadingTools.vue';
import { useReaderWindow } from '../utils/useReaderWindow';

interface TocItem {
  level: number;
  title: string;
  slug: string;
}

const { frontmatter, page } = useData();
const route = useRoute();
const contentElement = ref<HTMLElement | null>(null);
const scrollElement = ref<HTMLElement | null>(null);
const { readerElement, isExpanded, isFullscreen, fullscreenError, toggleWindowSize, toggleFullscreen } = useReaderWindow(scrollElement);

function normalizeDate(value: unknown): string {
  if (typeof value === 'string') {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
    return match ? match[1] : value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return '';
}

const post = computed(() => {
  const data = frontmatter.value as Record<string, unknown>;
  return {
    title: typeof data.title === 'string' ? data.title : '未命名文章',
    date: normalizeDate(data.date),
    updated: normalizeDate(data.updated),
    category: typeof data.category === 'string' ? data.category : '',
    tags: Array.isArray(data.tags) ? data.tags.filter((item): item is string => typeof item === 'string') : []
  };
});

const headers = computed(() => (page.value.headers ?? []) as TocItem[]);
const hasTableOfContents = computed(
  () => headers.value.filter((header) => header.level === 2 || header.level === 3).length >= 2
);
const currentIndex = computed(() => {
  const currentPath = route.path.replace(/\/$/, '');
  return postsData.posts.findIndex((item) => item.url.replace(/\/$/, '') === currentPath);
});
const previousPost = computed(() => currentIndex.value > 0 ? postsData.posts[currentIndex.value - 1] : null);
const nextPost = computed(() => {
  const index = currentIndex.value;
  return index >= 0 && index < postsData.posts.length - 1 ? postsData.posts[index + 1] : null;
});
</script>

<template>
  <div ref="readerElement" class="post-layout" :class="{ 'post-layout--windowed': !isExpanded }">
    <MacWindowReader
      class="post-page"
      :label="post.title"
      :expanded="isExpanded"
      :fullscreen="isFullscreen"
      :fullscreen-error="fullscreenError"
      @toggle-window-size="toggleWindowSize"
      @toggle-fullscreen="toggleFullscreen"
    >
      <div class="post-reader__split">
        <div ref="scrollElement" class="post-reader__main" tabindex="0" aria-label="文章正文">
          <div class="post-reader__content">
            <header class="post-header">
              <h1>{{ post.title }}</h1>
              <div class="post-header__details">
                <PostMeta :date="post.date" :updated="post.updated" compact />
                <div v-if="post.category || post.tags.length" class="post-header__taxonomy">
                  <a
                    v-if="post.category"
                    class="post-header__category"
                    :href="withBase(taxonomyPath('category', post.category))"
                    :aria-label="`分类：${post.category}`"
                  >
                    {{ post.category }}
                  </a>
                  <TagList v-if="post.tags.length" :tags="post.tags" />
                </div>
              </div>
            </header>

            <div ref="contentElement" class="post-content">
              <Content />
            </div>
            <CodeCopyControls :container="contentElement" />

            <footer v-if="previousPost || nextPost" class="post-footer">
              <nav class="post-pagination" aria-label="相邻文章">
                <a v-if="previousPost" :href="withBase(previousPost.url)">
                  <span>上一篇</span>
                  <strong>{{ previousPost.title }}</strong>
                </a>
                <a v-if="nextPost" :href="withBase(nextPost.url)">
                  <span>下一篇</span>
                  <strong>{{ nextPost.title }}</strong>
                </a>
              </nav>
            </footer>
          </div>
        </div>

        <aside v-if="hasTableOfContents" class="post-reader__aside">
          <TableOfContents :headers="headers" :scroll-container="scrollElement" />
        </aside>
      </div>
    </MacWindowReader>
    <ReadingTools :container="scrollElement" />
  </div>
</template>
