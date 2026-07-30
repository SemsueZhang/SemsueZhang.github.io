<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <article class="mac-window-reader">
    <header class="mac-window-reader__bar">
      <span class="mac-window-reader__controls" aria-hidden="true">
        <i class="mac-window-reader__control mac-window-reader__control--close" />
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
