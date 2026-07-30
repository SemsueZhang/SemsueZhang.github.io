<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { data as postsData } from '../../../posts.data';

const topPosts = computed(() => [...postsData.posts]
  .sort((left, right) => {
    const featuredDifference = Number(right.featured) - Number(left.featured);
    return featuredDifference || right.date.timestamp - left.date.timestamp;
  })
  .slice(0, 10));
</script>

<template>
  <section class="top-posts" aria-labelledby="top-posts-title">
    <div class="home-widget__heading">
      <h2 id="top-posts-title">Top 10</h2>
      <p title="精选文章优先，其余按发布时间排序">推荐</p>
    </div>
    <ol v-if="topPosts.length" class="top-posts__list">
      <li v-for="(post, index) in topPosts" :key="post.url">
        <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <div>
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <time :datetime="post.date.value">{{ post.date.value }}</time>
        </div>
      </li>
    </ol>
    <p v-else class="top-posts__empty">暂无公开文章。</p>
  </section>
</template>
