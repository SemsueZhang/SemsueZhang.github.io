<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vitepress';

const props = defineProps<{
  container: HTMLElement | null;
}>();

const route = useRoute();
const removers: Array<() => void> = [];
const timers = new Set<number>();
const statusMessage = ref('');

function clearControls() {
  removers.splice(0).forEach((remove) => remove());
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

function attachControls() {
  clearControls();
  const container = props.container;
  if (!container) {
    return;
  }

  container.querySelectorAll<HTMLButtonElement>('div[class*="language-"] > button.copy').forEach((button) => {
    const code = button.parentElement?.querySelector('code');
    if (!code) {
      return;
    }

    button.type = 'button';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');
    button.dataset.copyState = 'idle';

    const handleClick = async () => {
      const originalLabel = button.textContent;
      try {
        const copied = await copyText(code.textContent ?? '');
        button.textContent = copied ? '已复制' : '复制失败';
        button.dataset.copyState = copied ? 'copied' : 'error';
        statusMessage.value = copied ? '代码已复制到剪贴板。' : '代码复制失败。';
      } catch {
        button.textContent = '复制失败';
        button.dataset.copyState = 'error';
        statusMessage.value = '代码复制失败。';
      }

      const timer = window.setTimeout(() => {
        button.textContent = originalLabel;
        button.dataset.copyState = 'idle';
        timers.delete(timer);
      }, 1600);
      timers.add(timer);
    };

    button.addEventListener('click', handleClick);
    removers.push(() => button.removeEventListener('click', handleClick));
  });
}

watch(
  [() => props.container, () => route.path],
  () => {
    nextTick(attachControls);
  },
  { immediate: true }
);

onBeforeUnmount(clearControls);
</script>

<template>
  <span class="sr-only" aria-live="polite">{{ statusMessage }}</span>
</template>
