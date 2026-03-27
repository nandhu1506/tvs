import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "colored",
};

export const ToastSuccess = (message) => {
  toast.success(message, toastOptions);
};

export const ToastError = (message) => {
  toast.error(message, toastOptions);
};

export const ToastInfo = (message) => {
  toast.info(message, toastOptions);
};

export const ToastWarning = (message) => {
  toast.warning(message, toastOptions);
};