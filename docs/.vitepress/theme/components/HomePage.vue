<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { data as postsData } from '../../../posts.data';
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

const overview = {
  posts: postsData.posts.length,
  tags: Object.keys(postsData.byTag).length,
  categories: Object.keys(postsData.byCategory).length
};

const focusAreas = ['科研笔记', '论文阅读', '编程记录'];
</script>

<template>
  <div class="home-page home-page--dashboard">
    <aside class="home-profile" aria-labelledby="profile-name">
      <div class="home-profile__avatar-wrap">
        <img
          class="home-profile__avatar"
          :src="withBase('/avatar.png')"
          :alt="`${profile.name} 的个人头像`"
          width="144"
          height="144"
        >
        <span class="home-profile__status" title="持续更新中">
          <span aria-hidden="true" />
          Active
        </span>
      </div>
      <h1 id="profile-name">{{ profile.name }}</h1>
      <p class="home-profile__handle">@SemsueZhang</p>
      <p class="home-profile__identity">{{ profile.identity }}</p>

      <a class="home-profile__github" :href="profile.github" rel="me external">
        View GitHub
        <span aria-hidden="true">↗</span>
      </a>

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

      <p class="home-profile__site-name">{{ site.title }}</p>
    </aside>

    <section class="home-overview" aria-labelledby="introduction-title">
      <div class="home-introduction">
        <h2 id="introduction-title">研究笔记</h2>
        <p class="home-introduction__summary">
          论文、实验与代码的公开记录。
        </p>

        <ul class="home-introduction__focus" aria-label="主要内容方向">
          <li v-for="area in focusAreas" :key="area">{{ area }}</li>
        </ul>

        <nav class="home-introduction__actions" aria-label="个人介绍相关页面">
          <a class="home-action home-action--primary" :href="withBase('/cv/')">查看 CV</a>
          <a class="home-action" :href="withBase('/about')">关于我</a>
        </nav>

        <dl class="home-introduction__metrics" aria-label="博客内容概览">
          <div>
            <dt>公开文章</dt>
            <dd>{{ overview.posts }}</dd>
          </div>
          <div>
            <dt>主题标签</dt>
            <dd>{{ overview.tags }}</dd>
          </div>
          <div>
            <dt>内容分类</dt>
            <dd>{{ overview.categories }}</dd>
          </div>
        </dl>
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
