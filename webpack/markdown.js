import marked from "marked";
import sanitizeHtml from "sanitize-html";

function markdownify(str) {
  return sanitizeHtml(marked(str));
}

function markdownifyInline(str) {
  return sanitizeHtml(marked.parseInline(str));
}

export { markdownify, markdownifyInline };
