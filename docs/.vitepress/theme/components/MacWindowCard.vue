<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <article class="mac-window-card">
    <header class="mac-window-card__bar">
      <span class="mac-window-card__controls" aria-hidden="true">
        <i class="mac-window-card__control mac-window-card__control--close" />
        <i class="mac-window-card__control mac-window-card__control--minimize" />
        <i class="mac-window-card__control mac-window-card__control--maximize" />
      </span>
      <span v-if="label" class="mac-window-card__label">{{ label }}</span>
    </header>
    <div class="mac-window-card__body">
      <slot />
    </div>
  </article>
</template>
