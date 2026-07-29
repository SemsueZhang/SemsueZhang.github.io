import { createContentLoader } from 'vitepress';

export interface SearchRecord {
  url: string;
  title: string;
  description: string;
  keywords: string;
}

export interface SearchData {
  records: SearchRecord[];
}

export declare const data: SearchData;

type Frontmatter = Record<string, unknown>;

function getString(frontmatter: Frontmatter, key: string): string {
  const value = frontmatter[key];
  return typeof value === 'string' ? value.trim() : '';
}

function getStringArray(frontmatter: Frontmatter, key: string): string[] {
  const value = frontmatter[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim())
    : [];
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export default createContentLoader<SearchData>('**/*.md', {
  render: true,
  transform(entries) {
    const records = entries.flatMap((entry): SearchRecord[] => {
      const frontmatter = entry.frontmatter as Frontmatter;
      if (frontmatter.draft === true || entry.url.includes('/[')) return [];

      const title = getString(frontmatter, 'title');
      if (!title) return [];

      const body = plainText(entry.html ?? '');
      const description = getString(frontmatter, 'description') || body.slice(0, 160);
      const tags = getStringArray(frontmatter, 'tags');
      const category = getString(frontmatter, 'category');

      return [{
        url: entry.url,
        title,
        description,
        keywords: [title, description, category, ...tags, body].join(' ').toLocaleLowerCase('zh-CN')
      }];
    });

    return { records };
  }
});
