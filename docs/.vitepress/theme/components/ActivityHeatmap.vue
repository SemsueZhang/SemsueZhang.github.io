<script setup lang="ts">
import { computed } from 'vue';
import { data as postsData } from '../../../posts.data';

interface ActivityDay {
  key: string;
  label: string;
  level: number;
  active: boolean;
}

interface ActivityYear {
  year: number;
  days: ActivityDay[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function activityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

const activityCounts = new Map<number, number>();

for (const post of postsData.posts) {
  activityCounts.set(post.date.timestamp, (activityCounts.get(post.date.timestamp) ?? 0) + 1);
}

const postYears = postsData.posts.map((post) => post.date.year);
const latestYear = postYears.length ? Math.max(...postYears) : new Date().getUTCFullYear();
const earliestYear = postYears.length ? Math.min(...postYears) : latestYear;

function createYearActivity(year: number): ActivityYear {
  const firstDayOffset = (new Date(Date.UTC(year, 0, 1)).getUTCDay() + 6) % 7;
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86_400_000;
  const cellCount = Math.ceil((firstDayOffset + daysInYear) / 7) * 7;

  return {
    year,
    days: Array.from({ length: cellCount }, (_, index) => {
      const dayOfYear = index - firstDayOffset;

      if (dayOfYear < 0 || dayOfYear >= daysInYear) {
        return {
          key: `empty-${year}-${index}`,
          label: '',
          level: 0,
          active: false
        };
      }

      const timestamp = Date.UTC(year, 0, dayOfYear + 1);
      const count = activityCounts.get(timestamp) ?? 0;
      const date = formatDate(timestamp);

      return {
        key: date,
        label: `${date}：${count} 篇公开文章`,
        level: activityLevel(count),
        active: true
      };
    })
  };
}

const activityYears = computed<ActivityYear[]>(() => Array.from(
  { length: latestYear - earliestYear + 1 },
  (_, index) => createYearActivity(latestYear - index)
));

</script>

<template>
  <section class="activity-heatmap" aria-label="按公开文章发布日期统计的年度活动热力图">
    <div class="activity-heatmap__years">
      <section
        v-for="activityYear in activityYears"
        :key="activityYear.year"
        class="activity-heatmap__year"
        :aria-label="`${activityYear.year} 年文章发布活动热力图`"
      >
        <h3>{{ activityYear.year }}</h3>
        <div class="activity-heatmap__grid" role="group">
          <span
            v-for="day in activityYear.days"
            :key="day.key"
            class="activity-heatmap__day"
            :class="[
              `activity-heatmap__day--level-${day.level}`,
              { 'activity-heatmap__day--empty': !day.active }
            ]"
            :aria-label="day.active ? day.label : undefined"
            :data-tooltip="day.label"
            tabindex="-1"
          />
        </div>
      </section>
    </div>
  </section>
</template>
