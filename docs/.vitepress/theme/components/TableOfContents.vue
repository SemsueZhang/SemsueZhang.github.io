<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vitepress';

interface TocItem {
  level: number;
  title: string;
  slug: string;
}

const props = defineProps<{
  headers: TocItem[];
}>();

const route = useRoute();
const isOpen = ref(false);
const activeSlug = ref('');
let observer: IntersectionObserver | undefined;

const items = computed(() => props.headers.filter((header) => header.level === 2 || header.level === 3));
const shouldRender = computed(() => items.value.length >= 2);

function stopObserving() {
  observer?.disconnect();
  observer = undefined;
}

function observeHeadings() {
  stopObserving();

  if (!shouldRender.value || typeof window === 'undefined') {
    return;
  }

  const headings = items.value
    .map((item) => document.getElementById(item.slug))
    .filter((heading): heading is HTMLElement => heading !== null);

  activeSlug.value = headings[0]?.id ?? '';
  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

    if (visible[0]?.target instanceof HTMLElement) {
      activeSlug.value = visible[0].target.id;
    }
  }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 1] });

  headings.forEach((heading) => observer?.observe(heading));
}

function closeOnMobile() {
  isOpen.value = false;
}

onMounted(observeHeadings);
onBeforeUnmount(stopObserving);
watch(() => route.path, observeHeadings);
watch(items, observeHeadings);
</script>

<template>
  <nav v-if="shouldRender" class="table-of-contents" aria-label="文章目录">
    <button
      class="table-of-contents__toggle"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="table-of-contents-list"
      @click="isOpen = !isOpen"
    >
      <span>本页目录</span>
      <span aria-hidden="true">{{ isOpen ? '−' : '+' }}</span>
    </button>
    <ol id="table-of-contents-list" :class="{ 'table-of-contents__list--open': isOpen }">
      <li
        v-for="header in items"
        :key="header.slug"
        :class="[
          `table-of-contents__item--level-${header.level}`,
          { 'is-active': activeSlug === header.slug }
        ]"
      >
        <a
          :href="`#${header.slug}`"
          :aria-current="activeSlug === header.slug ? 'location' : undefined"
          @click="closeOnMobile"
        >
          {{ header.title }}
        </a>
      </li>
    </ol>
  </nav>
</template>
