---
title: 文章
layout: page
---

<script setup lang="ts">
import { data as postsData } from '../posts.data'
import PostDirectory from '../.vitepress/theme/components/PostDirectory.vue'
</script>

# 文章

按发布时间倒序排列，可按标签筛选。草稿文章不会显示在这里。

<PostDirectory :posts="postsData.posts" />
