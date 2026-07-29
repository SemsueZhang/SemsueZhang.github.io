---
title: 分类
layout: page
---

<script setup lang="ts">
import { data as postsData } from '../posts.data'
import TaxonomyIndex from '../.vitepress/theme/components/TaxonomyIndex.vue'
</script>

# 分类

按写作方向浏览已发布文章。

<TaxonomyIndex kind="category" :groups="postsData.byCategory" />
