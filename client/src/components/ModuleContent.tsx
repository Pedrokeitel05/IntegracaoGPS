import React, { useState, useEffect } from "react";
import { Module } from "../types";
import { ModuleQuiz } from "./ModuleQuiz";
import { VideoPlayer } from "./VideoPlayer";
import { ArrowLeft, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface ModuleContentProps {
  module: Module;
  onComplete: () => void;
  onBack: () => void;
}

// Estados para controlar o que é exibido na tela
type ModuleStage = "video" | "quiz" | "failed" | "completed";

export function ModuleContent({
  module,
  onComplete,
  onBack,
}: ModuleContentProps) {
  // Estado para gerenciar a etapa atual (vídeo, quiz, falha, concluído)
  const [stage, setStage] = useState<ModuleStage>("video");
  // Estado para contar as tentativas da avaliação
  const [quizAttempts, setQuizAttempts] = useState(0);

  const hasVideo = !!module.videoUrl;
  const hasQuiz = module.questions && module.questions.length > 0;

  useEffect(() => {
    // Se um módulo não tiver vídeo, vai direto para a avaliação (se houver)
    if (!hasVideo) {
      if (hasQuiz) {
        setStage("quiz");
      } else {
        // Se não tiver nem vídeo nem avaliação, conclui o módulo automaticamente
        handleModuleCompletion();
      }
    }
  }, [hasVideo, hasQuiz]);

  // Chamado quando o componente VideoPlayer informa que o vídeo terminou
  const handleVideoComplete = () => {
    if (hasQuiz) {
      // Se houver uma avaliação, muda o estágio para "quiz"
      setStage("quiz");
    } else {
      // Se não, conclui o módulo
      handleModuleCompletion();
    }
  };

  // Chamado quando o componente ModuleQuiz informa que a avaliação foi finalizada
  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      // Se o usuário acertou tudo, conclui o módulo
      handleModuleCompletion();
    } else {
      // Se errou alguma...
      if (quizAttempts < 1) {
        // ...e for a primeira tentativa, aumenta a contagem e mostra a tela de falha
        setQuizAttempts(quizAttempts + 1);
        setStage("failed");
      } else {
        // ...se for a segunda tentativa, reseta as tentativas e força o usuário a ver o vídeo de novo
        setQuizAttempts(0);
        setStage("video");
      }
    }
  };

  const handleModuleCompletion = () => {
    setStage("completed");
    // Aguarda 2 segundos antes de chamar a função onComplete para o usuário ver a mensagem
    setTimeout(() => onComplete(), 2000);
  };

  // Ação do botão "Tentar Novamente" na tela de falha
  const retryQuiz = () => {
    setStage("quiz");
  };

  // Função que decide qual tela renderizar
  const renderContent = () => {
    switch (stage) {
      case "video":
        return (
          <VideoPlayer
            videoUrl={module.videoUrl!}
            moduleTitle={module.title}
            onVideoComplete={handleVideoComplete}
            showStartQuizButton={hasQuiz} // Informa ao player qual botão mostrar
          />
        );

      case "quiz":
        return (
          <ModuleQuiz
            questions={module.questions!}
            onQuizComplete={handleQuizComplete}
            moduleTitle={module.title}
          />
        );

      case "failed":
        return (
          <div className="text-center text-white animate-fadeInUp flex flex-col items-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Resultado não foi perfeito
            </h2>
            <p className="text-blue-200 mb-6 max-w-md">
              Não se preocupe! Você tem mais uma chance para refazer a
              avaliação. Se errar novamente, você precisará assistir ao vídeo
              mais uma vez.
            </p>
            <button
              onClick={retryQuiz}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Tentar Novamente
            </button>
          </div>
        );

      case "completed":
        return (
          <div className="text-center text-white animate-fadeInUp">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Módulo Concluído!</h2>
            <p className="text-blue-200 mb-6">
              Parabéns! Você concluiu com sucesso o módulo {module.title}.
            </p>
            <p className="text-green-400 font-medium animate-pulse">
              Redirecionando...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Voltar aos Módulos</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              {module.title}
            </h1>
          </div>
          {/* Espaço reservado para manter o título centralizado */}
          <div className="w-32"></div>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
