<script setup lang="ts">
import { withBase } from 'vitepress';
import { data as postsData } from '../../../posts.data';
</script>

<template>
  <section class="archive-page" aria-labelledby="archive-title">
    <h1 id="archive-title">归档</h1>
    <p class="archive-page__summary">按发布时间整理，共 {{ postsData.posts.length }} 篇文章。</p>

    <div v-for="year in postsData.archive" :key="year.year" class="archive-year">
      <h2>{{ year.year }}</h2>
      <section v-for="month in year.months" :key="month.month" class="archive-month" :aria-label="`${year.year} 年 ${month.label}`">
        <h3>{{ month.label }}</h3>
        <ol>
          <li v-for="post in month.posts" :key="post.url">
            <time :datetime="post.date.value">{{ post.date.value.slice(5) }}</time>
            <a :href="withBase(post.url)">{{ post.title }}</a>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>
