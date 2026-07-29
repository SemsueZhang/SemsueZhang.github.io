<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Post } from '../../../posts.data';
import PostList from './PostList.vue';

const props = defineProps<{
  posts: Post[];
}>();

const selectedTag = ref<string | null>(null);

const tags = computed(() =>
  [...new Set(props.posts.flatMap((post) => post.tags))].sort((left, right) =>
    left.localeCompare(right, 'zh-CN')
  )
);

const filteredPosts = computed(() => {
  if (selectedTag.value === null) {
    return props.posts;
  }

  return props.posts.filter((post) => post.tags.includes(selectedTag.value as string));
});

function selectTag(tag: string | null) {
  selectedTag.value = tag;
}
</script>

<template>
  <section class="post-directory" aria-labelledby="post-directory-title">
    <div class="post-directory__summary">
      <h2 id="post-directory-title">文章列表</h2>
      <p>共 {{ filteredPosts.length }} 篇{{ selectedTag ? `「${selectedTag}」相关` : '' }}文章</p>
    </div>

    <div class="tag-filter" aria-label="按标签筛选文章">
      <button
        type="button"
        :aria-pressed="selectedTag === null"
        @click="selectTag(null)"
      >
        全部
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        :aria-pressed="selectedTag === tag"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <PostList :posts="filteredPosts" />
  </section>
</template>
