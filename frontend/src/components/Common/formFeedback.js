import { showToast } from "../../redux/toast/toastSlice";

export const INDIAN_PHONE = /^[6-9]\d{9}$/;

export const CENTER_AREAS = ["Mumbai", "Navi Mumbai", "Thane"];

/** True when a select is still on its empty placeholder (not a real choice). */
export function isUnsetSelect(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

/**
 * Validate a required select field.
 * Returns an error message string, or "" when valid.
 */
export function getSelectError(value, { label = "an option", allowedValues } = {}) {
  if (isUnsetSelect(value)) {
    return `Please select ${label}.`;
  }

  const normalized = String(value).trim();
  if (allowedValues?.length && !allowedValues.includes(normalized)) {
    return `Please select a valid ${label}.`;
  }

  return "";
}

export function notifyFirstError(dispatch, errors = {}) {
  const first = Object.values(errors).find(Boolean);
  if (first) dispatch(showToast.error(first));
}

export function clearField(setErrors, name) {
  setErrors((prev) => {
    if (!prev?.[name]) return prev;
    const next = { ...prev };
    delete next[name];
    return next;
  });
}

/** Read a useful error message from an axios / API error object. */
export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (!data) return fallback;

  const { message } = data;
  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message) && message.length) return String(message[0]);

  return fallback;
}
