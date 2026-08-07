<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import MobileNavigation from './MobileNavigation.vue';
import SiteSearch from './SiteSearch.vue';
import SiteNavigation from './SiteNavigation.vue';
import ThemeToggle from './ThemeToggle.vue';

interface NavigationItem {
  text: string;
  link: string;
}

const { site, theme } = useData();
const navigation = computed(
  () => (theme.value.nav ?? []) as NavigationItem[]
);
const menuBarTime = ref('');
let clockTimer: ReturnType<typeof setInterval> | undefined;

function updateMenuBarTime() {
  menuBarTime.value = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}

onMounted(() => {
  updateMenuBarTime();
  clockTimer = setInterval(updateMenuBarTime, 30_000);
});

onUnmounted(() => {
  if (clockTimer !== undefined) clearInterval(clockTimer);
});
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__left">
        <span class="site-header__window-controls" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <a class="site-brand" :href="withBase('/')" aria-label="返回首页">
          <span>{{ site.title }}</span>
        </a>
        <SiteNavigation :items="navigation" />
      </div>

      <div class="site-header__controls">
        <SiteSearch />
        <ThemeToggle />
        <time class="site-header__clock" aria-label="当前日期和时间">{{ menuBarTime }}</time>
        <MobileNavigation :items="navigation" />
      </div>
    </div>
  </header>
</template>
