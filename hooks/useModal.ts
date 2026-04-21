import { useState } from "react";

interface ModalState {
  visible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const showSuccess = (title: string, message: string) => {
    setModal({
      visible: true,
      type: "success",
      title,
      message,
    });
  };

  const showError = (title: string, message: string) => {
    setModal({
      visible: true,
      type: "error",
      title,
      message,
    });
  };

  const showInfo = (title: string, message: string) => {
    setModal({
      visible: true,
      type: "info",
      title,
      message,
    });
  };

  const hideModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  return {
    modal,
    showSuccess,
    showError,
    showInfo,
    hideModal,
  };
};
