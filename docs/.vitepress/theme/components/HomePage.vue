<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { data as postsData } from '../../../posts.data';
import ActivityHeatmap from './ActivityHeatmap.vue';
import LocalClock from './LocalClock.vue';

const { site } = useData();

const profile = {
  name: 'Zhang Chenrui',
  identity: '科研与技术写作者',
  organization: 'Sun Yat-sen University',
  location: '广东 · 广州',
  email: 'zhangchr28@mail2.sysu.edu.cn',
  githubLabel: 'github.semsuezhang',
  github: 'https://github.com/SemsueZhang'
};
</script>

<template>
  <div class="home-page home-page--minimal">
    <aside class="home-profile" aria-labelledby="profile-name">
      <img
        class="home-profile__avatar"
        :src="withBase('/avatar.png')"
        :alt="`${profile.name} 的个人头像`"
        width="144"
        height="144"
      >
      <p class="home-profile__blog-name">{{ site.title }}</p>
      <h1 id="profile-name">{{ profile.name }}</h1>
      <p class="home-profile__identity">{{ profile.identity }}</p>

      <dl class="home-profile__details">
        <div>
          <dt>组织</dt>
          <dd>{{ profile.organization }}</dd>
        </div>
        <div>
          <dt>地点</dt>
          <dd>{{ profile.location }}</dd>
        </div>
        <div>
          <dt>邮箱</dt>
          <dd><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd><a :href="profile.github" rel="me external">{{ profile.githubLabel }}</a></dd>
        </div>
      </dl>

      <nav class="home-profile__links" aria-label="个人链接">
        <a :href="withBase('/about')">关于我</a>
      </nav>
    </aside>

    <section class="home-articles" aria-labelledby="articles-title">
      <header class="home-articles__header">
        <h2 id="articles-title">文章</h2>
        <p>{{ postsData.posts.length }} 篇</p>
      </header>

      <ol v-if="postsData.posts.length" class="home-articles__list">
        <li v-for="post in postsData.posts" :key="post.url">
          <time :datetime="post.date.value">{{ post.date.value }}</time>
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <span>{{ post.category }}</span>
        </li>
      </ol>
      <p v-else class="home-articles__empty">暂时还没有公开文章。</p>
    </section>

    <aside class="home-widgets" aria-label="博客概览">
      <LocalClock />
      <ActivityHeatmap />
    </aside>
  </div>
</template>
