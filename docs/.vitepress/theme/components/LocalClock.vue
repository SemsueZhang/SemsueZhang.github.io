<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const now = ref<Date>();
let timer: ReturnType<typeof setInterval> | undefined;
const ticks = Array.from({ length: 12 }, (_, index) => index);

function updateTime() {
  now.value = new Date();
}

const timeLabel = computed(() => now.value
  ? new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now.value)
  : '时间加载中');

const dateLabel = computed(() => now.value
  ? new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(now.value)
  : '');

const hourRotation = computed(() => {
  if (!now.value) return 0;
  return (now.value.getHours() % 12) * 30 + now.value.getMinutes() * 0.5;
});

const minuteRotation = computed(() => {
  if (!now.value) return 0;
  return now.value.getMinutes() * 6 + now.value.getSeconds() * 0.1;
});

const secondRotation = computed(() => (now.value?.getSeconds() ?? 0) * 6);

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
    <time class="analog-clock__readout" :datetime="now?.toISOString()" :aria-label="timeLabel">
      <span class="analog-clock" aria-hidden="true">
        <span
          v-for="tick in ticks"
          :key="tick"
          class="analog-clock__tick"
          :class="{ 'analog-clock__tick--hour': tick % 3 === 0 }"
          :style="{ transform: `rotate(${tick * 30}deg)` }"
        />
        <span class="analog-clock__hand analog-clock__hand--hour" :style="{ transform: `rotate(${hourRotation}deg)` }" />
        <span class="analog-clock__hand analog-clock__hand--minute" :style="{ transform: `rotate(${minuteRotation}deg)` }" />
        <span class="analog-clock__hand analog-clock__hand--second" :style="{ transform: `rotate(${secondRotation}deg)` }" />
        <span class="analog-clock__pin" />
      </span>
      <span class="analog-clock__date">{{ dateLabel }}</span>
    </time>
  </section>
</template>
