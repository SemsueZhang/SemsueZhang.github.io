import { defineConfig } from 'vitepress';
import { loadDraftPostPaths } from './utils/contentRoutes';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserPagesRepository = Boolean(
  repositoryName &&
  repositoryOwner &&
  repositoryName.toLowerCase() === `${repositoryOwner}.github.io`.toLowerCase()
);
const detectedBase = repositoryName && repositoryOwner && !isUserPagesRepository
  ? `/${repositoryName}/`
  : '/';
const base = process.env.VITEPRESS_BASE ?? detectedBase;
const draftPostPaths = await loadDraftPostPaths();

export default defineConfig({
  lang: 'zh-CN',
  title: "Zhang Chenrui's Blog",
  description: '',
  base,
  srcExclude: draftPostPaths,
  cleanUrls: true,
  markdown: {
    math: true,
    headers: {
      level: [2, 3]
    }
  },
  head: [
    ['meta', { name: 'author', content: 'Zhang Chenrui' }],
    ['meta', { name: 'theme-color', content: '#4d6f75' }],
    [
      'script',
      {},
      `(function () {
        try {
          var saved = localStorage.getItem('theme');
          var mode = saved === 'light' || saved === 'dark'
            ? saved
            : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.classList.add(mode);
          document.documentElement.dataset.theme = mode;
        } catch (error) {}
      })();`
    ]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '分类', link: '/categories/' },
      { text: '归档', link: '/archive/' },
      { text: '关于', link: '/about' }
    ]
  }
});
