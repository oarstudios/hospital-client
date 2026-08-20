import { showToast } from "../../redux/toast/toastSlice";

export const INDIAN_PHONE = /^[6-9]\d{9}$/;

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
