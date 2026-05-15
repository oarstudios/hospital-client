import { addToast } from "../redux/toast/toastSlice";

/**
 * Toast Middleware
 * ───────────────
 * Intercepts Redux actions and fires toasts when the action carries
 * a `meta.toast` config.  Works with plain actions AND async thunks
 * (createAsyncThunk's fulfilled / rejected lifecycle actions).
 *
 * ─── Opt-in API ────────────────────────────────────────────────────────────
 *
 * Option A – thunk (most common).
 * Add `toast` to the second argument of dispatch:
 *
 *   dispatch(createService(formData), {
 *     toast: {
 *       success: 'Service created!',
 *       error:   true,          // auto-use the rejected payload message
 *     }
 *   });
 *
 * Option B – plain action.
 * Attach `meta.toast` directly to the action object:
 *
 *   dispatch({ type: 'foo/bar', meta: { toast: { success: 'Done!' } } });
 *
 * ─── Toast config shape ────────────────────────────────────────────────────
 *
 * {
 *   success?:  string | true       // true → 'Done!'
 *   error?:    string | true       // true → uses action.payload (rejected msg)
 *   info?:     string
 *   warning?:  string
 *   duration?: number              // ms – overrides the default 3500
 * }
 *
 * Omit a key entirely to suppress that toast type.
 * ───────────────────────────────────────────────────────────────────────────
 */

const FULFILLED_SUFFIX = '/fulfilled';
const REJECTED_SUFFIX  = '/rejected';

/**
 * Redux-Toolkit's createAsyncThunk stores the toast config we pass as
 * the second argument of dispatch() on the thunk's `meta` field.
 * This middleware looks for it there, OR directly on action.meta.toast
 * for plain actions.
 */
export const toastMiddleware = (store) => (next) => (action) => {
  const result = next(action); // always pass the action through first

  const toast = action?.meta?.toast; // set by the thunk dispatch wrapper below
  if (!toast) return result;

  const { success, error, info, warning, duration } = toast;
  const type = action?.type ?? '';
  const baseConfig = duration ? { duration } : {};

  // ── Fulfilled ──────────────────────────────────────────────────────────────
  if (type.endsWith(FULFILLED_SUFFIX)) {
    if (success) {
      const message = success === true ? 'Done!' : success;
      store.dispatch(addToast({ message, type: 'success', ...baseConfig }));
    }
    if (info) {
      store.dispatch(addToast({ message: info, type: 'info', ...baseConfig }));
    }
  }

  // ── Rejected ───────────────────────────────────────────────────────────────
  if (type.endsWith(REJECTED_SUFFIX)) {
    if (error) {
      const fallback =
        typeof action.payload === 'string'
          ? action.payload
          : action.error?.message ?? 'Something went wrong.';
      const message = error === true ? fallback : error;
      store.dispatch(addToast({ message, type: 'error', ...baseConfig }));
    }
    if (warning) {
      store.dispatch(addToast({ message: warning, type: 'warning', ...baseConfig }));
    }
  }

  return result;
};

/**
 * Wraps dispatch so you can pass toast config as the second argument
 * of any thunk dispatch call.
 *
 * Usage in a component:
 *
 *   import { useDispatch } from 'react-redux';
 *   import { withToast }   from '../redux/toast/toastMiddleware';
 *
 *   const rawDispatch = useDispatch();
 *   const dispatch    = withToast(rawDispatch);
 *
 *   await dispatch(createService(formData), {
 *     toast: { success: 'Service created!', error: true }
 *   }).unwrap();
 *
 * The wrapper injects the toast config into `meta` so the middleware
 * picks it up, then returns the original thunk promise so `.unwrap()`
 * still works as normal.
 */
export function withToast(dispatch) {
  return function (thunkAction, options) {
    if (!options?.toast) {
      // No toast config — plain pass-through
      return dispatch(thunkAction);
    }

    // Wrap the thunk so it injects meta.toast onto its lifecycle actions
    const wrappedThunk = (dispatchInner, getState) => {
      const originalThunk =
        typeof thunkAction === 'function' ? thunkAction : () => Promise.resolve(thunkAction);

      const result = originalThunk(
        (action) => {
          // Attach toast config onto fulfilled/rejected meta
          if (action?.meta !== undefined || action?.type) {
            const patched = {
              ...action,
              meta: { ...(action.meta ?? {}), toast: options.toast },
            };
            return dispatchInner(patched);
          }
          return dispatchInner(action);
        },
        getState,
      );

      return result;
    };

    return dispatch(wrappedThunk);
  };
}   