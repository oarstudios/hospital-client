import { useEffect, useRef, useState } from "react";
import "./ContentImageAltModal.css";

export default function ContentImageAltModal({
  open,
  mode = "insert",
  images = [],
  onConfirm,
  onCancel,
  saving = false,
}) {
  const [draftImages, setDraftImages] = useState([]);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setDraftImages(images.map((item) => ({ ...item })));
    }
    wasOpenRef.current = open;
  }, [open, images]);

  if (!open || draftImages.length === 0) return null;

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit image alt text" : "Add alt text for SEO";
  const subtitle = isEdit
    ? "Update the description for this image. Good alt text helps SEO and accessibility."
    : "Describe each image for accessibility and search engines.";

  let confirmLabel = "Insert image";
  if (saving) {
    confirmLabel = isEdit ? "Saving…" : "Inserting…";
  } else if (isEdit) {
    confirmLabel = "Save alt text";
  } else if (draftImages.length > 1) {
    confirmLabel = `Insert ${draftImages.length} images`;
  }

  const updateDraftAlt = (index, alt) => {
    setDraftImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, alt } : item)),
    );
  };

  return (
    <div className="content-image-alt-overlay" onClick={onCancel}>
      <div
        className="content-image-alt-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-image-alt-title"
      >
        <h3 id="content-image-alt-title">{title}</h3>
        <p className="content-image-alt-subtitle">
          {subtitle}
          {!isEdit && draftImages.length > 1 && ` (${draftImages.length} images)`}
        </p>

        <ul className="content-image-alt-list">
          {draftImages.map((item, index) => (
            <li key={`${item.url}-${index}`} className="content-image-alt-row">
              <img
                src={item.previewUrl}
                alt=""
                className="content-image-alt-thumb"
              />
              <div className="content-image-alt-fields">
                <label htmlFor={`content-image-alt-${index}`}>
                  {isEdit ? "Alt text (SEO)" : `Image ${index + 1} alt text`}
                </label>
                <input
                  id={`content-image-alt-${index}`}
                  value={item.alt}
                  placeholder="Describe this image"
                  autoFocus={index === 0}
                  onChange={(e) => updateDraftAlt(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const next = draftImages.map((row, i) =>
                        i === index ? { ...row, alt: e.target.value } : row,
                      );
                      onConfirm(next);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="content-image-alt-actions">
          <button
            type="button"
            className="content-image-alt-cancel"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="content-image-alt-insert"
            onClick={() => onConfirm(draftImages)}
            disabled={saving}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
