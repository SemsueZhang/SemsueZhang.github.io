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
