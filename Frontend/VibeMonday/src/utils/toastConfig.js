export const createToast = ({
  message,
  type = "positive",
  onConfirm,
  confirmText = "Ok",
  onCancel,
  cancelText = "Cancel",
  afterClose,
}) => {
  return {
    open: true,
    message,
    type,
    actions: [
      {
        type: "button",
        content: confirmText,
        onClick: onConfirm,
      },
      onCancel && {
        type: "button",
        content: cancelText,
        onClick: onCancel,
      },
    ].filter(Boolean),
    onClose: afterClose,
  };
};
