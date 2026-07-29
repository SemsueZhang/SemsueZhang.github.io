<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  date?: string;
  updated?: string;
}>();

function formatDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[1]} 年 ${Number(match[2])} 月 ${Number(match[3])} 日` : value;
}

const published = computed(() => props.date ? formatDate(props.date) : '');
const updated = computed(() => props.updated ? formatDate(props.updated) : '');
</script>

<template>
  <dl v-if="published || updated" class="post-meta">
    <div v-if="published">
      <dt>发布</dt>
      <dd><time :datetime="date">{{ published }}</time></dd>
    </div>
    <div v-if="updated && updated !== published">
      <dt>更新</dt>
      <dd><time :datetime="updated">{{ updated }}</time></dd>
    </div>
  </dl>
</template>
