import React from 'react';
import { ArrowRight, Building2, Settings } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onAdminClick?: () => void;
}

export function WelcomeScreen({ onStart, onAdminClick }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/REGIONAL RS (9).png" 
            alt="GPS Group" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Conteúdo de Boas-vindas */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-400" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Bem-vindo ao
            <span className="block text-blue-400 mt-2">GPS Group</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Inicie sua jornada conosco através do nosso programa abrangente de integração. 
            Vamos guiá-lo através de tudo que você precisa saber para ter sucesso em sua nova função.
          </p>
          
          <div className="space-y-4 text-blue-200 mb-10">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Complete seu cadastro</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Aprenda nossas políticas e procedimentos</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Acesse treinamentos específicos da sua função</span>
            </div>
          </div>
          
          <button
            onClick={onStart}
            className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 mx-auto"
          >
            <span>Iniciar Integração</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        <p className="text-blue-300 mt-8 text-sm">
          Tempo estimado de conclusão: 45-60 minutos
        </p>
      </div>

      {/* Botão Admin no canto superior direito */}
      {onAdminClick && (
        <button
          onClick={onAdminClick}
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          title="Painel Administrativo"
        >
          <Settings className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}