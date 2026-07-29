import { createContentLoader } from 'vitepress';

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  category: string;
  draft: boolean;
  featured: boolean;
  layout: 'post';
}

export interface PostDate {
  value: string;
  timestamp: number;
  year: number;
  month: number;
  label: string;
}

export interface ArchiveMonth {
  month: number;
  label: string;
  posts: Post[];
}

export interface ArchiveYear {
  year: number;
  months: ArchiveMonth[];
}

export interface Post {
  url: string;
  frontmatter: ArticleFrontmatter;
  title: string;
  description: string;
  excerpt: string;
  date: PostDate;
  updated: PostDate;
  tags: string[];
  category: string;
  featured: boolean;
}

export interface PostsData {
  posts: Post[];
  latest: Post[];
  featured: Post[];
  byYear: Record<string, Post[]>;
  byTag: Record<string, Post[]>;
  byCategory: Record<string, Post[]>;
  archive: ArchiveYear[];
}

// VitePress 在导入 .data.ts 时提供该运行时导出；此声明供 TypeScript 使用。
export declare const data: PostsData;

type FrontmatterRecord = Record<string, unknown>;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const POSTS_INDEX_URL = '/posts/';

function invalidPost(source: string, message: string): never {
  throw new Error(`[posts.data] 文章 ${source}：${message}`);
}

function asRecord(value: unknown, source: string): FrontmatterRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return invalidPost(source, 'frontmatter 必须是对象。');
  }

  return value as FrontmatterRecord;
}

function requiredString(data: FrontmatterRecord, field: string, source: string): string {
  const value = data[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return invalidPost(source, `缺少必填字段或字段为空：${field}。`);
  }

  return value.trim();
}

function requiredBoolean(data: FrontmatterRecord, field: string, source: string): boolean {
  const value = data[field];
  if (typeof value !== 'boolean') {
    return invalidPost(source, `字段 ${field} 必须为 true 或 false。`);
  }

  return value;
}

function requiredDateValue(
  data: FrontmatterRecord,
  field: 'date' | 'updated',
  source: string
): string {
  const value = data[field];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return invalidPost(source, `缺少必填字段或字段格式错误：${field}。`);
}

function requiredTags(data: FrontmatterRecord, source: string): string[] {
  const value = data.tags;
  if (!Array.isArray(value) || value.length === 0) {
    return invalidPost(source, '字段 tags 必须是至少包含一个标签的数组。');
  }

  const tags = value.map((tag, index) => {
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      return invalidPost(source, `tags 的第 ${index + 1} 项必须是非空字符串。`);
    }

    return tag.trim();
  });

  return [...new Set(tags)];
}

function parseDate(value: string, field: 'date' | 'updated', source: string): PostDate {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    return invalidPost(source, `字段 ${field} 必须使用 YYYY-MM-DD 格式。`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return invalidPost(source, `字段 ${field} 不是有效日期：${value}。`);
  }

  return {
    value,
    timestamp,
    year,
    month,
    label: `${year} 年 ${month} 月 ${day} 日`
  };
}

function normalizePost(entry: {
  url: string;
  frontmatter: unknown;
  excerpt: string | undefined;
}): Post {
  const source = entry.url;
  const data = asRecord(entry.frontmatter, source);
  const date = parseDate(requiredDateValue(data, 'date', source), 'date', source);
  const updated = parseDate(requiredDateValue(data, 'updated', source), 'updated', source);

  if (updated.timestamp < date.timestamp) {
    return invalidPost(source, '字段 updated 不能早于 date。');
  }

  const layout = requiredString(data, 'layout', source);
  if (layout !== 'post') {
    return invalidPost(source, '字段 layout 必须为 post。');
  }

  const frontmatter: ArticleFrontmatter = {
    title: requiredString(data, 'title', source),
    description: requiredString(data, 'description', source),
    date: date.value,
    updated: updated.value,
    tags: requiredTags(data, source),
    category: requiredString(data, 'category', source),
    draft: requiredBoolean(data, 'draft', source),
    featured: requiredBoolean(data, 'featured', source),
    layout
  };

  return {
    url: entry.url,
    frontmatter,
    title: frontmatter.title,
    description: frontmatter.description,
    excerpt: entry.excerpt?.trim() || frontmatter.description,
    date,
    updated,
    tags: frontmatter.tags,
    category: frontmatter.category,
    featured: frontmatter.featured
  };
}

function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((left, right) => right.date.timestamp - left.date.timestamp);
}

function groupPosts(posts: Post[], getKeys: (post: Post) => string[]): Record<string, Post[]> {
  const groups: Record<string, Post[]> = {};

  for (const post of posts) {
    for (const key of getKeys(post)) {
      groups[key] ??= [];
      groups[key].push(post);
    }
  }

  for (const key of Object.keys(groups)) {
    groups[key] = sortPosts(groups[key]);
  }

  return groups;
}

function createArchive(posts: Post[]): ArchiveYear[] {
  const years = new Map<number, Map<number, Post[]>>();

  for (const post of posts) {
    const year = post.date.year;
    const month = post.date.month;
    const months = years.get(year) ?? new Map<number, Post[]>();
    const monthPosts = months.get(month) ?? [];

    monthPosts.push(post);
    months.set(month, monthPosts);
    years.set(year, months);
  }

  return [...years.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([left], [right]) => right - left)
        .map(([month, monthPosts]) => ({
          month,
          label: `${month} 月`,
          posts: sortPosts(monthPosts)
        }))
    }));
}

export default createContentLoader<PostsData>('posts/**/*.md', {
  excerpt: true,
  transform(entries) {
    const posts = sortPosts(
      entries
        .filter((entry) => entry.url !== POSTS_INDEX_URL)
        .map((entry) => normalizePost(entry))
        .filter((post) => !post.frontmatter.draft)
    );

    return {
      posts,
      latest: posts.slice(0, 6),
      featured: posts.filter((post) => post.featured),
      byYear: groupPosts(posts, (post) => [String(post.date.year)]),
      byTag: groupPosts(posts, (post) => post.tags),
      byCategory: groupPosts(posts, (post) => [post.category]),
      archive: createArchive(posts)
    };
  }
});
