import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

/** TipTap image node with alt persisted in JSON/HTML for SEO + accessibility. */
export const EditorImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const alt = HTMLAttributes.alt;
    const hasAlt = Boolean(alt && String(alt).trim());

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: hasAlt
          ? "editor-content-image"
          : "editor-content-image editor-content-image--missing-alt",
        title: hasAlt
          ? "Click to edit SEO alt text"
          : "Click to add SEO alt text",
      }),
    ];
  },
});

export function insertContentImage(editor, url, alt = "") {
  if (!editor || !url) return;
  editor.chain().focus().setImage({ src: url, alt: alt || null }).run();
}

export function insertContentImages(editor, images = []) {
  if (!editor || images.length === 0) return;
  images.forEach(({ url, alt }) => {
    if (url) insertContentImage(editor, url, alt);
  });
}

export function updateSelectedImageAlt(editor, alt) {
  if (!editor?.isActive("image")) return false;
  editor.chain().focus().updateAttributes("image", { alt: alt.trim() || null }).run();
  return true;
}

export function updateImageAltAtPos(editor, nodePos, alt, src) {
  if (!editor) return false;

  const nextAlt = alt.trim() || null;
  const { state } = editor;

  let pos = nodePos;
  let node = pos != null ? state.doc.nodeAt(pos) : null;

  if (!node || node.type.name !== "image") {
    let foundPos = null;
    state.doc.descendants((candidate, candidatePos) => {
      if (
        candidate.type.name === "image"
        && (!src || candidate.attrs.src === src)
        && foundPos == null
      ) {
        foundPos = candidatePos;
      }
    });
    if (foundPos == null) return false;
    pos = foundPos;
    node = state.doc.nodeAt(pos);
  }

  if (!node || node.type.name !== "image") return false;

  const tr = state.tr.setNodeMarkup(pos, undefined, {
    ...node.attrs,
    alt: nextAlt,
  });

  editor.view.dispatch(tr);
  return true;
}

export function getSelectedImageAlt(editor) {
  if (!editor?.isActive("image")) return "";
  return editor.getAttributes("image")?.alt || "";
}
