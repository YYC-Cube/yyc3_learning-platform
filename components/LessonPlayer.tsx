import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2,
  VolumeX,
  Maximize, 
  SkipBack, 
  SkipForward, 
  Settings,
  FileText,
  Save,
  CheckCircle,
  MessageSquare,
  History,
  Info,
  ChevronRight,
  Monitor,
  Award,
  RotateCcw
} from 'lucide-react';
import { YYC3API } from '../services/apiService';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import type { Lesson } from '../types';

// Sample video URLs for demo (public domain videos)
const SAMPLE_VIDEOS: Record<string, string> = {
  '1': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  '3': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '4': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  '5': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
};

interface LessonPlayerProps {
  moduleId: string;
  lessonId: string;
  onBack: () => void;
  moduleTitle: string;
  lessons: Lesson[];
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ moduleId, lessonId, onBack, moduleTitle, lessons }) => {
  const { t } = useLanguage();
  const { userId } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'info' | 'curriculum'>('notes');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const [resumePosition, setResumePosition] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lesson = lessons.find(l => l.id === lessonId) || lessons[0];
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const videoSrc = SAMPLE_VIDEOS[lessonId] || SAMPLE_VIDEOS['1'];

  // Fetch initial notes + video progress on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [notesData, videoProgress] = await Promise.all([
          YYC3API.getLessonNotes(lessonId),
          YYC3API.getVideoProgress(userId || 'default', moduleId, lessonId),
        ]);
        setNotes(notesData.notes || '');
        if (videoProgress && videoProgress.currentTime > 0 && !videoProgress.completed) {
          setResumePosition(videoProgress.currentTime);
        }
        if (videoProgress?.completed) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error('Init lesson data failed:', err);
      }
    };
    init();
    return () => {
      if (progressSaveRef.current) clearInterval(progressSaveRef.current);
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    };
  }, [lessonId, moduleId, userId]);

  // Resume from saved position
  const handleResumePlayback = useCallback(() => {
    if (videoRef.current && resumePosition) {
      videoRef.current.currentTime = resumePosition;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setResumePosition(null);
      toast.success(`从 ${formatTime(resumePosition)} 处继续播放`);
    }
  }, [resumePosition]);

  // Dismiss resume and start from beginning
  const handleStartFromBeginning = useCallback(() => {
    setResumePosition(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  // Activity tracking: Save 1 minute of learning every 60 seconds of playtime
  useEffect(() => {
    if (isPlaying) {
      activityTimerRef.current = setInterval(async () => {
        try {
          const date = new Date().toISOString().split('T')[0];
          await YYC3API.recordActivity(date, 1, userId || 'default');
        } catch (err) {
          console.error('Activity track failed', err);
        }
      }, 60000);
    } else {
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    }
    return () => {
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    };
  }, [isPlaying, userId]);

  // Auto-save video progress every 10 seconds during playback
  useEffect(() => {
    if (isPlaying && duration > 0) {
      progressSaveRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        const ct = videoRef.current.currentTime;
        const pct = Math.round((ct / duration) * 100);
        const completed = pct >= 90;
        try {
          await YYC3API.saveVideoProgress({
            userId: userId || 'default',
            moduleId,
            lessonId,
            currentTime: ct,
            duration,
            percentWatched: pct,
            completed,
          });
          if (completed && !isCompleted) {
            setIsCompleted(true);
            setShowCompletionBanner(true);
            toast.success('🎉 课程已完成！进度已自动保存');
            setTimeout(() => setShowCompletionBanner(false), 5000);
          }
        } catch (err) {
          console.error('Video progress save failed:', err);
        }
      }, 10000);
    } else {
      if (progressSaveRef.current) clearInterval(progressSaveRef.current);
    }
    return () => {
      if (progressSaveRef.current) clearInterval(progressSaveRef.current);
    };
  }, [isPlaying, duration, moduleId, lessonId, userId, isCompleted]);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await YYC3API.saveLessonNotes(lessonId, notes);
      setLastSaved(new Date());
      toast.success('笔记已同步至云端');
    } catch {
      toast.error('同步失败，请检查网络');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save notes after 5s of inactivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (notes.length > 0) handleSaveNotes();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [notes]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
  };

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (container?.requestFullscreen) {
      container.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const percentWatched = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors active:scale-95"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:inline">{moduleTitle}</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Monitor size={14} />
          <span>{lesson?.title || '课程'}</span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-400 ml-2">
              <CheckCircle size={12} />
              <span className="text-[10px] font-bold">已完成</span>
            </span>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {showCompletionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border-b border-emerald-500/30 px-4 py-3 flex items-center justify-center gap-3"
          >
            <Award size={20} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">恭喜完成本课！进度已自动同步。</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 p-0 lg:p-6">
        {/* Video Player Area */}
        <div className="flex-1">
          <div className="relative aspect-video bg-slate-950 lg:rounded-2xl overflow-hidden group">
            {/* HTML5 Video */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain bg-black"
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onDurationChange={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              onEnded={() => {
                setIsPlaying(false);
                // Save final progress
                YYC3API.saveVideoProgress({
                  userId: userId || 'default',
                  moduleId,
                  lessonId,
                  currentTime: duration,
                  duration,
                  percentWatched: 100,
                  completed: true,
                }).catch(() => {});
                if (!isCompleted) {
                  setIsCompleted(true);
                  setShowCompletionBanner(true);
                  setTimeout(() => setShowCompletionBanner(false), 5000);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
              preload="metadata"
            />

            {/* Resume from position overlay */}
            <AnimatePresence>
              {resumePosition !== null && !isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="text-center space-y-4">
                    <RotateCcw size={32} className="text-blue-400 mx-auto" />
                    <p className="text-white font-bold">上次观看到 {formatTime(resumePosition)}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleResumePlayback}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors"
                      >
                        继续播放
                      </button>
                      <button
                        onClick={handleStartFromBeginning}
                        className="px-6 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
                      >
                        从头开始
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Play button overlay when paused */}
            {!isPlaying && resumePosition === null && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-5"
                onClick={togglePlay}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/30"
                >
                  <Play size={32} className="text-white ml-1" />
                </motion.div>
              </div>
            )}

            {/* Progress bar (clickable) */}
            <div 
              className="absolute bottom-12 left-0 right-0 h-1.5 bg-slate-800 cursor-pointer group/progress opacity-0 group-hover:opacity-100 transition-opacity z-20"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 relative"
                style={{ width: `${percentWatched}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
              {/* 90% completion marker */}
              <div className="absolute top-0 h-full w-px bg-emerald-500/50" style={{ left: '90%' }} />
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="hover:text-blue-400 transition-colors active:scale-90"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={() => skip(-10)} className="hover:text-blue-400 transition-colors">
                    <SkipBack size={18} />
                  </button>
                  <button onClick={() => skip(10)} className="hover:text-blue-400 transition-colors">
                    <SkipForward size={18} />
                  </button>
                  <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-blue-500"
                  />
                  <span className="text-xs text-slate-400 ml-2 font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {Math.round(percentWatched)}%
                  </span>
                  <button onClick={handleFullscreen} className="hover:text-blue-400 transition-colors">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson title below video */}
          <div className="px-4 lg:px-0 py-4">
            <h2 className="text-xl font-bold text-white">{lesson?.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <History size={14} />
                {lesson?.duration}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle size={14} />
                  已完成
                </span>
              )}
              {duration > 0 && (
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  观看 {Math.round(percentWatched)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5">
          {/* Tab buttons */}
          <div className="flex border-b border-white/5">
            {[
              { key: 'notes' as const, label: '笔记', icon: FileText },
              { key: 'curriculum' as const, label: '目录', icon: MessageSquare },
              { key: 'info' as const, label: '信息', icon: Info },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key 
                    ? 'text-blue-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.key && (
                  <motion.div 
                    layoutId="lesson-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 min-h-[300px] max-h-[60vh] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">学习笔记</h3>
                    <button 
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 active:scale-95"
                    >
                      <Save size={12} />
                      {isSaving ? '保存中...' : '保存'}
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="在这里记录学习笔记... 支持 Markdown 语法"
                    className="w-full h-48 bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                  {lastSaved && (
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <CheckCircle size={10} />
                      上次保存: {lastSaved.toLocaleTimeString('zh-CN')}
                    </p>
                  )}
                </motion.div>
              )}

              {activeTab === 'curriculum' && (
                <motion.div
                  key="curriculum"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-1"
                >
                  <h3 className="text-sm font-semibold text-white mb-3">课程目录</h3>
                  {lessons.map((l, idx) => (
                    <div
                      key={l.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        l.id === lessonId 
                          ? 'bg-blue-500/10 border border-blue-500/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        l.isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : l.id === lessonId 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-slate-800 text-slate-500'
                      }`}>
                        {l.isCompleted ? <CheckCircle size={14} /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${l.id === lessonId ? 'text-white font-medium' : 'text-slate-400'}`}>
                          {l.title}
                        </p>
                        <p className="text-xs text-slate-600">{l.duration}</p>
                      </div>
                      {l.id === lessonId && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                      <ChevronRight size={14} className="text-slate-600" />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-white">课程信息</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">所属模块</p>
                      <p className="text-sm text-white">{moduleTitle}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">课时进度</p>
                      <p className="text-sm text-white">
                        {currentIndex + 1} / {lessons.length} 课时
                      </p>
                      <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">播放进度</p>
                      <p className="text-sm text-white">
                        {Math.round(percentWatched)}% 已观看
                        {isCompleted && <span className="text-emerald-400 ml-2">(已完成)</span>}
                      </p>
                      <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                          style={{ width: `${percentWatched}%` }}
                        />
                        {/* 90% marker */}
                        <div className="absolute top-0 h-full w-px bg-emerald-500/50" style={{ left: '90%' }} />
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">观看 ≥90% 自动标记为完成</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">已完成课时</p>
                      <p className="text-sm text-white">
                        {lessons.filter(l => l.isCompleted).length} / {lessons.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
