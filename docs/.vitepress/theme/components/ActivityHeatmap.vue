<script setup lang="ts">
import { computed, ref } from 'vue';
import { data as postsData } from '../../../posts.data';

interface ActivityDay {
  key: string;
  label: string;
  level: number;
  active: boolean;
}

interface MonthMarker {
  key: string;
  label: string;
  column: number;
}

interface ActivityYear {
  year: number;
  count: number;
  days: ActivityDay[];
  months: MonthMarker[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const activityCounts = new Map<number, number>();

for (const post of postsData.posts) {
  activityCounts.set(post.date.timestamp, (activityCounts.get(post.date.timestamp) ?? 0) + 1);
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

function firstDayOffset(year: number): number {
  return (new Date(Date.UTC(year, 0, 1)).getUTCDay() + 6) % 7;
}

function createYearActivity(year: number): ActivityYear {
  const offset = firstDayOffset(year);
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86_400_000;
  const days = Array.from({ length: 53 * 7 }, (_, index) => {
    const dayOfYear = index - offset;

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
  });

  return {
    year,
    count: postsData.posts.filter((post) => post.date.year === year).length,
    days,
    months: MONTHS.map((label, month) => {
      const dayOfYear = (Date.UTC(year, month, 1) - Date.UTC(year, 0, 1)) / 86_400_000;

      return {
        key: `${year}-${month}`,
        label,
        column: Math.floor((offset + dayOfYear) / 7) + 1
      };
    })
  };
}

const postYears = postsData.posts.map((post) => post.date.year);
const currentYear = new Date().getUTCFullYear();
const latestYear = Math.max(currentYear, ...postYears);
const earliestYear = Math.min(...postYears, latestYear - 4);
const years = Array.from({ length: latestYear - earliestYear + 1 }, (_, index) => latestYear - index);
const selectedYear = ref(years[0] ?? currentYear);
const selectedActivity = computed(() => createYearActivity(selectedYear.value));
</script>

<template>
  <section class="activity-heatmap" aria-label="按年份查看的文章活动热力图">
    <div class="activity-heatmap__summary">
      {{ selectedActivity.count }} 篇文章 · {{ selectedActivity.year }}
    </div>

    <div class="activity-heatmap__layout">
      <div class="activity-heatmap__scroll">
        <div class="activity-heatmap__calendar">
          <div class="activity-heatmap__months" aria-hidden="true">
            <span
              v-for="month in selectedActivity.months"
              :key="month.key"
              :style="{ gridColumnStart: month.column }"
            >{{ month.label }}</span>
          </div>

          <div class="activity-heatmap__days-row">
            <div class="activity-heatmap__weekdays" aria-hidden="true">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div
              class="activity-heatmap__grid"
              role="group"
              :aria-label="`${selectedActivity.year} 年文章发布活动热力图`"
            >
              <span
                v-for="day in selectedActivity.days"
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
          </div>

          <div class="activity-heatmap__legend" aria-label="文章数量图例">
            <span>少</span>
            <i class="activity-heatmap__day--level-0" aria-hidden="true" />
            <i class="activity-heatmap__day--level-1" aria-hidden="true" />
            <i class="activity-heatmap__day--level-2" aria-hidden="true" />
            <i class="activity-heatmap__day--level-3" aria-hidden="true" />
            <span>多</span>
          </div>
        </div>
      </div>

      <nav class="activity-heatmap__years" aria-label="选择活动年份">
        <button
          v-for="year in years"
          :key="year"
          type="button"
          :aria-pressed="year === selectedYear"
          @click="selectedYear = year"
        >{{ year }}</button>
      </nav>
    </div>
  </section>
</template>
