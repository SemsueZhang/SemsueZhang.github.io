<script setup lang="ts">
import { withBase } from 'vitepress';
import ActivityHeatmap from './ActivityHeatmap.vue';
import LocalClock from './LocalClock.vue';
import ReadingStats from './ReadingStats.vue';
import TopPosts from './TopPosts.vue';

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
  <div class="home-page home-page--dashboard">
    <aside class="home-profile" aria-labelledby="profile-name">
      <img
        class="home-profile__avatar"
        :src="withBase('/avatar.png')"
        :alt="`${profile.name} 的个人头像`"
        width="144"
        height="144"
      >
      <h1 id="profile-name">{{ profile.name }}</h1>
      <p class="home-profile__handle">@SemsueZhang</p>
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
    </aside>

    <section class="home-overview" aria-label="个人介绍">
      <div class="home-introduction">
        <p>
          我是 Zhang Chenrui。这里记录科研、论文阅读和编程实践中的问题、思考与阶段性结果。
        </p>
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
