<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import { Content } from 'vitepress/dist/client/app/components/Content.js';
import { data as todosData } from '../../../todos.data';
import { normalizeTodo } from '../../utils/todos';
import { useReaderWindow } from '../utils/useReaderWindow';
import MacWindowReader from './MacWindowReader.vue';

const { frontmatter } = useData();
const route = useRoute();
const scrollElement = ref<HTMLElement | null>(null);
const { readerElement, isExpanded, isFullscreen, fullscreenError, toggleWindowSize, toggleFullscreen } = useReaderWindow(scrollElement);
const isIndex = computed(() => frontmatter.value.layout === 'todo-index');
const todo = computed(() => isIndex.value ? null : normalizeTodo({
  url: route.path,
  frontmatter: frontmatter.value
}));
const hasExamples = computed(() => todosData.todos.some((item) => item.example));
const progressStatus = computed(() => {
  if (!todo.value || todo.value.progress.completed === 0) return '未开始';
  return todo.value.progress.completed === todo.value.progress.total ? '已完成' : '进行中';
});
</script>

<template>
  <div ref="readerElement" class="post-layout todo-layout" :class="{ 'post-layout--windowed': !isExpanded }">
    <MacWindowReader
      :key="route.path"
      class="post-page todo-window"
      :label="isIndex ? '计划' : todo?.title"
      window-label="计划"
      :close-href="isIndex ? '/' : '/todo/'"
      :close-label="isIndex ? '返回首页' : '返回计划列表'"
      :expanded="isExpanded"
      :fullscreen="isFullscreen"
      :fullscreen-error="fullscreenError"
      @toggle-window-size="toggleWindowSize"
      @toggle-fullscreen="toggleFullscreen"
    >
      <div
        ref="scrollElement"
        class="todo-scroll"
        tabindex="0"
        :aria-label="isIndex ? '计划列表' : '计划详情'"
      >
        <section v-if="isIndex" class="todo-board" aria-labelledby="todo-board-title">
          <h1 id="todo-board-title" class="sr-only">计划</h1>
          <p v-if="hasExamples" class="todo-board__note">以下含示例计划，点击卡片查看进度与详情。</p>
          <ul v-if="todosData.todos.length" class="todo-grid" aria-label="按日期排列的计划">
            <li v-for="item in todosData.todos" :key="item.url">
              <a
                class="todo-card"
                :href="withBase(item.url)"
                :aria-label="`${item.date.label}，预计 ${item.duration}，${item.title}，查看进度与详情`"
              >
                <time class="todo-card__date" :datetime="item.date.value">{{ item.date.value.replace(/-/g, '.') }}</time>
                <span class="todo-card__duration">{{ item.duration }}</span>
              </a>
            </li>
          </ul>
          <div v-else class="todo-empty">
            <h2>还没有计划</h2>
            <p>新的安排会出现在这里。</p>
          </div>
        </section>

        <article v-else-if="todo" class="todo-detail">
          <header class="todo-detail__header">
            <p v-if="todo.example" class="todo-detail__example">示例计划</p>
            <h1>{{ todo.title }}</h1>
            <dl class="todo-detail__meta">
              <div><dt>日期</dt><dd><time :datetime="todo.date.value">{{ todo.date.label }}</time></dd></div>
              <div><dt>预计时长</dt><dd>{{ todo.duration }}</dd></div>
            </dl>
          </header>

          <section class="todo-progress" aria-labelledby="todo-progress-title">
            <div class="todo-progress__heading">
              <h2 id="todo-progress-title">完成进度</h2>
              <span class="todo-progress__status">{{ progressStatus }}</span>
            </div>
            <div class="todo-progress__summary">
              <span>已完成 {{ todo.progress.completed }} / {{ todo.progress.total }} 项</span>
              <strong>{{ todo.progress.percent }}%</strong>
            </div>
            <progress
              class="todo-progress__bar"
              :value="todo.progress.completed"
              :max="todo.progress.total"
              aria-labelledby="todo-progress-title"
            >{{ todo.progress.percent }}%</progress>
            <ul class="todo-checklist" aria-label="计划步骤">
              <li v-for="(step, index) in todo.steps" :key="index" :class="{ 'todo-checklist__item--done': step.done }">
                <span class="todo-checklist__mark" aria-hidden="true">{{ step.done ? '✓' : '·' }}</span>
                <span class="todo-checklist__text">{{ step.text }}</span>
                <span class="todo-checklist__status">{{ step.done ? '已完成' : '待完成' }}</span>
              </li>
            </ul>
          </section>

          <div class="todo-detail__body post-content">
            <Content />
          </div>
        </article>
      </div>
    </MacWindowReader>
  </div>
</template>

<style scoped>
.todo-scroll {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-strong) transparent;
}

.todo-board { max-width: 68rem; margin: 0 auto; }
.todo-board__note { margin: 0 0 var(--space-5); color: var(--color-text-muted); font-size: 0.8rem; }
.todo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 13.5rem), 1fr)); gap: var(--space-4); padding: 0; margin: 0; list-style: none; }
.todo-grid > li { min-width: 0; }

.todo-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 9.5rem;
  padding: clamp(1rem, 2.5cqi, 1.5rem);
  overflow-wrap: anywhere;
  color: var(--color-text);
  text-decoration: none;
  background: linear-gradient(145deg, var(--color-accent-soft), transparent 70%), color-mix(in srgb, var(--color-surface) 70%, transparent);
  border: 1px solid var(--color-border-strong);
  border-radius: 1rem;
  box-shadow: 0 3px 12px color-mix(in srgb, var(--color-accent) 5%, transparent), inset 0 1px 0 var(--color-border);
  backdrop-filter: blur(12px);
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.todo-card:hover { color: var(--color-text); background-color: var(--color-accent-soft); border-color: var(--color-accent); box-shadow: 0 6px 20px color-mix(in srgb, var(--color-accent) 10%, transparent); }
.todo-card:focus-visible { outline: 3px solid var(--color-accent-strong); outline-offset: 4px; }
.todo-card__date { font-size: clamp(0.95rem, 1.8cqi, 1.15rem); font-weight: 550; font-variant-numeric: tabular-nums; letter-spacing: 0.035em; }
.todo-card__duration { color: var(--color-text-muted); font-size: 0.86rem; }
.todo-empty { padding-block: var(--space-7); color: var(--color-text-muted); text-align: center; }
.todo-empty h2 { margin: 0; color: var(--color-text); font-size: 1rem; font-weight: 500; }
.todo-empty p { font-size: 0.88rem; }
.todo-detail { max-width: var(--content-width); margin: 0 auto; overflow-wrap: anywhere; }
.todo-detail__header h1 { margin: 0 0 var(--space-4); font-size: clamp(1.25rem, 2.5cqi, 1.5rem); font-weight: 600; line-height: 1.5; }
.todo-detail__example { margin: 0 0 var(--space-2); color: var(--color-text-muted); font-size: 0.78rem; }
.todo-detail__meta { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-5); margin: 0; color: var(--color-text-muted); font-size: 0.82rem; }
.todo-detail__meta > div { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.todo-detail__meta dd { margin: 0; color: var(--color-text); }
.todo-progress { margin-block: var(--space-6); }
.todo-progress__heading, .todo-progress__summary { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-4); }
.todo-progress__heading { margin-bottom: var(--space-4); }
.todo-progress__heading h2 { margin: 0; font-size: 1rem; font-weight: 600; }
.todo-progress__status { color: var(--color-accent-strong); font-size: 0.8rem; }
.todo-progress__summary { margin-bottom: var(--space-2); color: var(--color-text-muted); font-size: 0.8rem; }
.todo-progress__summary strong { color: var(--color-text); font-size: 0.95rem; font-weight: 550; font-variant-numeric: tabular-nums; }
.todo-progress__bar { display: block; width: 100%; height: 0.45rem; overflow: hidden; appearance: none; border: 0; border-radius: 1rem; background: var(--color-accent-soft); color: var(--color-accent); }
.todo-progress__bar::-webkit-progress-bar { background: var(--color-accent-soft); border-radius: 1rem; }
.todo-progress__bar::-webkit-progress-value { background: var(--color-accent); border-radius: 1rem; }
.todo-progress__bar::-moz-progress-bar { background: var(--color-accent); border-radius: 1rem; }
.todo-checklist { padding: 0; margin: var(--space-5) 0 0; list-style: none; }
.todo-checklist li { display: grid; grid-template-columns: 1.25rem minmax(0, 1fr) auto; align-items: start; gap: var(--space-3); padding-block: var(--space-3); border-bottom: 1px solid var(--color-border-strong); font-size: 0.9rem; }
.todo-checklist__mark { display: grid; place-items: center; width: 1.2rem; height: 1.2rem; margin-top: 0.15rem; color: var(--color-text-muted); border: 1px solid var(--color-border-strong); border-radius: 0.35rem; font-size: 0.75rem; }
.todo-checklist__status { padding-top: 0.15rem; color: var(--color-text-muted); font-size: 0.75rem; white-space: nowrap; }
.todo-checklist__item--done .todo-checklist__mark { color: var(--color-accent-strong); background: var(--color-accent-soft); }
.todo-detail__body { padding-top: var(--space-2); }
.todo-detail__body :deep(h2) { margin-top: var(--space-6); font-family: var(--font-sans); font-size: 1rem; font-weight: 600; }
.todo-detail__body :deep(h3) { font-family: var(--font-sans); font-size: 0.95rem; }
.todo-detail__body :deep(p), .todo-detail__body :deep(li) { font-size: 0.92rem; }

@container article-reader (max-width: 32rem) {
  .todo-scroll { padding: var(--space-4); }
  .todo-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
  .todo-card { min-height: 7rem; padding: var(--space-4); border-radius: 0.85rem; }
  .todo-card__date { font-size: 0.9rem; letter-spacing: 0; }
  .todo-card__duration { font-size: 0.78rem; }
  .todo-detail__meta { column-gap: var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .todo-card { transition: none; }
}
</style>
