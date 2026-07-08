import toast from "react-hot-toast";

// Thin wrapper over react-hot-toast so every screen shows one consistent,
// dark-themed toast. Dismiss any open toast first to avoid a stack piling up.
export const notify = (message = "Not implemented yet", type = "info") => {
  toast.dismiss();
  if (type === "success") return toast.success(message);
  if (type === "error") return toast.error(message);
  return toast(message);
};

export default notify;
