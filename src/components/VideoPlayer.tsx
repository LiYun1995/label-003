import { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from 'lucide-react';
import { useState } from 'react';
import type { Video } from '@/types';

interface VideoPlayerProps {
  video: Video | null;
  chapterTitle?: string;
  onComplete?: () => void;
}

export default function VideoPlayer({ video, chapterTitle, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [video?.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!video) {
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Play size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500">选择左侧章节开始学习</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chapterTitle && (
        <div>
          <h2 className="text-xl font-bold text-slate-800">{video.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{chapterTitle}</p>
        </div>
      )}

      <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onClick={togglePlay}
          poster=""
        />

        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play size={28} className="text-slate-800 ml-1" />
            </div>
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs text-white/80">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer">
              <div
                className="h-full bg-accent-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-white/80">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-accent-400 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:text-accent-400 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
            <button className="text-white/70 hover:text-white transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {video.isCompleted && (
        <div className="flex items-center gap-2 text-sm text-accent-600 bg-accent-50 px-4 py-2 rounded-lg">
          <span className="w-2 h-2 bg-accent-500 rounded-full" />
          已完成学习
        </div>
      )}
    </div>
  );
}
