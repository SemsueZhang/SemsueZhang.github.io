import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

type FrontmatterRecord = Record<string, unknown>;

export interface TaxonomyRouteNames {
  tags: string[];
  categories: string[];
}

const postsDirectory = fileURLToPath(new URL('../../posts', import.meta.url));

function asRecord(value: unknown): FrontmatterRecord | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as FrontmatterRecord
    : null;
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory()) {
      return collectMarkdownFiles(path);
    }

    return entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md'
      ? [path]
      : [];
  }));

  return files.flat();
}

export async function loadTaxonomyRouteNames(): Promise<TaxonomyRouteNames> {
  const tags = new Set<string>();
  const categories = new Set<string>();
  const files = await collectMarkdownFiles(postsDirectory);

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const frontmatter = asRecord(matter(source).data);

    if (!frontmatter || frontmatter.draft === true) {
      continue;
    }

    if (Array.isArray(frontmatter.tags)) {
      for (const tag of frontmatter.tags) {
        if (typeof tag === 'string' && tag.trim()) {
          tags.add(tag.trim());
        }
      }
    }

    if (typeof frontmatter.category === 'string' && frontmatter.category.trim()) {
      categories.add(frontmatter.category.trim());
    }
  }

  return {
    tags: [...tags].sort((left, right) => left.localeCompare(right, 'zh-CN')),
    categories: [...categories].sort((left, right) => left.localeCompare(right, 'zh-CN'))
  };
}

export async function loadDraftPostPaths(): Promise<string[]> {
  const files = await collectMarkdownFiles(postsDirectory);
  const draftPaths: string[] = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const frontmatter = asRecord(matter(source).data);

    if (frontmatter?.draft === true) {
      draftPaths.push(file.replace(`${postsDirectory}/`, 'posts/').replace(/\\/g, '/'));
    }
  }

  return draftPaths;
}
