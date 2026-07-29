export type TaxonomyKind = 'tag' | 'category';

export function taxonomySlug(name: string): string {
  return encodeURIComponent(name).replace(/~/g, '%7E').replace(/%/g, '~');
}

export function decodeTaxonomySlug(slug: string): string {
  try {
    return decodeURIComponent(slug.replace(/~/g, '%'));
  } catch {
    return '';
  }
}

export function taxonomyPath(kind: TaxonomyKind, name: string): string {
  const section = kind === 'tag' ? 'tags' : 'categories';
  return `/${section}/${taxonomySlug(name)}`;
}
