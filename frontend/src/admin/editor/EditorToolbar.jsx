import { createElement } from "react";
import { useEditorState } from "@tiptap/react";
import {
  LuUndo2,
  LuRedo2,
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuHighlighter,
  LuHeading1,
  LuHeading2,
  LuPilcrow,
  LuList,
  LuListOrdered,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuLink,
  LuImagePlus,
  LuYoutube,
  LuMessageSquareQuote,
  LuMegaphone,
  LuLoaderCircle,
} from "react-icons/lu";
import "./EditorToolbar.css";

const ToolButton = ({ icon, label, shortcut, active, disabled, loading, onClick, showLabel }) => (
  <button
    type="button"
    className={`tb-btn${active ? " is-active" : ""}${showLabel ? " tb-btn--labelled" : ""}${loading ? " is-loading" : ""}`}
    title={shortcut ? `${label} (${shortcut})` : label}
    aria-label={label}
    aria-pressed={active === undefined ? undefined : active}
    disabled={disabled}
    // keep the editor selection while clicking toolbar buttons
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
  >
    {createElement(icon, { "aria-hidden": true })}
    {showLabel && <span>{label}</span>}
  </button>
);

const Divider = () => <span className="tb-divider" aria-hidden="true" />;

/**
 * Blog editor toolbar: icon buttons with tooltips, grouped, showing which
 * formatting is active at the cursor.
 */
const EditorToolbar = ({
  editor,
  onLink,
  onImage,
  imageUploading = false,
  onYoutube,
  onCta,
}) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      highlight: e.isActive("highlight"),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      paragraph: e.isActive("paragraph"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      alignLeft: e.isActive({ textAlign: "left" }),
      alignCenter: e.isActive({ textAlign: "center" }),
      alignRight: e.isActive({ textAlign: "right" }),
      link: e.isActive("link"),
      textBox: e.isActive("textBox"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const run = (fn) => () => fn(editor.chain().focus()).run();

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
      <div className="tb-group">
        <ToolButton icon={LuUndo2} label="Undo" shortcut="Ctrl+Z" disabled={!state.canUndo} onClick={run((c) => c.undo())} />
        <ToolButton icon={LuRedo2} label="Redo" shortcut="Ctrl+Y" disabled={!state.canRedo} onClick={run((c) => c.redo())} />
      </div>

      <Divider />

      <div className="tb-group">
        <ToolButton icon={LuBold} label="Bold" shortcut="Ctrl+B" active={state.bold} onClick={run((c) => c.toggleBold())} />
        <ToolButton icon={LuItalic} label="Italic" shortcut="Ctrl+I" active={state.italic} onClick={run((c) => c.toggleItalic())} />
        <ToolButton icon={LuUnderline} label="Underline" shortcut="Ctrl+U" active={state.underline} onClick={run((c) => c.toggleUnderline())} />
        <ToolButton icon={LuStrikethrough} label="Strikethrough" active={state.strike} onClick={run((c) => c.toggleStrike())} />
        <ToolButton icon={LuHighlighter} label="Highlight" active={state.highlight} onClick={run((c) => c.toggleHighlight())} />
      </div>

      <Divider />

      <div className="tb-group">
        <ToolButton icon={LuHeading1} label="Heading 1" active={state.h1} onClick={run((c) => c.toggleHeading({ level: 1 }))} />
        <ToolButton icon={LuHeading2} label="Heading 2" active={state.h2} onClick={run((c) => c.toggleHeading({ level: 2 }))} />
        <ToolButton icon={LuPilcrow} label="Paragraph" active={state.paragraph && !state.h1 && !state.h2} onClick={run((c) => c.setParagraph())} />
      </div>

      <Divider />

      <div className="tb-group">
        <ToolButton icon={LuList} label="Bullet list" active={state.bulletList} onClick={run((c) => c.toggleBulletList())} />
        <ToolButton icon={LuListOrdered} label="Numbered list" active={state.orderedList} onClick={run((c) => c.toggleOrderedList())} />
      </div>

      <Divider />

      <div className="tb-group">
        <ToolButton icon={LuAlignLeft} label="Align left" active={state.alignLeft} onClick={run((c) => c.setTextAlign("left"))} />
        <ToolButton icon={LuAlignCenter} label="Align center" active={state.alignCenter} onClick={run((c) => c.setTextAlign("center"))} />
        <ToolButton icon={LuAlignRight} label="Align right" active={state.alignRight} onClick={run((c) => c.setTextAlign("right"))} />
      </div>

      <Divider />

      <div className="tb-group tb-group--insert">
        <ToolButton icon={LuLink} label="Link" showLabel active={state.link} onClick={onLink} />
        <ToolButton
          icon={imageUploading ? LuLoaderCircle : LuImagePlus}
          label={imageUploading ? "Uploading…" : "Image"}
          showLabel
          disabled={imageUploading}
          loading={imageUploading}
          onClick={onImage}
        />
        <ToolButton icon={LuYoutube} label="YouTube" showLabel onClick={onYoutube} />
        <ToolButton
          icon={LuMessageSquareQuote}
          label="Text box"
          showLabel
          active={state.textBox}
          onClick={run((c) => c.insertTextBox())}
        />
        <ToolButton icon={LuMegaphone} label="CTA" showLabel onClick={onCta} />
      </div>
    </div>
  );
};

export default EditorToolbar;
