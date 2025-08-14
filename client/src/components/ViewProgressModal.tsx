import React, { useState, useEffect } from "react";
import { Employee, Module } from "../types";
import {
  X,
  CheckSquare,
  Square,
  User,
  FileText,
  Briefcase,
  Building,
  UserCheck,
} from "lucide-react";

interface ViewProgressModalProps {
  isOpen: boolean;
  employee: Employee | null;
  modules: Module[];
  onClose: () => void;
}

export function ViewProgressModal({
  isOpen,
  employee,
  modules,
  onClose,
}: ViewProgressModalProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !employee) {
    return null;
  }

  const reversedHistory = [...(employee.history || [])].reverse();
  const hasMoreHistory = reversedHistory.length > 1;

  const assignedModules = modules.filter(
    (module) =>
      !module.targetAreas ||
      module.targetAreas.length === 0 ||
      module.targetAreas.includes(employee.jobPosition as any),
  );

  const completedCount = assignedModules.filter((m) =>
    employee.completedModules.includes(m.id),
  ).length;

  const totalCount = assignedModules.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 border border-white/20 rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-8 pb-6 flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Detalhes do Colaborador
            </h3>
            <p className="text-blue-200">
              Progresso e informações do cadastro.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <User size={16} /> Nome Completo
              </p>
              <p className="text-base text-white">{employee.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <FileText size={16} /> CPF
              </p>
              <p className="text-base text-white">{employee.cpf}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <Briefcase size={16} /> Cargo
              </p>
              <p className="text-base text-white">{employee.jobPosition}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <Building size={16} /> Empresa
              </p>
              <p className="text-base text-white">{employee.company}</p>
            </div>
            {employee.hiredBy && (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-blue-300 flex items-center gap-2">
                  <UserCheck size={16} /> Cadastrado Por
                </p>
                <p className="text-base text-white">{employee.hiredBy}</p>
              </div>
            )}
          </div>

          <hr className="border-white/10" />

          {/* SECÇÃO DE HISTÓRICO CORRIGIDA */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              Histórico de Alterações
            </h4>
            <div className="relative">
              <div
                className={`space-y-3 transition-all duration-300 ${
                  !isHistoryExpanded && hasMoreHistory
                    ? "max-h-24 overflow-hidden"
                    : ""
                }`}
              >
                {reversedHistory.length > 0 ? (
                  reversedHistory.map((record, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 rounded-lg text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">
                          {record.type}
                        </span>
                        <span className="text-xs text-blue-300/70">
                          {new Date(record.date).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-blue-200 mt-1">{record.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-blue-300 text-sm">
                    Nenhuma alteração registada.
                  </p>
                )}
              </div>
              {hasMoreHistory && !isHistoryExpanded && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900 to-transparent pointer-events-none z-10" />
          
                  <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-2 z-20">
                    <button
                      onClick={() => setIsHistoryExpanded(true)}
                      className="font-semibold text-sm text-blue-300 transition-colors hover:text-white cursor-pointer"
                    >
                      Ver mais {reversedHistory.length - 1} registo(s)...
                    </button>
                  </div>
                </>
              )}
            </div>
            {hasMoreHistory && isHistoryExpanded && (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsHistoryExpanded(false)}
                  className="text-blue-400 hover:text-white text-sm mt-2"
                >
                  Ver menos
                </button>
              </div>
            )}
          </div>

          {/* SECÇÃO DE PROGRESSO */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200 text-sm font-medium">
                Progresso Geral
              </span>
              <span className="text-blue-200 text-sm">
                {completedCount}/{totalCount} módulos concluídos
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="space-y-2 mt-4">
              {assignedModules.map((module) => {
                const isCompleted = employee.completedModules.includes(
                  module.id,
                );
                return (
                  <div
                    key={module.id}
                    className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                    <span
                      className={`text-white ${isCompleted ? "" : "opacity-70"}`}
                    >
                      {module.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
