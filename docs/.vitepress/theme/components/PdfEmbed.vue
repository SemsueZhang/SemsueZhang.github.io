<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

const props = defineProps<{
  src: string;
  title: string;
}>();

const { site } = useData();
const pdfSrc = computed(() => props.src.startsWith(site.value.base) ? props.src : withBase(props.src));
const canPreview = ref(true);

onMounted(() => {
  canPreview.value = navigator.pdfViewerEnabled !== false;
});
</script>

<template>
  <span class="pdf-embed">
    <span class="pdf-embed__bar">
      <span class="pdf-embed__title">{{ title }}</span>
      <a :href="pdfSrc" target="_blank" rel="noopener noreferrer" :aria-label="`在新标签页打开 PDF：${title}`">
        打开 PDF
      </a>
    </span>
    <iframe v-if="canPreview" class="pdf-embed__frame" :src="pdfSrc" :title="title" loading="lazy"></iframe>
    <span v-else class="pdf-embed__fallback" role="note">
      当前浏览器不支持内嵌 PDF，请点击上方“打开 PDF”查看。
    </span>
  </span>
</template>

<style scoped>
.pdf-embed {
  display: block;
  width: 100%;
  margin: var(--space-5) 0;
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
}

.pdf-embed__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border-strong);
  background: var(--color-accent-soft);
  font-size: 0.875rem;
  line-height: 1.6;
}

.pdf-embed__title {
  min-width: 0;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.pdf-embed__bar a {
  flex-shrink: 0;
  padding: 0.125rem 0;
  color: var(--color-text);
}

.pdf-embed__bar a:hover {
  text-decoration-thickness: 2px;
}

.pdf-embed__frame {
  display: block;
  width: 100%;
  height: clamp(20rem, 75vh, 50rem);
  border: 0;
  background: var(--color-surface);
}

.pdf-embed__fallback {
  display: block;
  padding: var(--space-6) var(--space-4);
  color: var(--color-text-muted);
}
</style>
