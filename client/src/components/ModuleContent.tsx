import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
} from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
interface ModuleContentProps {
  moduleId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function ModuleContent({
  moduleId,
  onComplete,
  onBack,
}: ModuleContentProps) {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);

  const getModuleData = (id: string) => {
    const modules = {
      hr: {
        title: "Recursos Humanos",
        description:
          "Conheça a cultura, valores e políticas da empresa GPS Group.",
      },
      quality: {
        title: "Garantia de Qualidade",
        description:
          "Aprenda sobre nossos padrões de qualidade e processos de melhoria contínua.",
      },
      safety: {
        title: "Segurança do Trabalho e Meio Ambiente",
        description: "Protocolos de segurança e responsabilidade ambiental.",
      },
      benefits: {
        title: "Benefícios",
        description:
          "Conheça todos os benefícios e vantagens oferecidos aos funcionários.",
      },
      "asset-protection": {
        title: "Proteção de Ativos",
        description: "Fundamentos de segurança e proteção patrimonial.",
      },
      infrastructure: {
        title: "Serviços de Infraestrutura",
        description: "Padrões de limpeza e manutenção de infraestrutura.",
      },
      "hospital-care": {
        title: "Cuidados Hospitalares",
        description: "Protocolos especializados para ambientes hospitalares.",
      },
    };
    return modules[id as keyof typeof modules] || modules.hr;
  };
  const moduleData = getModuleData(moduleId);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => setApiReady(true);
    } else {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (apiReady && !playerRef.current) {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: "2SNsiRGhWPs",
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          autoplay: 0,
          fs: 1,
        },
        events: {
          onReady: (e: any) => setDuration(e.target.getDuration()),
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            else if (e.data === window.YT.PlayerState.PAUSED)
              setIsPlaying(false);
            else if (e.data === window.YT.PlayerState.ENDED) {
              setIsVideoCompleted(true);
              setIsPlaying(false);
            }
          },
        },
      });
    }
  }, [apiReady]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isVideoCompleted && playerRef.current) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const currentVideoTime = playerRef.current.getCurrentTime();
          setCurrentTime(currentVideoTime);
          if (currentVideoTime >= duration && duration > 0) {
            setIsVideoCompleted(true);
            setIsPlaying(false);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, isVideoCompleted]);

  const handlePlayPause = () => {
    if (!isVideoCompleted && playerRef.current) {
      isPlaying
        ? playerRef.current.pauseVideo()
        : playerRef.current.playVideo();
    }
  };
  const handleMute = () => {
    if (playerRef.current) {
      isMuted ? playerRef.current.unMute() : playerRef.current.mute();
      setIsMuted(!isMuted);
    }
  };
  const handleFullscreen = () => {
    if (playerRef.current?.getIframe) {
      const iframe = playerRef.current.getIframe();
      if (iframe.requestFullscreen) iframe.requestFullscreen();
    }
  };
  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => onComplete(), 1500);
  };
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Voltar aos Módulos</span>
              <span className="sm:hidden">Voltar</span>
            </button>
            <div className="text-center flex-1 sm:flex-none">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                {moduleData.title}
              </h1>
              <p className="text-blue-200 text-sm sm:text-base hidden sm:block">
                {moduleData.description}
              </p>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="text-blue-200 text-sm">
                Progresso: {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {!isCompleted ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <div
                    id="youtube-player"
                    className="absolute top-0 left-0 w-full h-full"
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full z-10"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 z-20">
                  <div className="w-full bg-white/20 rounded-full h-1 sm:h-1.5 mb-2 sm:mb-3">
                    <div
                      className="bg-red-500 h-1 sm:h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <button
                        onClick={handlePlayPause}
                        disabled={isVideoCompleted}
                        className="text-white hover:text-blue-400 transition-colors duration-300 disabled:opacity-50 p-1"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </button>
                      <button
                        onClick={handleMute}
                        className="text-white hover:text-blue-400 transition-colors duration-300 p-1"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </button>
                      <span className="text-white text-xs sm:text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      {isVideoCompleted && (
                        <div className="flex items-center space-x-1 sm:space-x-2 text-green-400">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                            Vídeo Concluído
                          </span>
                          <span className="text-xs font-medium sm:hidden">
                            OK
                          </span>
                        </div>
                      )}
                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-blue-400 transition-colors duration-300 p-1"
                        title="Tela Cheia"
                      >
                        <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mb-6 sm:mb-8 px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Vídeo de Treinamento - {moduleData.title}
              </h2>
              <p className="text-blue-200 mb-4 sm:mb-6 text-sm sm:text-base">
                Assista ao vídeo completo para prosseguir para o próximo módulo.
              </p>
              {!isVideoCompleted && (
                <div className="bg-blue-900/30 rounded-xl p-3 sm:p-4 border border-blue-500/30">
                  <p className="text-blue-100 text-xs sm:text-sm">
                    ⚠️ Você deve assistir ao vídeo completo para desbloquear o
                    próximo módulo.
                    <span className="hidden sm:inline">
                      {" "}
                      Os controles de velocidade e avanço estão desabilitados.
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center px-4">
              <button
                onClick={handleComplete}
                disabled={!isVideoCompleted}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                <span>Concluir Módulo</span>
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center mx-4">
            <div className="flex justify-center mb-4 sm:mb-6">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Módulo Concluído!
            </h2>
            <p className="text-blue-200 mb-6 sm:mb-8 text-sm sm:text-base">
              Parabéns! Você concluiu com sucesso o módulo {moduleData.title}.
            </p>
            <div className="animate-pulse">
              <p className="text-green-400 font-medium text-sm sm:text-base">
                Redirecionando...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
