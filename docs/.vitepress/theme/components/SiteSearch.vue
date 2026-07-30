<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import { data as searchData } from '../../../search.data';

const isOpen = ref(false);
const query = ref('');
const searchInput = ref<HTMLInputElement>();

const results = computed(() => {
  const terms = query.value
    .trim()
    .toLocaleLowerCase('zh-CN')
    .split(/\s+/)
    .filter(Boolean);
  if (terms.length === 0) return [];

  return searchData.records
    .filter((record) => terms.every((term) => record.keywords.includes(term)))
    .slice(0, 10);
});

function openSearch() {
  isOpen.value = true;
}

function closeSearch() {
  isOpen.value = false;
}

function handleShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  }

  if (event.key === 'Escape' && isOpen.value) closeSearch();
}

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    searchInput.value?.focus();
  }
});

onMounted(() => window.addEventListener('keydown', handleShortcut));
onUnmounted(() => window.removeEventListener('keydown', handleShortcut));
</script>

<template>
  <div class="site-search">
    <button class="site-search__trigger" type="button" aria-label="搜索站内内容" @click="openSearch">
      <svg class="site-search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m15.6 15.6 4.2 4.2" />
      </svg>
      <span class="site-search__text">搜索</span>
      <kbd aria-hidden="true">Ctrl K</kbd>
    </button>

    <div v-if="isOpen" class="site-search__overlay" @click.self="closeSearch">
      <section class="site-search__dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
        <div class="site-search__header">
          <h2 id="search-dialog-title">搜索</h2>
          <button class="icon-button" type="button" aria-label="关闭搜索" @click="closeSearch">×</button>
        </div>
        <label class="site-search__input-label">
          <span class="sr-only">输入关键词</span>
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            placeholder="搜索文章、标签、分类和页面内容"
            autocomplete="off"
          >
        </label>

        <p v-if="!query.trim()" class="site-search__hint">输入关键词开始搜索，或按 Esc 关闭。</p>
        <p v-else-if="results.length === 0" class="site-search__hint">没有找到匹配内容。</p>
        <ol v-else class="site-search__results">
          <li v-for="result in results" :key="result.url">
            <a :href="withBase(result.url)" @click="closeSearch">
              <strong>{{ result.title }}</strong>
              <span v-if="result.description">{{ result.description }}</span>
            </a>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>
