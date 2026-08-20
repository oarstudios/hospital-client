import { useCallback, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function useConfirmDialog() {
  const [state, setState] = useState({ open: false });
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: options.title || "Are you sure?",
        message: options.message || "",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        danger: options.danger !== false,
      });
    });
  }, []);

  const close = (ok) => {
    setState((prev) => ({ ...prev, open: false }));
    resolveRef.current?.(ok);
    resolveRef.current = null;
  };

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      danger={state.danger}
      onCancel={() => close(false)}
      onConfirm={() => close(true)}
    />
  );

  return [confirm, dialog];
}
