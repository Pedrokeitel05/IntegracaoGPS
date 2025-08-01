import React from "react";
import { ArrowRight, Building2, Settings } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  onAdminClick?: () => void;
}

export function WelcomeScreen({ onStart, onAdminClick }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          {/* LOGO ALTERADA AQUI - TAMANHO REDUZIDO */}
          <img
            src="/GPA BRANCO.png"
            alt="Grupo GPS"
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Bem-vindo ao
            <span className="block text-blue-400 mt-2">Grupo GPS</span>
          </h1>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Inicie sua jornada conosco através do nosso programa abrangente de
            integração. Vamos guiá-lo através de tudo que você precisa saber
            para ter sucesso em sua nova função.
          </p>

          <div className="mb-8 sm:mb-10 px-4 text-center">
            <div className="inline-block text-left space-y-3 sm:space-y-4 text-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm sm:text-base">
                  Complete seu cadastro
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm sm:text-base">
                  Aprenda nossas políticas e procedimentos
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm sm:text-base">
                  Acesse treinamentos específicos da sua função
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 mx-auto"
          >
            <span>Iniciar Integração</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <p className="text-blue-300 mt-8 text-sm">
          Tempo estimado de conclusão: 45-60 minutos
        </p>
      </div>
      {onAdminClick && (
        <button
          onClick={onAdminClick}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          title="Painel Administrativo"
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>
      )}
    </div>
  );
}
