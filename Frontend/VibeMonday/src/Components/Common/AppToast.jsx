import { Toast } from "@vibe/core";

const AppToast = ({ toast, setToast }) => {
  if (!toast.open) return null;

  return (
    <Toast
      id="app-toast"
      open={toast.open}
      type={toast.type || "positive"}
      onClose={() => {
        toast.onClose?.();
        setToast(prev => ({ ...prev, open: false }));
      }}
      actions={toast.actions || []}
    >
      {toast.message}
    </Toast>
  );
};

export default AppToast;
