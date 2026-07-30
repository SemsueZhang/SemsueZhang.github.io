<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  container?: HTMLElement | null;
}>();

const progress = ref(0);
const showBackToTop = ref(false);
let frame = 0;

function updateReadingState() {
  frame = 0;
  const scrollable = props.container
    ? props.container.scrollHeight - props.container.clientHeight
    : document.documentElement.scrollHeight - window.innerHeight;
  const scrollPosition = props.container?.scrollTop ?? window.scrollY;
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (scrollPosition / scrollable) * 100)) : 0;
  showBackToTop.value = scrollPosition > 480;
}

function requestUpdate() {
  if (frame === 0) {
    frame = window.requestAnimationFrame(updateReadingState);
  }
}

function scrollToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (props.container ?? window).scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function attachScrollListener(container: HTMLElement | null | undefined) {
  (container ?? window).addEventListener('scroll', requestUpdate, { passive: true });
}

function detachScrollListener(container: HTMLElement | null | undefined) {
  (container ?? window).removeEventListener('scroll', requestUpdate);
}

onMounted(() => {
  updateReadingState();
  attachScrollListener(props.container);
  window.addEventListener('resize', requestUpdate);
});

watch(
  () => props.container,
  (container, previousContainer) => {
    detachScrollListener(previousContainer);
    attachScrollListener(container);
    requestUpdate();
  }
);

onBeforeUnmount(() => {
  detachScrollListener(props.container);
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
