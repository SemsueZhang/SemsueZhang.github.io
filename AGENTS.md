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
