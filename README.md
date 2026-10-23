# Zhang Chenrui's Blog

基于 VitePress、Vue 3 与 TypeScript 构建的个人静态博客，使用 GitHub Actions 自动部署到 GitHub Pages。

## 安装依赖

项目使用 pnpm 和锁文件管理依赖：

```bash
pnpm install --frozen-lockfile
```

首次本地开发也可以使用 `pnpm install`。请使用 Node.js 22 主版本；部署工作流同样固定使用 Node.js 22。

## 本地运行与构建

```bash
pnpm dev       # 启动本地开发服务器
pnpm typecheck # 执行 Vue 与 TypeScript 类型检查
pnpm build     # 构建静态站点到 docs/.vitepress/dist
pnpm preview   # 预览构建产物
```

站点内容位于 `docs/`，文章位于 `docs/posts/`。详细协作约定见 [AGENTS.md](AGENTS.md)。

## 在 Markdown 中嵌入 PDF

在正文中单独写一行 `@[标题](文件.pdf)`，即可显示 PDF 预览；预览上方同时提供“打开 PDF”链接，方便在新标签页阅读或使用浏览器的下载功能。

例如，将文件放在 `docs/public/pdfs/lecture.pdf`，然后写：

```md
@[课程讲义](/pdfs/lecture.pdf)
```

也支持相对当前 Markdown 文件的路径和在线 PDF 地址：

```md
@[论文](./attachments/paper.pdf)
@[在线论文](https://example.com/paper.pdf)
@[从第 3 页开始阅读](/pdfs/lecture.pdf#page=3)
@[含空格的文件名](<./attachments/course notes.pdf>)
```

`docs/public/` 中的文件使用以 `/` 开头的路径，省略 `docs/public`；构建时会自动兼容 GitHub Pages 的部署子路径。相对路径中的 PDF 会作为静态资源一起打包。预览使用浏览器内置 PDF 阅读器；在线链接需直接返回 PDF，且对方站点允许嵌入。若浏览器无法内嵌预览，可点击“打开 PDF”。`[标题](文件.pdf)` 仍然只生成普通链接，`![标题](图片.png)` 仍然用于插入图片。

## 添加与更新计划

计划入口为 `/todo/`。每个计划对应 `docs/todo/` 下的一个 Markdown 文件；列表仅显示日期和预计投入时长，点击后查看清单进度与正文细节。现有 `example-*.md` 均为演示内容，可以直接删除或复制后修改。

新建 `docs/todo/my-plan.md`，填写以下内容：

```yaml
---
title: 阅读一篇论文
date: '2026-10-23'
duration: 2 小时
layout: todo
steps:
  - text: 阅读摘要与引言
    done: true
  - text: 整理方法和疑问
    done: false
---
```

在 frontmatter 后用 Markdown 写具体安排、参考资料或完成标准。`date` 为计划日期，必须使用带引号的 `YYYY-MM-DD` 字符串，避免 YAML 自动转换日期；`duration` 是预计投入时长，例如 `45 分钟`、`2 小时`，不表示倒计时或截止时间。

`steps` 至少包含一项，每项都需填写非空的 `text` 与布尔值 `done`。把已完成事项的 `done` 改为 `true` 后重新构建，详情页会按清单项等权计算百分比。进度由仓库内容维护，网页不提供勾选编辑或浏览器本地存储。列表按日期升序排列，同日按文件对应的 URL 排序。

`title`、`date`、`duration`、`layout` 与 `steps` 为必填项，`layout` 必须为 `todo`；可选 `example: true` 标明演示内容，真实计划可省略该字段。可选 `draft: true` 将计划从列表和生产静态产物中排除。编辑后运行 `pnpm typecheck` 和 `pnpm build` 检查内容与页面。

## GitHub Pages 部署

工作流位于 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)。推送到 `main` 分支会自动安装锁定依赖、构建 VitePress，并使用 GitHub 官方 Pages Actions 发布 `docs/.vitepress/dist`。也可以在 GitHub 的 **Actions** 页面手动运行 **Deploy VitePress site to GitHub Pages**。

首次配置仓库时：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 推送 `main` 分支或手动运行工作流。
4. 在完成的部署任务中查看环境 URL，或按下方规则确认最终地址。

构建产物不会提交到 `main`；部署通过 Actions artifact 完成。

标记为 `draft: true` 的文章会从文章索引和生产静态产物中排除，适合存放尚未发布的内容。

## 网站地址与 base 配置

主题配置不会硬编码用户名。GitHub Actions 构建时会利用 `GITHUB_REPOSITORY` 和 `GITHUB_REPOSITORY_OWNER` 自动判断部署路径：

- 用户主页仓库：`<GITHUB_USERNAME>.github.io`，最终地址为 `https://<GITHUB_USERNAME>.github.io/`，VitePress `base` 为 `/`。
- 普通项目仓库：`<REPOSITORY_NAME>`，最终地址为 `https://<GITHUB_USERNAME>.github.io/<REPOSITORY_NAME>/`，VitePress `base` 为 `/<REPOSITORY_NAME>/`。

如需在本地模拟普通项目仓库路径，可临时设置 `VITEPRESS_BASE`：

```bash
VITEPRESS_BASE=/personal-blog/ pnpm build
```

PowerShell：

```powershell
$env:VITEPRESS_BASE = '/personal-blog/'
pnpm build
Remove-Item Env:VITEPRESS_BASE
```

## 常见问题排查

- **页面资源 404 或样式丢失**：先确认仓库类型与最终地址是否匹配；普通项目仓库必须使用 `/<REPOSITORY_NAME>/` 作为 `base`。本地可按上方命令模拟该路径后重新构建。
- **网站打不开或仍显示旧版本**：确认 Settings → Pages 的 Source 为 **GitHub Actions**，然后在仓库的 **Actions** 标签页打开最近一次部署。
- **构建失败**：在 **Actions → Deploy VitePress site to GitHub Pages → 对应运行记录 → build** 中查看完整安装与构建日志。常见原因包括 `pnpm-lock.yaml` 未同步、Markdown frontmatter 校验失败或 Node.js 版本不兼容。
- **部署失败**：在同一运行记录的 `deploy` 任务中查看日志，并确认仓库已允许 GitHub Actions 部署 Pages。
