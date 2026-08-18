// Event emitter pattern for calling toast outside of React components
const toastListeners = new Set();

const emitToast = (event) => {
  toastListeners.forEach((listener) => listener(event));
};

export const subscribeToast = (listener) => {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
};

let toastIdCounter = 0;

export const toast = {
  show: (titleOrOptions, maybeOptions = {}) => {
    const id = `toast-${++toastIdCounter}-${Date.now()}`;
    const toastData =
      typeof titleOrOptions === "string"
        ? {
            id,
            title: titleOrOptions,
            ...maybeOptions,
            type: maybeOptions.type || "info",
            duration: maybeOptions.duration ?? 4000,
          }
        : {
            id,
            ...titleOrOptions,
            type: titleOrOptions.type || "info",
            duration: titleOrOptions.duration ?? 4000,
          };

    emitToast({ action: "ADD", toast: toastData });
    return id;
  },

  success: (title, options = {}) => {
    return toast.show(title, { ...options, type: "success" });
  },

  error: (title, options = {}) => {
    return toast.show(title, { ...options, type: "error", duration: options.duration ?? 5000 });
  },

  warning: (title, options = {}) => {
    return toast.show(title, { ...options, type: "warning", duration: options.duration ?? 4500 });
  },

  info: (title, options = {}) => {
    return toast.show(title, { ...options, type: "info" });
  },

  loading: (title, options = {}) => {
    return toast.show(title, { ...options, type: "loading", duration: 0 });
  },

  promise: async (
    promise,
    { loading = "Loading...", success = "Success!", error = "Something went wrong" },
    options = {}
  ) => {
    const id = toast.loading(loading, options);
    try {
      const result = await promise;
      const successMessage = typeof success === "function" ? success(result) : success;
      toast.dismiss(id);
      toast.success(successMessage, options);
      return result;
    } catch (err) {
      const errorMessage =
        typeof error === "function" ? error(err) : (err?.response?.data?.message || err?.message || error);
      toast.dismiss(id);
      toast.error(errorMessage, options);
      throw err;
    }
  },

  dismiss: (id) => {
    emitToast({ action: "REMOVE", id });
  },

  clear: () => {
    emitToast({ action: "CLEAR" });
  },
};

export default toast;
