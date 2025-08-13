import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-blue-200 mb-8">{message}</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
