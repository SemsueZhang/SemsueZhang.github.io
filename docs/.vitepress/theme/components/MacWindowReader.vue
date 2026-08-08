<script setup lang="ts">
import { withBase } from 'vitepress';

defineProps<{
  label?: string;
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
        <i class="mac-window-reader__control mac-window-reader__control--minimize" />
        <i class="mac-window-reader__control mac-window-reader__control--maximize" />
      </span>
      <span v-if="label" class="mac-window-reader__label">{{ label }}</span>
    </header>
    <div class="mac-window-reader__body">
      <slot />
    </div>
  </article>
</template>
