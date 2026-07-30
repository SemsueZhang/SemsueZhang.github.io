<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import ActivityHeatmap from './ActivityHeatmap.vue';
import LocalClock from './LocalClock.vue';
import ReadingStats from './ReadingStats.vue';
import TopPosts from './TopPosts.vue';

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

    <section class="home-overview" aria-labelledby="introduction-title">
      <div class="home-introduction">
        <p class="home-introduction__eyebrow">Profile README</p>
        <h2 id="introduction-title">你好，我是 Zhang Chenrui。</h2>
        <p>
          我在 Sun Yat-sen University 学习与研究。这里用来整理科研过程、论文阅读中的线索，
          以及可以复现和继续扩展的编程实践。
        </p>
        <nav aria-label="个人介绍相关页面">
          <a :href="withBase('/cv/')">查看 CV</a>
          <a :href="withBase('/about')">关于本站</a>
        </nav>
      </div>

      <ActivityHeatmap />
    </section>

    <aside class="home-widgets" aria-label="博客概览">
      <LocalClock />
      <TopPosts />
      <ReadingStats />
    </aside>
  </div>
</template>
