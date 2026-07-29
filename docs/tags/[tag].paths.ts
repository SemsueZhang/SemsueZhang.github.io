import { taxonomySlug } from '../.vitepress/utils/taxonomy';
import { loadTaxonomyRouteNames } from '../.vitepress/utils/contentRoutes';

export default {
  watch: ['../posts/**/*.md', '../posts.data.ts'],
  async paths() {
    const { tags } = await loadTaxonomyRouteNames();

    return tags.map((tag) => ({ params: { tag: taxonomySlug(tag) } }));
  }
};
