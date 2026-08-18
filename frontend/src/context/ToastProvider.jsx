import { useState, useCallback, useEffect } from "react";
import { ToastContext } from "./ToastContext";
import { subscribeToast, toast } from "../utils/toast";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((newToast) => {
    setToasts((prev) => {
      const filtered = prev.length >= 5 ? prev.slice(prev.length - 4) : prev;
      return [...filtered, newToast];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToast((event) => {
      if (event.action === "ADD") {
        addToast(event.toast);
      } else if (event.action === "REMOVE") {
        removeToast(event.id);
      } else if (event.action === "CLEAR") {
        clearToasts();
      }
    });

    return unsubscribe;
  }, [addToast, removeToast, clearToasts]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearToasts,
        toast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
