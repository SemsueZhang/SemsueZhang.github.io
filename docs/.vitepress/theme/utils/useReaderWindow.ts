import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vitepress';

export function useReaderWindow(scrollElement: Ref<HTMLElement | null>) {
  const route = useRoute();
  const isExpanded = ref(true);
  const readerElement = ref<HTMLElement | null>(null);
  const isFullscreen = ref(false);
  const fullscreenError = ref('');
  let expandedBeforeFullscreen = true;

  watch(() => route.path, () => {
    isExpanded.value = true;
    fullscreenError.value = '';
    if (isFullscreen.value) expandedBeforeFullscreen = true;
  });

  async function toggleWindowSize() {
    const scrollPosition = scrollElement.value?.scrollTop ?? 0;
    if (isFullscreen.value) {
      expandedBeforeFullscreen = false;
      try {
        await document.exitFullscreen();
      } catch {
        fullscreenError.value = '暂时无法退出全屏，请按 Esc 后重试。';
        return;
      }
    } else {
      isExpanded.value = !isExpanded.value;
    }
    await nextTick();
    if (scrollElement.value) scrollElement.value.scrollTop = scrollPosition;
  }

  function updateFullscreenState() {
    const active = Boolean(readerElement.value && document.fullscreenElement === readerElement.value);
    if (isFullscreen.value && !active) isExpanded.value = expandedBeforeFullscreen;
    isFullscreen.value = active;
  }

  async function toggleFullscreen() {
    fullscreenError.value = '';
    if (isFullscreen.value) {
      try {
        await document.exitFullscreen();
      } catch {
        fullscreenError.value = '暂时无法退出全屏，请按 Esc 后重试。';
      }
      return;
    }

    if (!document.fullscreenEnabled || !readerElement.value?.requestFullscreen) {
      await toggleWindowSize();
      return;
    }
    expandedBeforeFullscreen = isExpanded.value;
    isExpanded.value = true;
    try {
      await readerElement.value.requestFullscreen();
    } catch {
      isExpanded.value = expandedBeforeFullscreen;
      fullscreenError.value = '暂时无法进入全屏，请重试或使用绿色按钮展开窗口。';
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState);
    if (readerElement.value && document.fullscreenElement === readerElement.value) {
      void document.exitFullscreen().catch(() => {});
    }
  });

  return { readerElement, isExpanded, isFullscreen, fullscreenError, toggleWindowSize, toggleFullscreen };
}
