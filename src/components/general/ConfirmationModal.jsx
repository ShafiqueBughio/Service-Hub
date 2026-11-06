
import React from "react";
import { IoClose } from "react-icons/io5";
import Button from "../ui/Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Job",
  description = "Are you sure you want to perform this action?",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center 
      bg-black/40  p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="relative w-full max-w-md bg-white rounded-2xl 
        shadow-2xl p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 
          hover:text-gray-700 transition cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        {/* Center Icon */}
        <div className="flex flex-col items-center text-center pt-4">

          <div
            className={`w-16 h-16 rounded-full flex items-center 
            justify-center mb-4 ${
              isDanger
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {icon}
          </div>

          {/* Title */}
          <h2
            id="confirmation-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-2 leading-6">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-8">

          <button
            onClick={onClose}
            className={`w-1/2 px-4 py-2.5 rounded-lg border 
            border-gray-300 text-gray-700 text-sm 
            hover:bg-gray-100 transition cursor-pointer 
           ${
              isDanger
                ? "bg-primary-gradient hover:shadow-md text-white"
                : "bg-primary hover:opacity-90"
            }
            `}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`w-1/2 px-4 py-2.5 rounded-lg  
            text-base font-semibold transition cursor-pointer ${
              isDanger
                ? "bg-gray-200 text-gray-800 hover:shadow-sm"
                : "bg-primary hover:opacity-90"
            }`}
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
