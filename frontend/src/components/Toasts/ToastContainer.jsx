import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../redux/toast/toastSlice';
import './ToastContainer.css';

/**
 * ToastContainer
 * ──────────────
 * Reads from `state.toast.toasts` and renders them in a fixed portal-like
 * stack (top-right by default).  Each toast auto-dismisses after `duration`
 * ms and supports a manual close button.
 *
 * Mount once at the app root — see main.jsx / App.jsx.
 * No props required.
 */
const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

const Toast = ({ toast }) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const dismiss = () => dispatch(removeToast(toast.id));

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, toast.duration ?? 3500);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  return (
    <div className={`tc-toast tc-toast--${toast.type}`} role="alert">
      <span className="tc-toast__icon">{ICONS[toast.type] ?? 'ℹ'}</span>
      <span className="tc-toast__message">{toast.message}</span>
      <button
        className="tc-toast__close"
        onClick={dismiss}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector((s) => s.toast.toasts);

  if (!toasts.length) return null;

  return (
    <div className="tc-container" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
};

export default ToastContainer;