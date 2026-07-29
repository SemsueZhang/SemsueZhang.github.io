<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, withBase } from 'vitepress';

interface NavigationItem {
  text: string;
  link: string;
}

defineProps<{ items: NavigationItem[] }>();

const route = useRoute();
const isOpen = ref(false);

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);
</script>

<template>
  <div class="mobile-navigation">
    <button
      class="icon-button mobile-navigation__trigger"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="mobile-navigation-panel"
      aria-label="切换导航菜单"
      @click="isOpen = !isOpen"
    >
      <span aria-hidden="true">{{ isOpen ? '×' : '☰' }}</span>
    </button>

    <nav
      v-if="isOpen"
      id="mobile-navigation-panel"
      class="mobile-navigation__panel"
      aria-label="移动端主导航"
      @keydown.escape="isOpen = false"
    >
      <a
        v-for="item in items"
        :key="item.link"
        :href="withBase(item.link)"
        @click="isOpen = false"
      >
        {{ item.text }}
      </a>
    </nav>
  </div>
</template>
