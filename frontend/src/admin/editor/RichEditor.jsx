import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { EditorContent } from "@tiptap/react";
import { LuLink, LuYoutube } from "react-icons/lu";

import axiosInstance from "../../app/axiosinstance";
import { showToast } from "../../redux/toast/toastSlice";
import { loadGlobalCtas, useGlobalCtas } from "../../components/Common/globalCtas";
import { insertContentImages, updateImageAltAtPos } from "./contentImage";
import ContentImageAltModal from "./ContentImageAltModal";
import { getYoutubeId } from "./blogBlocks";
import CtaPickerModal from "./CtaPickerModal";
import EditorToolbar from "./EditorToolbar";
import UrlInputModal from "./UrlInputModal";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const previewSrc = (path) => (!path || path.startsWith("http") ? path || "" : `${API_BASE}${path}`);

/** "example.com" → "https://example.com"; keeps /paths, #anchors, mailto:, tel:. */
const normalizeLinkHref = (url) => {
  const value = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith("/") || value.startsWith("#")) {
    return value;
  }
  return `https://${value}`;
};

const validateLink = (url) => {
  if (/^\s*(javascript|data|vbscript):/i.test(url)) return "This kind of link isn't allowed.";
  if (/\s/.test(url.trim())) return "A link can't contain spaces.";
  return "";
};

const validateYoutube = (url) =>
  getYoutubeId(url)
    ? ""
    : "Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…";

/**
 * Toolbar + editor + the link / YouTube / CTA / image-alt popups — the same
 * editing experience as the blog editor. Create `editor` and `bridge` with
 * useRichEditor().
 */
const RichEditor = ({ editor, bridge, uploadPath }) => {
  const dispatch = useDispatch();
  const [imageUploading, setImageUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [imageAltMode, setImageAltMode] = useState(null); // "insert" | "edit" | null
  const editingImagePos = useRef(null);
  const [urlModal, setUrlModal] = useState(null); // { kind: "link" | "youtube", initial }
  const [ctaPicker, setCtaPicker] = useState(null); // { mode, ids, pos }
  const { ctas: globalCtas, loading: globalCtasLoading } = useGlobalCtas();

  useEffect(() => {
    bridge.set("editImage", ({ url, alt, nodePos }) => {
      editingImagePos.current = nodePos;
      setPendingImages([{ url, alt, previewUrl: previewSrc(url) }]);
      setImageAltMode("edit");
    });
    bridge.set("editCta", (ids, pos) => setCtaPicker({ mode: "edit", ids, pos }));
  }, [bridge]);

  if (!editor) return null;

  /* images — uploaded straight away so the content always holds real URLs */
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      setImageUploading(true);
      try {
        const uploaded = await Promise.all(
          files.map(async (file) => {
            const form = new FormData();
            form.append("file", file);
            const res = await axiosInstance.post(uploadPath, form, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            const url = res.data?.data?.url || res.data?.url;
            return url ? { url, alt: "", previewUrl: previewSrc(url) } : null;
          }),
        );
        const ready = uploaded.filter(Boolean);
        if (ready.length) {
          setPendingImages(ready);
          setImageAltMode("insert");
        }
      } catch {
        dispatch(showToast.error("Image upload failed. Please try again."));
      } finally {
        setImageUploading(false);
      }
    };
    input.click();
  };

  const closeImageAlt = () => {
    setImageAltMode(null);
    setPendingImages([]);
    editingImagePos.current = null;
  };

  const confirmImageAlt = (images = pendingImages) => {
    if (imageAltMode === "edit") {
      const saved = updateImageAltAtPos(editor, editingImagePos.current, images[0]?.alt || "", images[0]?.url);
      if (!saved) {
        dispatch(showToast.error("Could not update image alt text. Click the image and try again."));
        return;
      }
    } else {
      insertContentImages(editor, images.map(({ url, alt }) => ({ url, alt: alt.trim() })));
    }
    closeImageAlt();
  };

  /* CTAs are site-wide (Admin → Others); the editor stores only their ids */
  const openCtaPicker = () => {
    loadGlobalCtas({ force: true });
    setCtaPicker({ mode: "insert", ids: [], pos: null });
  };

  const confirmCtaPicker = (ids) => {
    if (ctaPicker?.mode === "edit" && ctaPicker.pos != null) {
      editor.chain().focus().updateCtaSliderAt(ctaPicker.pos, ids).run();
    } else {
      editor.chain().focus().insertCtaSlider(ids).run();
    }
    setCtaPicker(null);
  };

  /* links */
  const confirmLink = (url) => {
    const href = normalizeLinkHref(url);
    if (editor.state.selection.empty && !editor.isActive("link")) {
      // Nothing selected: insert the URL itself as linked text
      editor.chain().focus()
        .insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href } }] })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setUrlModal(null);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setUrlModal(null);
  };

  return (
    <>
      <div className="editor-section">
        <EditorToolbar
          editor={editor}
          onLink={() => setUrlModal({ kind: "link", initial: editor.getAttributes("link").href || "" })}
          onImage={addImage}
          imageUploading={imageUploading}
          onYoutube={() => setUrlModal({ kind: "youtube", initial: "" })}
          onCta={openCtaPicker}
        />

        <p className="editor-image-hint">
          <span className="editor-image-hint-icon" aria-hidden="true">ⓘ</span>
          Click any image in the editor to add or edit SEO alt text.
          Images without alt are highlighted in orange.
          Paste a YouTube link to embed the video. Inside a text box, press Enter twice to continue below it.
          Insert CTA places one CTA, or a slider if you pick several (CTAs are managed in Others).
        </p>

        <EditorContent editor={editor} className="notion-editor" />
      </div>

      {urlModal?.kind === "youtube" && (
        <UrlInputModal
          title="Embed YouTube video"
          description="Paste the link of a YouTube video. It will play right inside the page."
          label="YouTube link"
          placeholder="https://www.youtube.com/watch?v=…"
          confirmLabel="Embed video"
          icon={<LuYoutube />}
          validate={validateYoutube}
          renderPreview={(url) => (
            <span className="url-modal-yt">
              <img src={`https://img.youtube.com/vi/${getYoutubeId(url)}/hqdefault.jpg`} alt="Video thumbnail" />
              <span className="url-modal-yt-play" aria-hidden="true" />
            </span>
          )}
          onConfirm={(url) => {
            editor.chain().focus().setYoutubeVideo(url).run();
            setUrlModal(null);
          }}
          onCancel={() => setUrlModal(null)}
        />
      )}

      {urlModal?.kind === "link" && (
        <UrlInputModal
          title={urlModal.initial ? "Edit link" : "Add link"}
          description={
            editor.state.selection.empty && !urlModal.initial
              ? "No text is selected, so the link itself will be inserted. Select text first to link it instead."
              : "The selected text will link to this address."
          }
          label="Link address"
          placeholder="https://example.com or /BookAppoinment"
          initialValue={urlModal.initial}
          confirmLabel={urlModal.initial ? "Update link" : "Add link"}
          icon={<LuLink />}
          validate={validateLink}
          onConfirm={confirmLink}
          onCancel={() => setUrlModal(null)}
          onRemove={urlModal.initial ? removeLink : undefined}
          removeLabel="Remove link"
        />
      )}

      {ctaPicker && (
        <CtaPickerModal
          mode={ctaPicker.mode}
          ctas={globalCtas}
          loading={globalCtasLoading}
          initialSelected={ctaPicker.ids}
          onConfirm={confirmCtaPicker}
          onCancel={() => setCtaPicker(null)}
        />
      )}

      <ContentImageAltModal
        open={Boolean(imageAltMode)}
        mode={imageAltMode || "insert"}
        images={pendingImages}
        onConfirm={confirmImageAlt}
        onCancel={closeImageAlt}
        saving={false}
      />
    </>
  );
};

export default RichEditor;
