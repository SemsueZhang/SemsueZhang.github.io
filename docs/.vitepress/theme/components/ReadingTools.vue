<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const progress = ref(0);
const showBackToTop = ref(false);
let frame = 0;

function updateReadingState() {
  frame = 0;
  const root = document.documentElement;
  const scrollable = root.scrollHeight - window.innerHeight;
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  showBackToTop.value = window.scrollY > 480;
}

function requestUpdate() {
  if (frame === 0) {
    frame = window.requestAnimationFrame(updateReadingState);
  }
}

function scrollToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

onMounted(() => {
  updateReadingState();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestUpdate);
  window.removeEventListener('resize', requestUpdate);
  if (frame !== 0) {
    window.cancelAnimationFrame(frame);
  }
});
</script>

<template>
  <div class="reading-tools">
    <div
      class="reading-progress"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progress)"
    >
      <span :style="{ transform: `scaleX(${progress / 100})` }"></span>
    </div>
    <button
      v-if="showBackToTop"
      class="back-to-top"
      type="button"
      aria-label="返回页面顶部"
      @click="scrollToTop"
    >
      <span aria-hidden="true">↑</span>
      <span>顶部</span>
    </button>
  </div>
</template>
