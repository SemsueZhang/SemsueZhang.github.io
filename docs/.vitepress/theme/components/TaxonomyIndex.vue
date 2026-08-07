<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { withBase } from 'vitepress';
import type { Post } from '../../../posts.data';
import { taxonomyPath, type TaxonomyKind } from '../../utils/taxonomy';

const CLOUD_WIDTH = 1_000;
const CLOUD_HEIGHT = 360;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const INITIAL_POSITIONS = [
  { x: 500, y: 178 },
  { x: 375, y: 230 },
  { x: 625, y: 230 },
  { x: 470, y: 285 },
  { x: 585, y: 115 },
  { x: 350, y: 125 }
];

const props = defineProps<{
  kind: TaxonomyKind;
  groups: Record<string, Post[]>;
}>();

type CloudStyle = CSSProperties & Record<'--cloud-size', string>;

interface CloudEntry {
  name: string;
  count: number;
  style: CloudStyle;
}

interface CloudBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function stableHash(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = ((hash << 5) - hash + character.codePointAt(0)!) | 0;
  }

  return hash >>> 0;
}

function estimateWidth(label: string, fontSize: number): number {
  return [...label].reduce((width, character) => width + (character.charCodeAt(0) > 127 ? 0.95 : 0.62), 0) * fontSize;
}

function intersects(left: CloudBounds, right: CloudBounds): boolean {
  const padding = 10;

  return !(
    left.x + left.width / 2 + padding < right.x - right.width / 2 ||
    left.x - left.width / 2 - padding > right.x + right.width / 2 ||
    left.y + left.height / 2 + padding < right.y - right.height / 2 ||
    left.y - left.height / 2 - padding > right.y + right.height / 2
  );
}

function placeWord(index: number, name: string, fontSize: number, occupied: CloudBounds[]): CloudBounds {
  const width = estimateWidth(name, fontSize);
  const height = fontSize * 1.25;
  const phase = (stableHash(name) % 360) * (Math.PI / 180);

  const preferredPosition = INITIAL_POSITIONS[index];

  if (preferredPosition) {
    const preferred = { ...preferredPosition, width, height };
    const fits = preferred.x - width / 2 >= 8
      && preferred.x + width / 2 <= CLOUD_WIDTH - 8
      && preferred.y - height / 2 >= 8
      && preferred.y + height / 2 <= CLOUD_HEIGHT - 8;

    if (fits && !occupied.some((bounds) => intersects(preferred, bounds))) {
      return preferred;
    }
  }

  for (let attempt = 0; attempt < 1_200; attempt += 1) {
    const radius = attempt === 0 && index === 0 ? 0 : 18 + Math.sqrt(attempt + index * 9) * 13;
    const angle = phase + attempt * GOLDEN_ANGLE;
    const candidate = {
      x: CLOUD_WIDTH / 2 + Math.cos(angle) * radius * 1.25,
      y: CLOUD_HEIGHT / 2 + Math.sin(angle) * radius * 0.7,
      width,
      height
    };
    const fits = candidate.x - width / 2 >= 8
      && candidate.x + width / 2 <= CLOUD_WIDTH - 8
      && candidate.y - height / 2 >= 8
      && candidate.y + height / 2 <= CLOUD_HEIGHT - 8;

    if (fits && !occupied.some((bounds) => intersects(candidate, bounds))) {
      return candidate;
    }
  }

  return {
    x: CLOUD_WIDTH / 2,
    y: CLOUD_HEIGHT / 2,
    width,
    height
  };
}

const entries = computed<CloudEntry[]>(() => {
  const source = Object.entries(props.groups)
    .map(([name, posts]) => ({ name, count: posts.length }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-CN'));
  const counts = source.map((entry) => entry.count);
  const minimum = Math.min(...counts);
  const maximum = Math.max(...counts);
  const range = maximum - minimum;
  const occupied: CloudBounds[] = [];

  return source.map((entry, index) => {
    const hashOffset = (stableHash(entry.name) % 100) / 100 - 0.5;
    const weight = range === 0 ? 0.5 + hashOffset * 0.22 : (entry.count - minimum) / range;
    const fontSize = 18 + weight * 22;
    const bounds = placeWord(index, entry.name, fontSize, occupied);
    occupied.push(bounds);

    return {
      ...entry,
      style: {
        '--cloud-size': `${fontSize / 16}rem`,
        left: `${(bounds.x / CLOUD_WIDTH) * 100}%`,
        top: `${(bounds.y / CLOUD_HEIGHT) * 100}%`,
        fontWeight: 430 + Math.round(weight * 240),
        opacity: 0.58 + weight * 0.38
      }
    };
  });
});

const label = computed(() => props.kind === 'tag' ? '标签' : '分类');
</script>

<template>
  <section class="taxonomy-index" :class="`taxonomy-index--${kind}`" :aria-label="`${label}词云`">
    <header class="taxonomy-index__header">
      <h1>{{ label }}</h1>
      <p>{{ entries.length }} 个{{ label }}</p>
    </header>
    <ul v-if="entries.length">
      <li v-for="entry in entries" :key="entry.name">
        <a
          :href="withBase(taxonomyPath(kind, entry.name))"
          :style="entry.style"
          :aria-label="`${entry.name}，${entry.count} 篇文章`"
          :title="`${entry.name} · ${entry.count} 篇文章`"
        >{{ entry.name }}</a>
      </li>
    </ul>
    <p v-else class="taxonomy-index__empty">暂时没有可显示的{{ label }}。</p>
  </section>
</template>
