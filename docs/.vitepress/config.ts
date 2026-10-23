import { defineConfig } from 'vitepress';
import { loadDraftPostPaths, loadDraftTodoPaths } from './utils/contentRoutes';
import { pdfEmbedPlugin } from './utils/pdfEmbed';

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
const draftPaths = (await Promise.all([loadDraftPostPaths(), loadDraftTodoPaths()])).flat();
const wallpapers = ['lake', 'forest', 'coast', 'snow'].map(
  (name) => `${base.replace(/\/?$/, '/')}images/landscape-${name}.png`
);

export default defineConfig({
  lang: 'zh-CN',
  title: "Zhang Chenrui's Blog",
  description: '',
  base,
  srcExclude: draftPaths,
  cleanUrls: true,
  markdown: {
    math: true,
    config(md) {
      md.use(pdfEmbedPlugin);
    },
    headers: {
      level: [2, 3]
    }
  },
  vue: {
    template: {
      transformAssetUrls: {
        tags: {
          // Preserve Vue's standard asset handling alongside PDF attachments.
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href'],
          PdfEmbed: ['src']
        }
      }
    }
  },
  vite: {
    build: {
      assetsInlineLimit(file) {
        // Keep even small PDFs as files so opening them in a new tab works.
        if (/\.pdf$/i.test(file)) return false;
      }
    }
  },
  head: [
    ['meta', { name: 'author', content: 'Zhang Chenrui' }],
    ['meta', { name: 'theme-color', content: '#0d1117' }],
    ['style', {}, `:root { --site-wallpaper: url(${JSON.stringify(wallpapers[0])}); }`],
    [
      'script',
      {},
      // Choose once before first paint; the root variable persists across SPA navigation.
      `(function () {
        var wallpapers = ${JSON.stringify(wallpapers)};
        var wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
        document.documentElement.style.setProperty('--site-wallpaper', 'url(' + JSON.stringify(wallpaper) + ')');
      })();`
    ],
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
      { text: '计划', link: '/todo/' },
      { text: '标签', link: '/tags/' },
      { text: '分类', link: '/categories/' },
      { text: '归档', link: '/archive/' },
      { text: 'CV', link: '/cv/' },
      { text: '关于', link: '/about' }
    ]
  }
});
