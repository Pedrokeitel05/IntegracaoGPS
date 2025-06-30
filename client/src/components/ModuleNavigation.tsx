import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, User, Calendar, Settings } from 'lucide-react';
import { Module, Employee } from '../types';
import { ModuleCard } from './ModuleCard';

interface ModuleNavigationProps {
  modules: Module[];
  employee: Employee;
  onModuleStart: (moduleId: string) => void;
  onAdminClick?: () => void;
}

export function ModuleNavigation({ modules, employee, onModuleStart, onAdminClick }: ModuleNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 1280 ? 320 : window.innerWidth >= 640 ? 320 : 288;
      const scrollAmount = cardWidth + 16;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const completedCount = modules.filter(m => m.isCompleted).length;
  const totalCount = modules.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img src="/REGIONAL RS (9).png" alt="GPS Group" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Progresso da Integração</h1>
                <p className="text-blue-200 text-sm sm:text-base">Bem-vindo, {employee.fullName}</p>
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
                    Iniciado em: {new Date(employee.registrationDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              {/* Botão Admin ao lado das credenciais */}
              {onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                  title="Painel Administrativo"
                >
                  <Settings className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200 text-sm font-medium">Progresso Geral</span>
              <span className="text-blue-200 text-sm">{completedCount}/{totalCount} módulos concluídos</span>
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

      <div className="relative py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">Módulos de Treinamento</h2>

          <div className="relative overflow-visible py-8">
            <div 
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide pb-8 px-4 snap-x snap-mandatory relative z-0"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {modules.map((module, index) => (
                <div key={module.id} className="snap-center relative z-0 hover:z-10 overflow-visible">
                  <ModuleCard
                    module={module}
                    index={index}
                    onStart={onModuleStart}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-6 sm:mt-8">
            <button
              onClick={() => scroll('left')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full p-3 sm:p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Navegar para a esquerda"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full p-3 sm:p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Navegar para a direita"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="text-center mt-4 sm:mt-6">
            <p className="text-blue-300 text-xs sm:text-sm">
              Use as setas para navegar entre os módulos ou deslize horizontalmente
            </p>
          </div>
        </div>
      </div>



      {completedCount === totalCount && (
        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm sm:text-base">Integração Concluída!</span>
          </div>
        </div>
      )}
    </div>
  );
}
