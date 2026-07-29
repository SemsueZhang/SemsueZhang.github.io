<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '../../../posts.data';
import { taxonomyPath, type TaxonomyKind } from '../../utils/taxonomy';
import { withBase } from 'vitepress';

const props = defineProps<{
  kind: TaxonomyKind;
  groups: Record<string, Post[]>;
}>();

const entries = computed(() =>
  Object.entries(props.groups).sort(([left], [right]) => left.localeCompare(right, 'zh-CN'))
);

const label = computed(() => props.kind === 'tag' ? '标签' : '分类');
</script>

<template>
  <section class="taxonomy-index" :aria-label="`${label}索引`">
    <ul v-if="entries.length">
      <li v-for="[name, posts] in entries" :key="name">
        <a :href="withBase(taxonomyPath(kind, name))">{{ name }}</a>
        <span>{{ posts.length }} 篇</span>
      </li>
    </ul>
    <p v-else class="taxonomy-index__empty">暂时没有可显示的{{ label }}。</p>
  </section>
</template>
