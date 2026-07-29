<script setup lang="ts">
import { onMounted, ref } from 'vue';

type ColorTheme = 'light' | 'dark';

const currentTheme = ref<ColorTheme>('light');

function applyTheme(theme: ColorTheme, persist = true) {
  currentTheme.value = theme;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.dataset.theme = theme;

  if (persist) {
    localStorage.setItem('theme', theme);
  }
}

function toggleTheme() {
  applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
  const htmlTheme = document.documentElement.dataset.theme;
  if (htmlTheme === 'light' || htmlTheme === 'dark') {
    currentTheme.value = htmlTheme;
    return;
  }

  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', false);
});
</script>

<template>
  <button
    class="icon-button theme-toggle"
    type="button"
    :aria-label="currentTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
    :aria-pressed="currentTheme === 'dark'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ currentTheme === 'dark' ? '☀' : '◐' }}</span>
  </button>
</template>
