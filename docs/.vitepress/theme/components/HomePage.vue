<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { data as postsData } from '../../../posts.data';
import PostCard from './PostCard.vue';

const { site } = useData();
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <p class="eyebrow">个人知识库 · 持续整理</p>
      <h1 id="home-title">{{ site.title }}</h1>
      <p class="home-hero__summary">
        记录科研过程中的思考、论文阅读中的线索，以及可复现的编程实践。
      </p>
      <div class="home-hero__actions">
        <a class="button button--primary" :href="withBase('/posts/')">浏览文章</a>
        <a class="button button--secondary" :href="withBase('/about')">了解更多</a>
      </div>
    </section>

    <section class="home-section" aria-labelledby="focus-title">
      <div class="section-heading">
        <p class="eyebrow">写作方向</p>
        <h2 id="focus-title">围绕问题，而非追逐噪声</h2>
      </div>
      <div class="focus-grid">
        <article>
          <h3>科研笔记</h3>
          <p>保存研究中的问题、推导、实验设想与阶段性结论。</p>
        </article>
        <article>
          <h3>论文阅读</h3>
          <p>提炼方法脉络、关键假设和可进一步验证的观点。</p>
        </article>
        <article>
          <h3>编程记录</h3>
          <p>整理实现经验、工具链选择和具有复用价值的解决方案。</p>
        </article>
      </div>
    </section>

    <section v-if="postsData.featured.length" class="home-section home-section--featured" aria-labelledby="featured-title">
      <div class="section-heading">
        <p class="eyebrow">精选文章</p>
        <h2 id="featured-title">值得反复回看的内容</h2>
      </div>
      <div class="post-list post-list--featured">
        <PostCard v-for="post in postsData.featured" :key="post.url" :post="post" />
      </div>
    </section>

    <section class="home-section home-section--latest" aria-labelledby="latest-title">
      <div class="section-heading section-heading--row">
        <div>
          <p class="eyebrow">最近更新</p>
          <h2 id="latest-title">从这里开始</h2>
        </div>
        <a :href="withBase('/posts/')">全部文章 <span aria-hidden="true">→</span></a>
      </div>
      <PostCard v-for="post in postsData.latest" :key="post.url" :post="post" />
    </section>

    <div class="home-page__content">
      <Content />
    </div>
  </div>
</template>
