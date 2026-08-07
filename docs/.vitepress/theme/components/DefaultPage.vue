<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type CSSProperties } from 'vue';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { useRoute, withBase } from 'vitepress';

const route = useRoute();
const isIndexPage = computed(() => /^(\/posts\/|\/tags\/|\/categories\/|\/archive\/)/.test(route.path));
const panel = ref<HTMLElement | null>(null);
const panelOffset = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const isFullscreen = ref(false);
let dragOrigin = { x: 0, y: 0 };
let pointerOrigin = { x: 0, y: 0 };

const indexTitle = computed(() => {
  if (route.path.startsWith('/posts/')) return '文章';
  if (route.path.startsWith('/tags/')) return '标签';
  if (route.path.startsWith('/categories/')) return '分类';
  return '归档';
});

const panelStyle = computed<CSSProperties>(() => ({
  transform: `translate(${panelOffset.value.x}px, ${panelOffset.value.y}px)`
}));

function startDrag(event: PointerEvent) {
  if (!isIndexPage.value || window.innerWidth < 720) return;

  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;
  if (event.target instanceof Element && event.target.closest('a, button')) return;

  isDragging.value = true;
  dragOrigin = { ...panelOffset.value };
  pointerOrigin = { x: event.clientX, y: event.clientY };
  target.setPointerCapture(event.pointerId);
}

function moveDrag(event: PointerEvent) {
  if (!isDragging.value) return;

  const maxX = Math.min(280, window.innerWidth / 4);
  const maxY = Math.min(180, window.innerHeight / 4);
  const x = dragOrigin.x + event.clientX - pointerOrigin.x;
  const y = dragOrigin.y + event.clientY - pointerOrigin.y;
  panelOffset.value = {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y))
  };
}

function endDrag(event: PointerEvent) {
  if (!isDragging.value) return;

  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;

  isDragging.value = false;
  target.releasePointerCapture(event.pointerId);
}

function updateFullscreenState() {
  isFullscreen.value = document.fullscreenElement === panel.value;
}

async function toggleFullscreen() {
  if (!panel.value) return;

  if (document.fullscreenElement === panel.value) {
    await document.exitFullscreen();
    return;
  }

  await panel.value.requestFullscreen();
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState);
});
</script>

<template>
  <article
    ref="panel"
    class="default-page prose-content"
    :class="{ 'default-page--index': isIndexPage, 'default-page--dragging': isDragging }"
    :style="isIndexPage ? panelStyle : undefined"
  >
    <header
      v-if="isIndexPage"
      class="index-window__titlebar"
      aria-label="拖动目录窗口"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <span class="index-window__controls" aria-label="目录窗口控制">
        <a
          class="index-window__control index-window__control--close"
          :href="withBase('/')"
          aria-label="返回首页"
          title="返回首页"
        ></a>
        <span
          class="index-window__control index-window__control--minimize"
          aria-hidden="true"
          title="无操作"
        ></span>
        <button
          class="index-window__control index-window__control--maximize"
          type="button"
          :aria-label="isFullscreen ? '退出全屏' : '全屏显示目录窗口'"
          :aria-pressed="isFullscreen"
          :title="isFullscreen ? '退出全屏' : '全屏显示'"
          @click="toggleFullscreen"
        ></button>
      </span>
      <span>{{ indexTitle }}</span>
    </header>
    <Content />
  </article>
</template>
