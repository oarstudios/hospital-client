import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

import { EditorImage } from "./contentImage";
import { CtaSliderNode, TextBox, YoutubeEmbed, hoistFullWidthBlocks } from "./blogBlocks";

/** Callbacks registered by <RichEditor> (and the latest onUpdate), looked up at call time. */
function createBridge() {
  const handlers = {};
  return {
    set: (name, fn) => {
      handlers[name] = fn;
    },
    call: (name, ...args) => handlers[name]?.(...args),
  };
}

/**
 * TipTap editor with the same features as the blog editor: content images with
 * SEO alt text, text boxes, YouTube embeds and site-wide CTA banners/sliders.
 * Render it with <RichEditor editor={editor} bridge={bridge} />.
 */
export default function useRichEditor({ placeholder = "Start writing…", onUpdate } = {}) {
  // Lets node views / click handlers reach <RichEditor>'s modals without re-creating the editor
  const [bridge] = useState(createBridge);
  useEffect(() => bridge.set("onUpdate", onUpdate), [bridge, onUpdate]);

  const editor = useEditor({
    extensions: [
      // StarterKit v3 bundles link, underline, dropcursor — the configured ones below replace them
      StarterKit.configure({ dropcursor: false, underline: false, link: false }),
      EditorImage,
      Highlight,
      Typography,
      Underline,
      Dropcursor,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CtaSliderNode.configure({ onEdit: (ids, pos) => bridge.call("editCta", ids, pos) }),
      TextBox,
      YoutubeEmbed,
      Placeholder.configure({ placeholder }),
    ],
    content: "",
    onUpdate({ editor }) {
      bridge.call("onUpdate", editor);
      // e.g. a YouTube link pasted inside a list → move the video out of it
      queueMicrotask(() => hoistFullWidthBlocks(editor));
    },
    editorProps: {
      handleClickOn(_view, _pos, node, nodePos) {
        if (node.type.name === "image") {
          bridge.call("editImage", { url: node.attrs.src, alt: node.attrs.alt || "", nodePos });
        }
        return false;
      },
    },
  });

  return { editor, bridge };
}

