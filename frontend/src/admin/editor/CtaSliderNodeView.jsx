import { NodeViewWrapper } from "@tiptap/react";
import CtaSlider from "../../components/Common/CtaSlider";
import { useGlobalCtas, pickCtas } from "../../components/Common/globalCtas";

/** Editor rendering of a ctaSlider node: live preview + edit/remove controls. */
const CtaSliderNodeView = ({ node, getPos, extension, selected, deleteNode }) => {
  const { ctas: allCtas, loading } = useGlobalCtas();
  const ids = Array.isArray(node.attrs.ctaIds) ? node.attrs.ctaIds : [];
  const ctas = pickCtas(allCtas, ids);
  const missing = loading ? 0 : ids.length - ctas.length;

  const edit = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos != null) extension.options.onEdit?.(ids, pos);
  };

  let label = "CTA";
  if (ctas.length > 1) label = `CTA slider · ${ctas.length} CTAs`;

  return (
    <NodeViewWrapper
      className={`editor-cta-node${selected ? " is-selected" : ""}`}
      data-drag-handle
    >
      <div className="editor-cta-node__bar" contentEditable={false}>
        <span className="editor-cta-node__label">{label}</span>
        <div className="editor-cta-node__actions">
          <button type="button" onClick={edit}>Change CTAs</button>
          <button type="button" className="danger" onClick={deleteNode}>Remove</button>
        </div>
      </div>

      {loading && <div className="editor-cta-node__empty">Loading CTAs…</div>}

      {!loading && ctas.length > 0 && <CtaSlider ctas={ctas} preview autoPlay={false} />}

      {!loading && ctas.length === 0 && (
        <div className="editor-cta-node__empty">
          The CTA{ids.length > 1 ? "s" : ""} in this block {ids.length > 1 ? "were" : "was"} deleted
          from Others. It won't show on the website — change or remove this block.
        </div>
      )}

      {!loading && ctas.length > 0 && missing > 0 && (
        <p className="editor-cta-node__warn">
          {missing} CTA{missing > 1 ? "s" : ""} in this block {missing > 1 ? "were" : "was"} deleted
          from Others and won't be shown.
        </p>
      )}
    </NodeViewWrapper>
  );
};

export default CtaSliderNodeView;
