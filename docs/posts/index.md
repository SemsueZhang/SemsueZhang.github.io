---
title: 文章
layout: page
---

<script setup lang="ts">
import { data as postsData } from '../posts.data'
import PostDirectory from '../.vitepress/theme/components/PostDirectory.vue'
</script>

<PostDirectory :posts="postsData.posts" />
