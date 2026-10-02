<script setup lang="ts">
import { withBase } from 'vitepress';

defineProps<{
  label?: string;
  expanded: boolean;
}>();

defineEmits<{
  'toggle-window-size': [];
}>();
</script>

<template>
  <article class="mac-window-reader">
    <header class="mac-window-reader__bar">
      <span class="mac-window-reader__controls" aria-label="文章窗口控制">
        <a
          class="mac-window-reader__control mac-window-reader__control--close"
          :href="withBase('/posts/')"
          aria-label="返回文章列表"
          title="返回文章列表"
        ></a>
        <span class="mac-window-reader__control mac-window-reader__control--minimize" aria-hidden="true"></span>
        <button
          class="mac-window-reader__control mac-window-reader__control--maximize"
          type="button"
          :aria-label="expanded ? '缩小文章窗口' : '展开文章窗口'"
          :aria-pressed="expanded"
          :title="expanded ? '缩小文章窗口' : '展开文章窗口'"
          @click="$emit('toggle-window-size')"
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path v-if="expanded" d="M1 4h3V1M11 8H8v3M4 4 1 1M8 8l3 3" />
            <path v-else d="M1 4V1h3M11 8v3H8M1 1l3 3M11 11 8 8" />
          </svg>
        </button>
      </span>
      <span v-if="label" class="mac-window-reader__label">{{ label }}</span>
    </header>
    <div class="mac-window-reader__body">
      <slot />
    </div>
  </article>
</template>
