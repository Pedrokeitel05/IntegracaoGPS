import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface NonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
  employeeName: string;
}

export function NonCompletionModal({
  isOpen,
  onClose,
  onSave,
  employeeName,
}: NonCompletionModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (reason.trim()) {
      onSave(reason);
      setReason(""); // Limpa o campo
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">
              Justificar Não Conclusão
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-blue-200 mb-6">
          Por favor, descreva o motivo pelo qual{" "}
          <strong className="text-white">{employeeName}</strong> não concluiu a
          integração.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 p-3"
          placeholder="Ex: O colaborador não compareceu no primeiro dia."
        />

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim()}
            className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Salvar Justificativa
          </button>
        </div>
      </div>
    </div>
  );
}
