import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import PdfEmbed from './components/PdfEmbed.vue';
import './styles/theme.css';
import './styles/base.css';

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('PdfEmbed', PdfEmbed);
  }
} satisfies Theme;
