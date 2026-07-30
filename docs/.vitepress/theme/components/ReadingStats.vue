<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  READING_STATS_EVENT,
  readReadingStats,
  type ReadingStats
} from '../utils/readingStats';

const stats = ref<ReadingStats>({ today: 0, total: 0 });

function updateStats(event: Event) {
  stats.value = (event as CustomEvent<ReadingStats>).detail;
}

onMounted(() => {
  stats.value = readReadingStats();
  window.addEventListener(READING_STATS_EVENT, updateStats);
});

onUnmounted(() => window.removeEventListener(READING_STATS_EVENT, updateStats));
</script>

<template>
  <section class="reading-stats" aria-label="此浏览器的阅读统计">
    <dl class="reading-stats__values">
      <div>
        <dt>今日阅读量</dt>
        <dd>{{ stats.today }}</dd>
      </div>
      <div>
        <dt>累计阅读量</dt>
        <dd>{{ stats.total }}</dd>
      </div>
    </dl>
  </section>
</template>
