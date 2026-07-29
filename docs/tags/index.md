---
title: 标签
layout: page
---

<script setup lang="ts">
import { data as postsData } from '../posts.data'
import TaxonomyIndex from '../.vitepress/theme/components/TaxonomyIndex.vue'
</script>

# 标签

按主题浏览已发布文章。

<TaxonomyIndex kind="tag" :groups="postsData.byTag" />
