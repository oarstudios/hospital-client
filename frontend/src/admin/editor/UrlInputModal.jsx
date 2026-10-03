import { useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";
import "./UrlInputModal.css";

/**
 * Small popup asking for a URL (replaces window.prompt in the editor).
 *
 * - `validate(value)` → error message string, or "" when valid
 * - `renderPreview(value)` → optional preview node for a valid value
 * - `onRemove` → shows a secondary "Remove" action (e.g. remove link)
 *
 * Mount only while open so the field starts from `initialValue`.
 */
export default function UrlInputModal({
  title,
  description,
  label = "URL",
  placeholder = "https://",
  initialValue = "",
  confirmLabel = "Insert",
  icon = null,
  validate = () => "",
  renderPreview,
  onConfirm,
  onCancel,
  onRemove,
  removeLabel = "Remove",
}) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  const trimmed = value.trim();
  const error = trimmed ? validate(trimmed) : "";
  const canConfirm = Boolean(trimmed) && !error;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (canConfirm) onConfirm(trimmed);
  };

  const showError = error && (touched || trimmed.length > 10);

  return (
    <div className="url-modal-overlay" onMouseDown={onCancel}>
      <form
        className="url-modal"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="url-modal-title"
      >
        <div className="url-modal-head">
          {icon && <span className="url-modal-icon" aria-hidden="true">{icon}</span>}
          <h3 id="url-modal-title">{title}</h3>
          <button type="button" className="url-modal-close" aria-label="Close" onClick={onCancel}>
            <LuX />
          </button>
        </div>

        {description && <p className="url-modal-desc">{description}</p>}

        <label className="url-modal-label" htmlFor="url-modal-input">{label}</label>
        <input
          id="url-modal-input"
          ref={inputRef}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          className={`url-modal-input${showError ? " is-invalid" : ""}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? "url-modal-error" : undefined}
        />
        {showError && (
          <p id="url-modal-error" className="url-modal-error">{error}</p>
        )}

        {canConfirm && renderPreview && (
          <div className="url-modal-preview">{renderPreview(trimmed)}</div>
        )}

        <div className="url-modal-actions">
          {onRemove && (
            <button type="button" className="url-modal-remove" onClick={onRemove}>
              {removeLabel}
            </button>
          )}
          <button type="button" className="url-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="url-modal-confirm" disabled={!canConfirm}>
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
