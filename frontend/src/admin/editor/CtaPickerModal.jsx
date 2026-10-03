import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CtaSlider from "../../components/Common/CtaSlider";
import { pickCtas } from "../../components/Common/globalCtas";
import "./CtaPickerModal.css";

/**
 * Pick one or more site-wide CTAs to place in the blog.
 * One selected → single banner, several → slider (in the order they were ticked).
 *
 * Mount only while open so the selection starts fresh from `initialSelected`.
 */
export default function CtaPickerModal({
  mode = "insert",
  ctas = [],
  loading = false,
  initialSelected = [],
  onConfirm,
  onCancel,
}) {
  // Ids of deleted CTAs may still be in initialSelected; they're dropped
  // below once the list is known (pickCtas / existing filter).
  const [picked, setPicked] = useState(initialSelected);
  const selected = loading ? picked : picked.filter((id) => ctas.some((c) => c.id === id));

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  const toggle = (id) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const isEdit = mode === "edit";
  let confirmLabel = isEdit ? "Update" : "Insert";
  if (selected.length === 1) confirmLabel += " CTA";
  if (selected.length > 1) confirmLabel += ` slider (${selected.length} CTAs)`;

  const previewCtas = pickCtas(ctas, selected);

  return (
    <div className="cta-picker-overlay" onClick={onCancel}>
      <div
        className="cta-picker-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-picker-title"
      >
        <h3 id="cta-picker-title">{isEdit ? "Change CTAs" : "Insert CTA"}</h3>
        <p className="cta-picker-subtitle">
          Select one CTA for a banner, or several to show them as a slider.
          CTAs are managed under <strong>Others</strong> in the sidebar.
        </p>

        {loading && <p className="cta-picker-empty">Loading CTAs…</p>}

        {!loading && ctas.length === 0 && (
          <div className="cta-picker-empty">
            <p>No CTAs have been created yet.</p>
            <Link to="/ctrl/others" target="_blank" rel="noopener">
              Create CTAs in Others ↗
            </Link>
          </div>
        )}

        {!loading && ctas.length > 0 && (
          <ul className="cta-picker-list">
            {ctas.map((cta) => {
              const order = selected.indexOf(cta.id);
              const checked = order !== -1;
              return (
                <li key={cta.id}>
                  <label className={`cta-picker-item${checked ? " is-checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(cta.id)}
                    />
                    <span className="cta-picker-order" aria-hidden="true">
                      {checked ? order + 1 : ""}
                    </span>
                    <span className="cta-picker-body">
                      <span className="cta-picker-text">{cta.text}</span>
                      <span className="cta-picker-meta">
                        <span className="cta-picker-btn">{cta.buttonText}</span>
                        <span className="cta-picker-link">→ {cta.link}</span>
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {previewCtas.length > 0 && (
          <div className="cta-picker-preview">
            <span className="cta-picker-preview-label">Preview</span>
            <CtaSlider ctas={previewCtas} preview />
          </div>
        )}

        <div className="cta-picker-actions">
          <button type="button" className="cta-picker-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="cta-picker-confirm"
            disabled={loading || selected.length === 0}
            onClick={() => onConfirm(selected)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
