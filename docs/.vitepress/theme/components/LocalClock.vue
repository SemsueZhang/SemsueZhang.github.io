<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const time = ref('--:--');
let timer: ReturnType<typeof setInterval> | undefined;

function updateTime() {
  time.value = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer !== undefined) clearInterval(timer);
});
</script>

<template>
  <section class="local-clock" aria-labelledby="clock-title">
    <div class="home-widget__heading">
      <h2 id="clock-title">本地时间</h2>
    </div>
    <time class="local-clock__time" aria-live="polite">{{ time }}</time>
  </section>
</template>
