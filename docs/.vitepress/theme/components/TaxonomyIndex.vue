<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import type { Post } from '../../../posts.data';
import { taxonomyPath, type TaxonomyKind } from '../../utils/taxonomy';
import { withBase } from 'vitepress';

const props = defineProps<{
  kind: TaxonomyKind;
  groups: Record<string, Post[]>;
}>();

interface CloudEntry {
  name: string;
  count: number;
  style: CSSProperties;
}

const entries = computed<CloudEntry[]>(() => {
  const source = Object.entries(props.groups)
    .map(([name, posts]) => ({ name, count: posts.length }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-CN'));
  const counts = source.map((entry) => entry.count);
  const minimum = Math.min(...counts);
  const maximum = Math.max(...counts);
  const range = maximum - minimum;

  return source.map((entry) => {
    const ratio = range === 0 ? 0.45 : (entry.count - minimum) / range;

    return {
      ...entry,
      style: {
        fontSize: `${0.95 + ratio * 1.35}rem`,
        fontWeight: 500 + Math.round(ratio * 180)
      }
    };
  });
});

const label = computed(() => props.kind === 'tag' ? '标签' : '分类');
</script>

<template>
  <section class="taxonomy-index" :class="`taxonomy-index--${kind}`" :aria-label="`${label}词云`">
    <ul v-if="entries.length">
      <li v-for="entry in entries" :key="entry.name">
        <a
          :href="withBase(taxonomyPath(kind, entry.name))"
          :style="entry.style"
          :aria-label="`${entry.name}，${entry.count} 篇文章`"
        >
          <span>{{ entry.name }}</span>
          <small aria-hidden="true">{{ entry.count }}</small>
        </a>
      </li>
    </ul>
    <p v-else class="taxonomy-index__empty">暂时没有可显示的{{ label }}。</p>
  </section>
</template>
