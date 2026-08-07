# 项目协作指南

## 项目目标

这是 Zhang Chenrui 的个人静态博客，面向科研笔记、论文阅读笔记与编程记录。站点由 Markdown 在构建时生成，并部署到 GitHub Pages；不包含后端或动态用户系统。

## 技术栈

- VitePress
- Vue 3
- TypeScript
- pnpm
- Markdown
- GitHub Actions 与 GitHub Pages

## 目录职责

- `docs/`：站点内容根目录；页面与文章均放在这里。
- `docs/posts/`：Markdown 文章，按主题或时间组织。
- `docs/.vitepress/config.ts`：站点、导航和 Markdown 构建配置。
- `docs/.vitepress/theme/`：完全自定义的 Vue 主题、布局与样式。
- `docs/public/`：原样复制到站点根目录的静态资源。
- `.github/workflows/`：GitHub Actions 部署工作流。

## 编码规范

- 使用 TypeScript；Vue 组件使用 `<script setup lang="ts">`。
- 使用 2 空格缩进、单引号、末尾分号。
- 组件采用 PascalCase 文件名，工具模块采用 camelCase 文件名。
- 样式优先使用 CSS 自定义属性，确保窄屏可读并兼顾浅色、深色系统偏好。
- 页面链接使用 VitePress 的 `withBase`，以兼容 GitHub Pages 的部署路径。
- 不修改依赖锁文件以外的生成物；构建产物不可提交。

## 已确认的视觉设计原则

- 站点是克制、现代的科研与技术博客，而不是营销落地页；避免夸张的大标题、重复的区块标题、装饰性编号和无意义标签。
- 页眉采用 macOS 窗口工具栏风格：贴在页面最上方的一整行半透明细栏和底部分隔线；不要做成居中的悬浮胶囊，也不要添加窗口控制点。品牌、中文主导航与控制项在同一行，桌面端必须直接显示导航；仅在窄屏（`52rem` 以下）改用可访问的折叠菜单。
- 所有内容页使用统一的半透明毛玻璃卡片：以高可读性的正文为优先，使用细边框、柔和阴影和 `backdrop-filter`；不要将卡片做成厚重或不透明的白块。
- 页面背景使用低饱和环境光而非纯色背景。红色与暖黄色仅用于周边柔光和小面积强调，不可大面积铺底或影响正文阅读。
- 浅色与深色模式都需要单独校准背景、玻璃透明度、边框、阴影、链接和热力图对比度；禁止只做简单反色。
- 保持圆角和适量留白，但避免侧栏、卡片或栅格出现被拉伸后的大块空白。首页桌面端的各主要卡片可独立滚动，避免整页无止境滚动。
- 文章、标签、分类和归档索引使用一个居中、约四分之三视口大小的可拖动毛玻璃窗口。窗口标题居中且为适中的小标题字号，标题栏必须与正文玻璃层有可辨识的色差；窗口左侧三点中红点返回首页、绿点切换至与普通文章阅读器相同的窗口尺寸、黄点仅作装饰。文章目录只显示标题和日期，禁止在每篇文章上叠加独立玻璃卡、分类、摘要、筛选器或装饰图标。
- 页脚为贴边的矩形信息栏，不使用悬浮胶囊、圆角卡片或额外阴影。
- 交互只使用轻量的悬停与焦点反馈，尊重 `prefers-reduced-motion`；不引入 Tailwind、React、GSAP 或重量级动效依赖。
- 所有交互元素需要明显焦点态、键盘可达和足够颜色对比度；状态不能只依赖颜色表达。

## Markdown frontmatter 规范

文章使用 YAML frontmatter：

```yaml
---
title: 文章标题
date: 2026-07-28
updated: 2026-07-28
description: 用于列表和页面摘要的简短说明。
tags:
  - 标签一
  - 标签二
category: 分类名称
draft: false
featured: false
layout: post
---
```

- 所有字段均为文章必填项；`layout` 必须为 `post`。
- `date`、`updated` 使用 `YYYY-MM-DD` 格式，且 `updated` 不早于 `date`。
- `draft: true` 的文章不得进入生产环境的文章索引或静态构建产物。

## 禁止事项

- 不引入数据库、后端服务、用户登录、管理后台或 CMS。
- 不把 VitePress 默认主题作为最终界面。
- 不提交 `node_modules/`、`docs/.vitepress/dist/`、缓存、密钥或 `.env` 文件。
- 不在没有确认的情况下覆盖用户已有内容或自动执行 Git 提交。

## 构建和检查命令

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```
