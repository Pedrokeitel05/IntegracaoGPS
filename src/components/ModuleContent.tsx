import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';

interface ModuleContentProps {
  moduleId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function ModuleContent({ moduleId, onComplete, onBack }: ModuleContentProps) {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getModuleData = (id: string) => {
    const modules = {
      hr: {
        title: 'Recursos Humanos',
        description: 'Conheça a cultura, valores e políticas da empresa GPS Group.',
      },
      quality: {
        title: 'Garantia de Qualidade',
        description: 'Aprenda sobre nossos padrões de qualidade e processos de melhoria contínua.',
      },
      safety: {
        title: 'Segurança do Trabalho e Meio Ambiente',
        description: 'Protocolos de segurança e responsabilidade ambiental.',
      },
      benefits: {
        title: 'Benefícios',
        description: 'Conheça todos os benefícios e vantagens oferecidos aos funcionários.',
      },
      'asset-protection': {
        title: 'Proteção de Ativos',
        description: 'Fundamentos de segurança e proteção patrimonial.',
      },
      infrastructure: {
        title: 'Serviços de Infraestrutura',
        description: 'Padrões de limpeza e manutenção de infraestrutura.',
      },
      'hospital-care': {
        title: 'Cuidados Hospitalares',
        description: 'Protocolos especializados para ambientes hospitalares.',
      },
    };

    return modules[id as keyof typeof modules] || modules.hr;
  };

  const moduleData = getModuleData(moduleId);

  // Simular controle do vídeo do YouTube
  useEffect(() => {
    // Simular duração do vídeo (em segundos)
    setDuration(180); // 3 minutos como exemplo
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isVideoCompleted) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            setIsVideoCompleted(true);
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, isVideoCompleted]);

  const handlePlayPause = () => {
    if (!isVideoCompleted) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Cabeçalho */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar aos Módulos</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{moduleData.title}</h1>
              <p className="text-blue-200">{moduleData.description}</p>
            </div>

            <div className="text-right">
              <div className="text-blue-200 text-sm">
                Progresso: {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
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

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {!isCompleted ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Player de Vídeo */}
            <div className="mb-8">
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Iframe do YouTube com tela cheia habilitada */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    ref={iframeRef}
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/2SNsiRGhWPs?enablejsapi=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&autoplay=0"
                    title="Vídeo de Treinamento GPS Group"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen={true}
                  ></iframe>
                  
                  {/* Overlay de controles customizados */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Barra de Progresso do Vídeo */}
                    <div className="w-full bg-white/20 rounded-full h-1 mb-3">
                      <div 
                        className="bg-red-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    {/* Controles */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayPause}
                          disabled={isVideoCompleted}
                          className="text-white hover:text-blue-400 transition-colors duration-300 disabled:opacity-50"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>
                        
                        <button
                          onClick={handleMute}
                          className="text-white hover:text-blue-400 transition-colors duration-300"
                        >
                          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </button>
                        
                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {isVideoCompleted && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Vídeo Concluído</span>
                          </div>
                        )}
                        
                        <button
                          onClick={handleFullscreen}
                          className="text-white hover:text-blue-400 transition-colors duration-300"
                          title="Tela Cheia"
                        >
                          <Maximize className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Módulo */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Vídeo de Treinamento - {moduleData.title}
              </h2>
              <p className="text-blue-200 mb-6">
                Assista ao vídeo completo para prosseguir para o próximo módulo.
              </p>
              
              {!isVideoCompleted && (
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-blue-100 text-sm">
                    ⚠️ Você deve assistir ao vídeo completo para desbloquear o próximo módulo.
                    Os controles de velocidade e avanço estão desabilitados.
                  </p>
                </div>
              )}
            </div>

            {/* Botão de Conclusão */}
            <div className="flex justify-center">
              <button
                onClick={handleComplete}
                disabled={!isVideoCompleted}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Concluir Módulo</span>
                <CheckCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Módulo Concluído!</h2>
            <p className="text-blue-200 mb-8">
              Parabéns! Você concluiu com sucesso o módulo {moduleData.title}.
            </p>
            <div className="animate-pulse">
              <p className="text-green-400 font-medium">Redirecionando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}