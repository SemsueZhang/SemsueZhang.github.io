<script setup lang="ts">
import { computed, ref } from 'vue';
import { data as postsData } from '../../../posts.data';

interface ActivityDay {
  key: string;
  label: string;
  level: number;
  active: boolean;
}

interface MonthOption {
  key: string;
  label: string;
  edgeLabel: string;
  timestamp: number;
}

const DISPLAY_CELLS = 42;

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(timestamp: number): { label: string; edgeLabel: string } {
  const date = new Date(timestamp);
  const month = date.getUTCMonth() + 1;
  return {
    label: `${date.getUTCFullYear()} 年 ${month} 月`,
    edgeLabel: `${date.getUTCFullYear()}.${String(month).padStart(2, '0')}`
  };
}

function activityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

const latestTimestamp = Math.max(...postsData.posts.map((post) => post.date.timestamp));
const earliestTimestamp = Math.min(...postsData.posts.map((post) => post.date.timestamp));
const calendarEndTimestamp = Number.isFinite(latestTimestamp) ? latestTimestamp : Date.UTC(2026, 0, 1);
const calendarStartTimestamp = Number.isFinite(earliestTimestamp) ? earliestTimestamp : calendarEndTimestamp;

const months = computed<MonthOption[]>(() => {
  const startDate = new Date(calendarStartTimestamp);
  const endDate = new Date(calendarEndTimestamp);
  const startYear = startDate.getUTCFullYear();
  const endYear = endDate.getUTCFullYear();
  const monthCount = (endYear - startYear) * 12 + endDate.getUTCMonth() + 1;

  return Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(Date.UTC(startYear, index, 1));
    const timestamp = date.getTime();
    const formatted = formatMonth(timestamp);

    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`,
      label: formatted.label,
      edgeLabel: formatted.edgeLabel,
      timestamp
    };
  });
});

const selectedMonthIndex = ref(Math.max(months.value.length - 1, 0));
const selectedMonth = computed(() => months.value[selectedMonthIndex.value] ?? months.value[months.value.length - 1]);

const activity = computed<ActivityDay[]>(() => {
  const counts = new Map<number, number>();
  const selectedDate = new Date(selectedMonth.value.timestamp);
  const year = selectedDate.getUTCFullYear();
  const month = selectedDate.getUTCMonth();
  const firstDayOffset = (selectedDate.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  for (const post of postsData.posts) {
    counts.set(post.date.timestamp, (counts.get(post.date.timestamp) ?? 0) + 1);
  }

  return Array.from({ length: DISPLAY_CELLS }, (_, index) => {
    const day = index - firstDayOffset + 1;
    if (day < 1 || day > daysInMonth) {
      return {
        key: `empty-${selectedMonth.value.key}-${index}`,
        label: '',
        level: 0,
        active: false
      };
    }

    const timestamp = Date.UTC(year, month, day);
    const count = counts.get(timestamp) ?? 0;
    const date = formatDate(timestamp);

    return {
      key: date,
      label: `${date}：${count} 篇公开文章`,
      level: activityLevel(count),
      active: true
    };
  });
});

const publishedCount = computed(() => postsData.posts.length);
</script>

<template>
  <section class="activity-heatmap" aria-labelledby="activity-title">
    <div class="home-widget__heading">
      <h2 id="activity-title">写作活动</h2>
      <p>{{ publishedCount }} 篇</p>
    </div>
    <p class="activity-heatmap__description">按公开文章发布日期统计</p>
    <div class="activity-heatmap__month-picker">
      <output for="activity-month-slider">{{ selectedMonth.label }}</output>
      <input
        id="activity-month-slider"
        v-model.number="selectedMonthIndex"
        type="range"
        :min="0"
        :max="months.length - 1"
        step="1"
        aria-label="选择写作活动月份"
        :aria-valuetext="selectedMonth.label"
      >
      <div aria-hidden="true">
        <span>{{ months[0]?.edgeLabel }}</span>
        <span>{{ months[months.length - 1]?.edgeLabel }}</span>
      </div>
    </div>
    <div class="activity-heatmap__grid" role="group" :aria-label="`${selectedMonth.label}的文章发布活动热力图`">
      <span
        v-for="day in activity"
        :key="day.key"
        class="activity-heatmap__day"
        :class="[
          `activity-heatmap__day--level-${day.level}`,
          { 'activity-heatmap__day--empty': !day.active }
        ]"
        :aria-label="day.active ? day.label : undefined"
        :data-tooltip="day.label"
        :tabindex="day.active ? 0 : -1"
      />
    </div>
  </section>
</template>
