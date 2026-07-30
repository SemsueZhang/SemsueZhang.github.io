<script setup lang="ts">
import { withBase } from 'vitepress';

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>
        <span>© {{ year }} Zhang Chenrui</span>
        <span>Built with VitePress · Vue · Markdown</span>
      </p>
      <nav aria-label="页脚导航">
        <a :href="withBase('/archive/')">归档索引</a>
        <a :href="withBase('/about')">关于</a>
        <a href="https://github.com/SemsueZhang" rel="me external">GitHub</a>
      </nav>
    </div>
  </footer>
</template>
