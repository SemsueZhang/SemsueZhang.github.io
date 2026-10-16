<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import { withBase } from 'vitepress';
import { keepWindowReachable, resizeWindowRect, type ResizeEdge, type WindowRect } from '../utils/windowGeometry';

const props = withDefaults(defineProps<{
  label?: string;
  windowLabel?: string;
  closeHref?: string;
  closeLabel?: string;
  expanded: boolean;
  fullscreen?: boolean;
  fullscreenError?: string;
}>(), {
  windowLabel: '文章',
  closeHref: '/posts/',
  closeLabel: '返回文章列表'
});

const emit = defineEmits<{
  'toggle-window-size': [];
  'toggle-fullscreen': [];
}>();

const panel = ref<HTMLElement | null>(null);
const panelOffset = ref({ x: 0, y: 0 });
const panelSize = ref<{ width: number; height: number } | null>(null);
const isDragging = ref(false);
const isResizing = ref(false);
const resizeEdges: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
let dragOrigin = { x: 0, y: 0 };
let pointerOrigin = { x: 0, y: 0 };
let dragTarget: HTMLElement | null = null;
let pointerId: number | null = null;
let resizeEdge: ResizeEdge | null = null;
let resizeOrigin: WindowRect = { x: 0, y: 0, width: 0, height: 0 };
let boundsObserver: ResizeObserver | undefined;

const panelStyle = computed<CSSProperties | undefined>(() => props.expanded ? undefined : {
  width: panelSize.value ? `${panelSize.value.width}px` : undefined,
  height: panelSize.value ? `${panelSize.value.height}px` : undefined,
  transform: `translate(${panelOffset.value.x}px, ${panelOffset.value.y}px)`
});

function getGeometry() {
  if (!panel.value?.parentElement) return null;

  const bounds = panel.value.parentElement.getBoundingClientRect();
  const windowRect = panel.value.getBoundingClientRect();
  return {
    bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
    rect: { x: windowRect.x, y: windowRect.y, width: windowRect.width, height: windowRect.height },
    titlebarHeight: panel.value.querySelector('header')?.getBoundingClientRect().height ?? 38
  };
}

function applyWindowRect(rect: WindowRect, bounds: WindowRect) {
  panelSize.value = { width: rect.width, height: rect.height };
  panelOffset.value = {
    x: rect.x - bounds.x - (bounds.width - rect.width) / 2,
    y: rect.y - bounds.y - (bounds.height - rect.height) / 2
  };
}

function moveWindow(offset: { x: number; y: number }) {
  if (props.expanded) return;

  const geometry = getGeometry();
  if (!geometry) return;
  const originX = geometry.rect.x - panelOffset.value.x;
  const originY = geometry.rect.y - panelOffset.value.y;
  const rect = keepWindowReachable({
    ...geometry.rect,
    x: originX + offset.x,
    y: originY + offset.y
  }, geometry.bounds, geometry.titlebarHeight);

  panelOffset.value = { x: rect.x - originX, y: rect.y - originY };
}

function startDrag(event: PointerEvent) {
  if (props.expanded || !event.isPrimary || event.button !== 0) return;
  if (event.target instanceof Element && event.target.closest('a, button')) return;
  if (!(event.currentTarget instanceof HTMLElement)) return;

  dragTarget = event.currentTarget;
  pointerId = event.pointerId;
  resizeEdge = null;
  dragOrigin = { ...panelOffset.value };
  pointerOrigin = { x: event.clientX, y: event.clientY };
  isDragging.value = true;
  dragTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function moveDrag(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;

  if (isResizing.value && resizeEdge) {
    const geometry = getGeometry();
    if (!geometry) return;
    applyWindowRect(resizeWindowRect(resizeOrigin, resizeEdge, {
      x: event.clientX - pointerOrigin.x,
      y: event.clientY - pointerOrigin.y
    }, geometry.bounds, geometry.titlebarHeight), geometry.bounds);
    return;
  }

  if (!isDragging.value) return;

  moveWindow({
    x: dragOrigin.x + event.clientX - pointerOrigin.x,
    y: dragOrigin.y + event.clientY - pointerOrigin.y
  });
}

function startResize(event: PointerEvent, edge: ResizeEdge) {
  if (props.expanded || !event.isPrimary || event.button !== 0) return;
  if (!(event.currentTarget instanceof HTMLElement)) return;
  const geometry = getGeometry();
  if (!geometry) return;

  dragTarget = event.currentTarget;
  pointerId = event.pointerId;
  resizeEdge = edge;
  resizeOrigin = geometry.rect;
  pointerOrigin = { x: event.clientX, y: event.clientY };
  isResizing.value = true;
  dragTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function endDrag() {
  const target = dragTarget;
  const capturedPointer = pointerId;
  isDragging.value = false;
  isResizing.value = false;
  resizeEdge = null;
  dragTarget = null;
  pointerId = null;
  if (target && capturedPointer !== null && target.hasPointerCapture(capturedPointer)) {
    target.releasePointerCapture(capturedPointer);
  }
}

function resizeWithKeyboard(event: KeyboardEvent) {
  if (props.expanded) return;
  if (event.key === 'Home' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    panelSize.value = null;
    panelOffset.value = { x: 0, y: 0 };
    return;
  }

  const step = event.shiftKey ? 48 : 16;
  const directions: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -step, y: 0 },
    ArrowRight: { x: step, y: 0 },
    ArrowUp: { x: 0, y: -step },
    ArrowDown: { x: 0, y: step }
  };
  const direction = directions[event.key];
  const geometry = getGeometry();
  if (!direction || !geometry) return;
  event.preventDefault();
  applyWindowRect(resizeWindowRect(geometry.rect, 'se', direction, geometry.bounds, geometry.titlebarHeight), geometry.bounds);
}

function moveWithKeyboard(event: KeyboardEvent) {
  if (event.target !== event.currentTarget) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    emit('toggle-fullscreen');
    return;
  }
  if (props.expanded) return;

  const step = event.shiftKey ? 48 : 16;
  const directions: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -step, y: 0 },
    ArrowRight: { x: step, y: 0 },
    ArrowUp: { x: 0, y: -step },
    ArrowDown: { x: 0, y: step }
  };

  if (event.key === 'Home') {
    event.preventDefault();
    panelOffset.value = { x: 0, y: 0 };
  } else if (directions[event.key]) {
    event.preventDefault();
    const direction = directions[event.key];
    moveWindow({ x: panelOffset.value.x + direction.x, y: panelOffset.value.y + direction.y });
  }
}

function toggleFullscreenFromTitlebar(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('a, button')) return;
  emit('toggle-fullscreen');
}

function keepWindowInBounds() {
  if (props.expanded) return;
  const geometry = getGeometry();
  if (panelSize.value && geometry) {
    const rect = keepWindowReachable({
      ...geometry.rect,
      width: Math.min(panelSize.value.width, geometry.bounds.width),
      height: Math.min(panelSize.value.height, geometry.bounds.height)
    }, geometry.bounds, geometry.titlebarHeight);
    applyWindowRect(rect, geometry.bounds);
    return;
  }

  moveWindow(panelOffset.value);
}

watch(() => props.expanded, async () => {
  endDrag();
  await nextTick();
  keepWindowInBounds();
});

watch(() => props.label, () => {
  endDrag();
  panelOffset.value = { x: 0, y: 0 };
  panelSize.value = null;
});

onMounted(() => {
  window.addEventListener('resize', keepWindowInBounds);
  boundsObserver = new ResizeObserver(keepWindowInBounds);
  if (panel.value?.parentElement) boundsObserver.observe(panel.value.parentElement);
});
onBeforeUnmount(() => {
  endDrag();
  boundsObserver?.disconnect();
  window.removeEventListener('resize', keepWindowInBounds);
});
</script>

<template>
  <article
    ref="panel"
    class="mac-window-reader"
    :class="{
      'mac-window-reader--movable': !expanded,
      'mac-window-reader--dragging': isDragging,
      'mac-window-reader--resizing': isResizing
    }"
    :style="panelStyle"
  >
    <header
      class="mac-window-reader__bar"
      tabindex="0"
      :aria-label="expanded ? `${windowLabel}窗口标题栏；双击或按 Enter 全屏` : `拖动${windowLabel}窗口；方向键移动，Home 键居中，双击或按 Enter 全屏`"
      :aria-keyshortcuts="expanded ? 'Enter' : 'ArrowLeft ArrowRight ArrowUp ArrowDown Home Enter'"
      :title="fullscreen ? '双击退出全屏' : '双击进入全屏'"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @keydown="moveWithKeyboard"
      @dblclick="toggleFullscreenFromTitlebar"
    >
      <span class="mac-window-reader__controls" :aria-label="`${windowLabel}窗口控制`">
        <a
          class="mac-window-reader__control mac-window-reader__control--close"
          :href="withBase(closeHref)"
          :aria-label="closeLabel"
          :title="closeLabel"
        ></a>
        <span class="mac-window-reader__control mac-window-reader__control--minimize" aria-hidden="true"></span>
        <button
          class="mac-window-reader__control mac-window-reader__control--maximize"
          type="button"
          :aria-label="fullscreen ? `退出全屏并恢复${windowLabel}窗口` : expanded ? `缩小${windowLabel}窗口` : `展开${windowLabel}窗口`"
          :aria-pressed="expanded"
          :title="fullscreen ? `退出全屏并恢复${windowLabel}窗口` : expanded ? `缩小${windowLabel}窗口` : `展开${windowLabel}窗口`"
          @click="$emit('toggle-window-size')"
        ></button>
      </span>
      <span v-if="label" class="mac-window-reader__label">{{ label }}</span>
    </header>
    <div class="mac-window-reader__body">
      <slot />
    </div>
    <p v-if="fullscreenError" class="mac-window-reader__notice" role="status">{{ fullscreenError }}</p>
    <template v-if="!expanded">
      <div
        v-for="edge in resizeEdges"
        :key="edge"
        class="mac-window-reader__resize"
        :class="`mac-window-reader__resize--${edge}`"
        :data-resize="edge"
        :role="edge === 'se' ? 'button' : undefined"
        :tabindex="edge === 'se' ? 0 : undefined"
        :aria-hidden="edge !== 'se' ? true : undefined"
        :aria-label="edge === 'se' ? `调整${windowLabel}窗口大小；方向键调整宽高，Home 键恢复默认` : undefined"
        :aria-keyshortcuts="edge === 'se' ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Home Enter' : undefined"
        @pointerdown.stop="startResize($event, edge)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @lostpointercapture="endDrag"
        @keydown="resizeWithKeyboard"
      ></div>
    </template>
  </article>
</template>
