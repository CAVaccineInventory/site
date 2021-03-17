import marked from "marked";
import sanitizeHtml from "sanitize-html";

const newTabLinkRenderer = {
  link(href, title, text) {
    // Logic adapted from https://github.com/markedjs/marked/issues/655#issuecomment-712380889
    const localLink = href.startsWith(`${location.protocol}//${location.hostname}`);
    const html = linkRenderer.call(renderer, href, title, text);
    if (localLink) {
      return html;
    }

    return html.replace(/^<a /, "<a target='_blank' rel='noreferrer noopener nofollow' ");
  },
};

function customMarked() {
  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);

    if (href.startsWith(`${location.protocol}//${location.hostname}`)) {
      return html;
    }

    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  marked.use({ renderer });

  return marked;
}

function markdownify(str) {
  return sanitizeHtml(customMarked()(str, newTabLinkRenderer));
}

function markdownifyInline(str) {
  return sanitizeHtml(customMarked().parseInline(str));
}

export { markdownify, markdownifyInline };
