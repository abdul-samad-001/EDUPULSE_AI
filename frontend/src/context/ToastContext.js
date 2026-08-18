import { createContext, useContext } from "react";
import { toast } from "../utils/toast";

export const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return toast;
  }
  return context;
};

export default ToastContext;
