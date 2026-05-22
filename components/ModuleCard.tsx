import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import { CheckCircle, Clock, Play, Lock, ArrowRight, Video } from 'lucide-react';
import type { ModuleCardData, Breakpoint } from '../types';

interface ModuleCardProps {
  module: ModuleCardData;
  onModuleClick: (moduleId: string) => void;
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

export function ModuleCard({ 
  module, 
  onModuleClick, 
  isMobile = false, 
  breakpoint = 'desktop' 
}: ModuleCardProps) {
  const { t, language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'unlocked':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'locked':
        return 'bg-slate-800/40 text-slate-500 border border-white/5';
      default:
        return 'bg-slate-800/40 text-slate-500 border border-white/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return language === 'zh' ? '已达成' : 'Terminé';
      case 'in-progress': return language === 'zh' ? '正在深造' : 'En cours';
      case 'unlocked': return language === 'zh' ? '已开放' : 'Débloqué';
      default: return language === 'zh' ? '尚未解锁' : 'Verrouillé';
    }
  };

  const getLevelColor = (level: string) => {
    if (level.includes('Débutant') || level.includes('初级')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (level.includes('Confirmé') || level.includes('高级')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={10} />;
      case 'in-progress': return <Clock size={10} />;
      case 'unlocked': return <Play size={10} />;
      default: return <Lock size={10} />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/40 transition-all duration-500 cursor-pointer group overflow-hidden shadow-2xl rounded-[2rem] relative h-full flex flex-col"
      onClick={() => onModuleClick(module.id)}
    >
      {/* Visual Header */}
      <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-52'}`}>
        <ImageWithFallback
          src={module.thumbnail}
          alt={module.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className={`${getStatusColor(module.status)} font-black text-[8px] uppercase tracking-widest px-2.5 py-1.5 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-1.5`}>
            {getStatusIcon(module.status)}
            {getStatusText(module.status)}
          </Badge>
          <Badge variant="outline" className={`${getLevelColor(module.level)} font-black text-[8px] uppercase tracking-widest px-2.5 py-1.5 rounded-xl border backdrop-blur-md`}>
            {module.level}
          </Badge>
        </div>

        {/* Hover Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Play className="w-5 h-5 fill-current ml-0.5" />
           </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-1">
             <div className="h-1 w-6 bg-blue-500 rounded-full" />
             <span className="text-blue-400 text-[9px] font-black uppercase tracking-widest">{module.category}</span>
          </div>
          <h3 className="text-white group-hover:text-blue-400 transition-colors font-black text-xl tracking-tight leading-tight">
            {module.title}
          </h3>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">
            {module.subtitle}
          </p>
        </div>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-white/5">
           <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                 <Video size={12} className="text-blue-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{module.lessonsCount} {language === 'zh' ? '课时' : 'Leçons'}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                 <Clock size={12} className="text-indigo-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{module.duration}</span>
           </div>
        </div>

        {/* Progress if active */}
        {module.status === 'in-progress' && module.progress !== undefined && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
              <span className="text-slate-500">{t('progress')}</span>
              <span className="text-blue-400">{module.progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${module.progress}%` }}
                 className="h-full bg-blue-500"
               />
            </div>
          </div>
        )}

        <Button 
          variant="ghost"
          className="w-full group/btn flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl bg-white/5 hover:bg-blue-600 transition-all border border-white/5 hover:border-blue-500"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onModuleClick(module.id);
          }}
        >
          {module.status === 'locked' ? t('unlock') : 'Continue Learning'}
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}