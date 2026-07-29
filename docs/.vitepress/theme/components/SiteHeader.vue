<script setup lang="ts">
import { computed } from 'vue';
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
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" :href="withBase('/')" aria-label="返回首页">
        <span class="site-brand__mark" aria-hidden="true">Z</span>
        <span>{{ site.title }}</span>
      </a>

      <div class="site-header__controls">
        <SiteNavigation :items="navigation" />
        <SiteSearch />
        <ThemeToggle />
        <MobileNavigation :items="navigation" />
      </div>
    </div>
  </header>
</template>
