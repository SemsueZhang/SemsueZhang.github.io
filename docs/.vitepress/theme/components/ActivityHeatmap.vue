<script setup lang="ts">
import { computed } from 'vue';
import { data as postsData } from '../../../posts.data';

interface ActivityDay {
  key: string;
  label: string;
  count: number;
  level: number;
}

interface MonthLabel {
  key: string;
  label: string;
  column: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DISPLAY_DAYS = 84;

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getUTCMonth() + 1} 月`;
}

function activityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

const activity = computed<ActivityDay[]>(() => {
  const counts = new Map<number, number>();
  const latestTimestamp = Math.max(...postsData.posts.map((post) => post.date.timestamp));
  const endTimestamp = Number.isFinite(latestTimestamp) ? latestTimestamp : Date.UTC(2026, 0, 1);
  const startTimestamp = endTimestamp - (DISPLAY_DAYS - 1) * DAY_MS;

  for (const post of postsData.posts) {
    counts.set(post.date.timestamp, (counts.get(post.date.timestamp) ?? 0) + 1);
  }

  return Array.from({ length: DISPLAY_DAYS }, (_, index) => {
    const timestamp = startTimestamp + index * DAY_MS;
    const count = counts.get(timestamp) ?? 0;
    const date = formatDate(timestamp);

    return {
      key: date,
      label: `${date}：${count} 篇公开文章`,
      count,
      level: activityLevel(count)
    };
  });
});

const publishedCount = computed(() => postsData.posts.length);
const monthLabels = computed<MonthLabel[]>(() => {
  const labels: MonthLabel[] = [];
  let previousMonth = '';

  for (const [index, day] of activity.value.entries()) {
    const month = day.key.slice(0, 7);
    if (month === previousMonth) continue;

    labels.push({
      key: month,
      label: formatMonth(Date.parse(`${day.key}T00:00:00Z`)),
      column: Math.floor(index / 7) + 1
    });
    previousMonth = month;
  }

  return labels;
});
</script>

<template>
  <section class="activity-heatmap" aria-labelledby="activity-title">
    <div class="home-widget__heading">
      <h2 id="activity-title">写作活动</h2>
      <p>{{ publishedCount }} 篇</p>
    </div>
    <p class="activity-heatmap__description">按公开文章发布日期统计</p>
    <div class="activity-heatmap__months" aria-hidden="true">
      <span
        v-for="month in monthLabels"
        :key="month.key"
        :style="{ gridColumnStart: month.column }"
      >
        {{ month.label }}
      </span>
    </div>
    <div class="activity-heatmap__grid" role="img" aria-label="最近十二周的文章发布活动热力图">
      <span
        v-for="day in activity"
        :key="day.key"
        class="activity-heatmap__day"
        :class="`activity-heatmap__day--level-${day.level}`"
        :title="day.label"
        :aria-label="day.label"
      />
    </div>
  </section>
</template>
