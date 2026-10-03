import { Node, mergeAttributes, nodePasteRule, InputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import CtaSliderNodeView from "./CtaSliderNodeView";
import "./blogBlocks.css";

/* ── YouTube helpers ────────────────────────────────────────────────────── */

const YOUTUBE_URL_REGEX =
  /https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?\S*?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]{11}\S*/g;

const VIDEO_ID_REGEX = /^[\w-]{11}$/;

/** Returns the 11-char video id for any common YouTube URL, or null. */
export function getYoutubeId(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(String(url).trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id = null;

  if (host === "youtu.be") {
    id = parsed.pathname.split("/")[1];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else {
      const [, kind, value] = parsed.pathname.split("/");
      if (["shorts", "embed", "live"].includes(kind)) id = value;
    }
  }

  return id && VIDEO_ID_REGEX.test(id) ? id : null;
}

/* ── Full-width blocks ──────────────────────────────────────────────────────
 * CTA sliders and videos must span the full content width. The schema would
 * let them nest inside list items / text boxes (and pick up their indent), so
 * they are always inserted at the top level, and nested ones can be hoisted.
 * ─────────────────────────────────────────────────────────────────────────── */
const FULL_WIDTH_BLOCKS = new Set(["ctaSlider", "youtube"]);

/** Position right after the top-level block containing the selection. */
function topLevelInsertPos(selection) {
  const { $from } = selection;
  if ($from.depth === 0) return selection.to; // node selection of a top-level block
  return $from.after(1);
}

/** Inserts a full-width node after the current top-level block. */
function insertFullWidth(type, attrs) {
  return ({ state, tr, dispatch }) => {
    if (dispatch) {
      const pos = topLevelInsertPos(state.selection);
      tr.insert(pos, type.create(attrs));
    }
    return true;
  };
}

/**
 * Moves CTA sliders / videos that ended up inside a list, text box etc. to
 * just after their top-level block. Returns true if anything moved.
 */
export function hoistFullWidthBlocks(editor) {
  if (!editor || editor.isDestroyed) return false;
  const { state } = editor;
  const nested = [];

  state.doc.descendants((node, pos) => {
    if (!FULL_WIDTH_BLOCKS.has(node.type.name)) return true;
    const $pos = state.doc.resolve(pos);
    if ($pos.depth > 0) nested.push({ node, pos, after: $pos.after(1) });
    return false;
  });
  if (!nested.length) return false;

  const tr = state.tr;
  // Last first, mapping through earlier steps; assoc -1 keeps original order
  // when several nodes move out of the same top-level block.
  nested.reverse().forEach(({ node, pos, after }) => {
    const from = tr.mapping.map(pos);
    tr.delete(from, from + node.nodeSize);
    tr.insert(tr.mapping.map(after, -1), node);
  });
  tr.setMeta("addToHistory", false);
  editor.view.dispatch(tr);
  return true;
}

/* ── CTA banner / slider ────────────────────────────────────────────────────
 * CTAs are site-wide (Admin → Others). The node only stores the ids of the
 * CTAs it shows, so editing a CTA in Others updates every blog using it and
 * deleting one removes it everywhere. One id → banner, several → slider.
 * The public page fills the placeholder <div> with <CtaSlider> (BlogContent).
 * ─────────────────────────────────────────────────────────────────────────── */
const parseIds = (value) =>
  String(value || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

export const CtaSliderNode = Node.create({
  name: "ctaSlider",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      // (ctaIds, pos) => void — open the CTA picker to change this block
      onEdit: null,
    };
  },

  addAttributes() {
    return {
      ctaIds: {
        default: [],
        parseHTML: (el) => parseIds(el.getAttribute("data-cta-ids")),
        renderHTML: (attrs) => ({
          "data-cta-ids": (Array.isArray(attrs.ctaIds) ? attrs.ctaIds : []).join(","),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="cta-slider"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "cta-slider", class: "blog-cta-slot" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CtaSliderNodeView);
  },

  addCommands() {
    return {
      insertCtaSlider:
        (ctaIds) =>
        (props) =>
          ctaIds?.length
            ? insertFullWidth(this.type, { ctaIds: [...ctaIds] })(props)
            : false,
      updateCtaSliderAt:
        (pos, ctaIds) =>
        ({ tr, state, dispatch }) => {
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== this.name) return false;
          if (dispatch) {
            if (ctaIds?.length) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, ctaIds: [...ctaIds] });
            } else {
              tr.delete(pos, pos + node.nodeSize);
            }
          }
          return true;
        },
    };
  },
});

/* ── Text box ───────────────────────────────────────────────────────────────
 * Bordered box holding any rich text — quotes, "Expert Insight", notes.
 * Press Enter twice on an empty line inside it to continue below the box.
 * ─────────────────────────────────────────────────────────────────────────── */
export const TextBox = Node.create({
  name: "textBox",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="text-box"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "text-box", class: "blog-textbox" }),
      0,
    ];
  },

  addCommands() {
    return {
      insertTextBox:
        () =>
        ({ state, commands }) => {
          // Wrap the selected blocks if text is selected, otherwise add an empty box.
          if (!state.selection.empty && commands.wrapIn(this.name)) return true;
          return commands.insertContent({
            type: this.name,
            content: [{ type: "paragraph" }],
          });
        },
    };
  },
});

/* ── YouTube embed ──────────────────────────────────────────────────────────
 * Pasting a YouTube link (or typing one and pressing space) turns it into an
 * embedded player that shows the thumbnail and plays in place.
 * ─────────────────────────────────────────────────────────────────────────── */
export const YoutubeEmbed = Node.create({
  name: "youtube",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  // Run before Link so pasted YouTube URLs become players, not plain links.
  priority: 1000,

  addAttributes() {
    return {
      videoId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-video-id"),
        renderHTML: (attrs) => ({ "data-video-id": attrs.videoId }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="youtube"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const id = VIDEO_ID_REGEX.test(node.attrs.videoId || "") ? node.attrs.videoId : "";
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "youtube", class: "blog-video" }),
      [
        "iframe",
        {
          src: `https://www.youtube.com/embed/${id}`,
          title: "YouTube video player",
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: "true",
          loading: "lazy",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (url) =>
        (props) => {
          const videoId = getYoutubeId(url);
          if (!videoId) return false;
          return insertFullWidth(this.type, { videoId })(props);
        },
    };
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: YOUTUBE_URL_REGEX,
        type: this.type,
        getAttributes: (match) => ({ videoId: getYoutubeId(match[0]) }),
      }),
    ];
  },

  addInputRules() {
    const type = this.type;
    return [
      new InputRule({
        find: /(?:^|\s)(https?:\/\/\S+)\s$/,
        handler: ({ state, range, match }) => {
          const videoId = getYoutubeId(match[1]);
          if (!videoId) return null;
          const start = range.from + match[0].indexOf(match[1]);
          state.tr.replaceWith(start, range.to, type.create({ videoId }));
        },
      }),
    ];
  },
});

/** All custom blog blocks — register in both the editor and generateHTML. */
export const BLOG_BLOCKS = [CtaSliderNode, TextBox, YoutubeEmbed];
