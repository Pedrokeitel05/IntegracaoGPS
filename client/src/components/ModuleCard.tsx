import React from 'react';
import { Lock, CheckCircle, Play, ArrowRight } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
}

interface ModuleCardProps {
  module: Module;
  index: number;
  onStart: (moduleId: string) => void;
}

export function ModuleCard({ module, index, onStart }: ModuleCardProps) {
  const getModuleIcon = () => {
    if (module.isCompleted) return <CheckCircle className="h-8 w-8 text-green-400" />;
    if (module.isLocked) return <Lock className="h-8 w-8 text-gray-400" />;
    return <Play className="h-8 w-8 text-blue-400" />;
  };

  const getCardStyles = () => {
    if (module.isCompleted) {
      return "bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/50 shadow-green-500/20";
    }
    if (module.isLocked) {
      return "bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-600/50 shadow-gray-500/10";
    }
    return "bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/50 shadow-blue-500/20 hover:shadow-blue-500/30";
  };

  const handleCardClick = () => {
    if (module.id === 'registration' || module.isLocked) return;
    onStart(module.id);
  };

  const isClickable = module.id !== 'registration' && !module.isLocked;

  return (
    <div
      className={`
        relative flex-shrink-0 rounded-2xl border backdrop-blur-lg shadow-2xl transition-all duration-300
        w-72 h-80 sm:w-80 sm:h-96 lg:w-72 lg:h-80 xl:w-80 xl:h-96
        ${getCardStyles()}
        ${isClickable ? 'hover:shadow-2xl hover:scale-105 cursor-pointer hover:z-10' : 'cursor-default'}
      `}
      style={{ transformOrigin: 'bottom center' }}
      onClick={handleCardClick}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex justify-center mb-4">
          {getModuleIcon()}
        </div>

        <h3
          className={`text-lg sm:text-xl font-bold text-center mb-3 leading-tight ${
            module.isLocked ? 'text-gray-400' : 'text-white'
          }`}
        >
          {module.title}
        </h3>

        <p
          className={`text-center text-sm mb-4 flex-grow ${
            module.isLocked ? 'text-gray-500' : 'text-blue-200'
          }`}
        >
          {module.description}
        </p>

        <div className="text-center mt-auto">
          {module.id === 'registration' ? (
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Cadastro Realizado</span>
            </div>
          ) : module.isCompleted ? (
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Concluído</span>
            </div>
          ) : module.isLocked ? (
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Lock className="h-5 w-5" />
              <span className="text-sm">Bloqueado</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-blue-400 group">
              <span className="font-semibold text-sm">Iniciar Módulo</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </div>
      </div>

      {module.isLocked && (
        <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
          <div className="text-center p-4">
            <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-xs sm:text-sm px-2">
              Complete os módulos anteriores para desbloquear
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
