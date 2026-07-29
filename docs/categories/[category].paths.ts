import { taxonomySlug } from '../.vitepress/utils/taxonomy';
import { loadTaxonomyRouteNames } from '../.vitepress/utils/contentRoutes';

export default {
  watch: ['../posts/**/*.md', '../posts.data.ts'],
  async paths() {
    const { categories } = await loadTaxonomyRouteNames();

    return categories.map((category) => ({ params: { category: taxonomySlug(category) } }));
  }
};
