import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
  ArrowRight,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  moduleTitle: string;
  onVideoComplete: () => void;
  showStartQuizButton: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({
  videoUrl,
  moduleTitle,
  onVideoComplete,
  showStartQuizButton,
}: VideoPlayerProps) {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);

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
      const videoId = videoUrl?.split("v=")[1]?.split("&")[0];
      if (videoId && document.getElementById("youtube-player")) {
        playerRef.current = new window.YT.Player("youtube-player", {
          height: "100%",
          width: "100%",
          videoId: videoId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            playsinline: 1,
            autoplay: 1,
            fs: 0,
          },
          events: {
            onReady: (e: any) => {
              e.target.playVideo();
              setDuration(e.target.getDuration());
            },
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
    }
  }, [apiReady, videoUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isVideoCompleted && playerRef.current?.getCurrentTime) {
      interval = setInterval(() => {
        const currentVideoTime = playerRef.current.getCurrentTime();
        setCurrentTime(currentVideoTime);
        if (duration > 0 && currentVideoTime >= duration) {
          setIsVideoCompleted(true);
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, isVideoCompleted]);

  const handlePlayPause = () => {
    if (!isVideoCompleted && playerRef.current?.getPlayerState) {
      isPlaying
        ? playerRef.current.pauseVideo()
        : playerRef.current.playVideo();
    }
  };

  const handleMute = () => {
    if (playerRef.current?.isMuted) {
      isMuted ? playerRef.current.unMute() : playerRef.current.mute();
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    const iframe = playerRef.current?.getIframe();
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
          <div
            id="youtube-player"
            className="absolute top-0 left-0 w-full h-full"
          ></div>

          {/* --- A CAMADA DE PROTEÇÃO ESTÁ AQUI --- */}
          <div className="absolute top-0 left-0 w-full h-full z-10"></div>

          {/* --- E OS SEUS CONTROLES CUSTOMIZADOS ESTÃO AQUI --- */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 z-20">
            <div className="w-full bg-white/20 rounded-full h-1 sm:h-1.5 mb-2 sm:mb-3">
              <div
                className="bg-red-500 h-1 sm:h-1.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={handlePlayPause}
                  disabled={isVideoCompleted}
                  className="text-white hover:text-blue-400 disabled:opacity-50 p-1"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>
                <button
                  onClick={handleMute}
                  className="text-white hover:text-blue-400 p-1"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>
                <span className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-blue-400 p-1"
                title="Tela Cheia"
              >
                <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
          Vídeo de Treinamento - {moduleTitle}
        </h2>
        <p className="text-blue-200 mb-6 text-sm sm:text-base max-w-xl mx-auto">
          Assista ao vídeo completo para prosseguir.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onVideoComplete}
            disabled={!isVideoCompleted}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {showStartQuizButton ? (
              <>
                <span>Iniciar Avaliação</span>
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                <span>Concluir Módulo</span>
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
