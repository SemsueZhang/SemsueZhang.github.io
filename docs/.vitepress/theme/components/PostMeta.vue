<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  date?: string;
  updated?: string;
  compact?: boolean;
}>();

function formatDate(value: string) {
  if (props.compact) return value;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[1]} 年 ${Number(match[2])} 月 ${Number(match[3])} 日` : value;
}

const published = computed(() => props.date ? formatDate(props.date) : '');
const updatedLabel = computed(() => props.updated ? formatDate(props.updated) : '');
</script>

<template>
  <dl v-if="published || updatedLabel" class="post-meta">
    <div v-if="published">
      <dt>发布</dt>
      <dd><time :datetime="date">{{ published }}</time></dd>
    </div>
    <div v-if="updatedLabel">
      <dt>更新</dt>
      <dd><time :datetime="updated">{{ updatedLabel }}</time></dd>
    </div>
  </dl>
</template>
