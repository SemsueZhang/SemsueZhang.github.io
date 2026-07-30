---
title: 标签
layout: page
---

<script setup lang="ts">
import { data as postsData } from '../posts.data'
import TaxonomyIndex from '../.vitepress/theme/components/TaxonomyIndex.vue'
</script>

<TaxonomyIndex kind="tag" :groups="postsData.byTag" />
