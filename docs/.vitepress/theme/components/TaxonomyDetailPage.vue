<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { data as postsData } from '../../../posts.data';
import { decodeTaxonomySlug, type TaxonomyKind } from '../../utils/taxonomy';
import PostList from './PostList.vue';

const props = defineProps<{
  kind: TaxonomyKind;
}>();

const { params } = useData();
const label = computed(() => props.kind === 'tag' ? '标签' : '分类');
const source = computed(() => props.kind === 'tag' ? postsData.byTag : postsData.byCategory);
const rawParam = computed(() => params.value?.[props.kind] ?? '');
const name = computed(() => {
  const decoded = decodeTaxonomySlug(rawParam.value);
  return source.value[decoded] ? decoded : rawParam.value;
});
const posts = computed(() => source.value[name.value] ?? []);
const indexPath = computed(() => props.kind === 'tag' ? '/tags/' : '/categories/');
</script>

<template>
  <section class="taxonomy-detail">
    <a class="back-link" :href="withBase(indexPath)">← 返回{{ label }}索引</a>
    <p class="eyebrow">{{ label }}</p>
    <h1>{{ name || '未找到对应内容' }}</h1>
    <p class="taxonomy-detail__summary">{{ posts.length }} 篇文章</p>
    <PostList :posts="posts" />
  </section>
</template>
