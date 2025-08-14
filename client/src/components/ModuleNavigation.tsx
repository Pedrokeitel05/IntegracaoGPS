import React, { useRef, useEffect } from "react"; // Adicionado useEffect
import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { Module, Employee } from "../types";
import { ModuleCard } from "./ModuleCard";

interface ModuleNavigationProps {
  modules: Module[];
  employee: Employee;
  onModuleStart: (moduleId: string) => void;
  onLogout: () => void;
}

export function ModuleNavigation({
  modules,
  employee,
  onModuleStart,
  onLogout,
}: ModuleNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth =
        window.innerWidth >= 1280 ? 320 : window.innerWidth >= 640 ? 320 : 288;
      const scrollAmount = cardWidth + 16;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredModules = modules
    .filter(
      (module) =>
        !module.targetAreas ||
        module.targetAreas.length === 0 ||
        module.targetAreas.includes(employee.jobPosition as any),
    )
    .sort((a, b) => a.order - b.order);

  const completedCount = filteredModules.filter((m) => m.isCompleted).length;
  const totalCount = filteredModules.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const allModulesCompleted = totalCount > 0 && completedCount === totalCount;

  // Alteração 1: Adicionado useEffect para controlar a rolagem da página
  useEffect(() => {
    // Se o modal de conclusão estiver visível, desativa a rolagem da página
    if (allModulesCompleted) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Função de limpeza para restaurar a rolagem quando o componente for desmontado
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [allModulesCompleted]);

  return (
    <div className="min-h-screen bg-blue-900 relative">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Progresso da Integração
                </h1>
                <p className="text-blue-200 text-sm sm:text-base">
                  Bem-vindo, {employee.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end space-x-2 text-blue-200 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{employee.jobPosition}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-2 text-blue-200">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Iniciado em:{" "}
                    {new Date(employee.registrationDate).toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-3 bg-red-600/20 backdrop-blur-lg border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Sair e voltar ao início"
              >
                <LogOut className="h-5 w-5 text-red-400" />
              </button>
            </div>
          </div>
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
          </div>
        </div>
      </div>
      <div className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Módulos de Treinamento
          </h2>
          <div className="relative py-4">
            <div
              ref={scrollContainerRef}
              className="flex space-x-8 overflow-x-auto scrollbar-hide pb-8 px-12 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredModules.map((module, index) => (
                <div key={module.id} className="snap-center flex-shrink-0">
                  <ModuleCard
                    module={module}
                    index={index}
                    onStart={onModuleStart}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => scroll("left")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full p-3 sm:p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Navegar para a esquerda"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full p-3 sm:p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Navegar para a direita"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-blue-300 text-xs sm:text-sm">
              Use as setas para navegar entre os módulos ou deslize
              horizontalmente
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <img
              src="/GPA BRANCO.png"
              alt="Grupo GPS"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {allModulesCompleted && (
        <div className="fixed inset-0 bg-blue-900/90 backdrop-blur-lg flex items-center justify-center z-20 animate-fadeInUp">
          <div className="text-center bg-white/10 border border-white/20 rounded-2xl p-8 max-w-lg mx-4">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Parabéns, {employee.fullName}!
            </h2>
            <p className="text-blue-200 mb-6">
              Você concluiu com sucesso todas as etapas da sua integração.
            </p>
            <p className="text-white font-semibold mb-8">
              O departamento de Recursos Humanos (RH) já foi notificado. Por
              favor, aguarde o contacto para receber as próximas instruções.
            </p>
            {/* Alteração 2: Adicionado mx-auto para garantir a centralização */}
            <button
              onClick={onLogout}
              className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Finalizar e Sair</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
