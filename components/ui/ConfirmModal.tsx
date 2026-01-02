"use client";

import { useEffect, useCallback } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title">{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        <div className="confirm-modal-footer">
          <button
            type="button"
            onClick={handleCancel}
            className="confirm-modal-button confirm-modal-button-cancel"
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`confirm-modal-button confirm-modal-button-confirm ${
              variant === "danger" ? "confirm-modal-button-danger" : ""
            }`}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

