import type { MarkdownRenderer } from 'vitepress';

export function pdfEmbedPlugin(md: MarkdownRenderer): void {
  md.inline.ruler.before('image', 'pdf_embed', (state, silent) => {
    const start = state.pos;
    if (state.src.slice(start, start + 2) !== '@[') return false;
    if ('linkLevel' in state && Number(state.linkLevel) > 0) return false;

    const labelEnd = md.helpers.parseLinkLabel(state, start + 1, false);
    if (labelEnd < 0 || state.src[labelEnd + 1] !== '(') return false;

    let pos = labelEnd + 2;
    while (pos < state.posMax && /[ \t\n]/.test(state.src[pos])) pos++;

    const destination = md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (!destination.ok || !destination.str) return false;

    const src = md.normalizeLink(destination.str);
    if (!md.validateLink(src) || (/^[a-z][\w+.-]*:/i.test(src) && !/^https?:/i.test(src))) {
      return false;
    }

    pos = destination.pos;
    while (pos < state.posMax && /[ \t\n]/.test(state.src[pos])) pos++;
    if (state.src[pos] !== ')') return false;

    if (!silent) {
      const token = state.push('pdf_embed', '', 0);
      token.attrSet('src', src);
      token.content = md.utils.unescapeAll(state.src.slice(start + 2, labelEnd)).trim();
    }

    state.pos = pos + 1;
    return true;
  });

  md.renderer.rules.pdf_embed = (tokens, index) => {
    const token = tokens[index];
    let src = token.attrGet('src') ?? '';

    if (!/^(?:https?:)?\/\//i.test(src)) {
      // Match Markdown image paths so Vite can bundle relative PDF files.
      const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(src)!;
      src = decodeURIComponent(pathname) + suffix;
      if (!/^(?:\/|\.\.?\/)/.test(src)) src = `./${src}`;
    }

    const title = md.utils.escapeHtml(token.content || 'PDF 文档');
    return `<PdfEmbed src="${md.utils.escapeHtml(src)}" title="${title}" />`;
  };
}
