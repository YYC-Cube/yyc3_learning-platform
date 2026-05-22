import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import { LessonPlayer } from './LessonPlayer';
import { Breadcrumbs } from './Breadcrumbs';
import { detailedModules } from '../data/modulesData';
import { defaultAvatarAsset } from '../services/apiService';
import { 
  ArrowLeft,
  Play, 
  Clock, 
  Users,
  Video,
  CheckCircle,
  Star,
  BookOpen,
  Award,
  Target,
  ShieldCheck,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';
import type { DetailedModule } from '../types';

interface ModulePageProps {
  moduleId: string;
  onBack: () => void;
  onStartLesson: (lessonId: string) => void;
  isMobile?: boolean;
}

export function ModulePage({ moduleId, onBack, onStartLesson, isMobile = false }: ModulePageProps) {
  const { t, language } = useLanguage();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  const module: DetailedModule | undefined = detailedModules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="p-8 text-center font-inter h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">{language === 'zh' ? '未找到模块' : 'Module non trouvé'}</h2>
        <Button onClick={onBack} variant="outline" className="border-white/10 text-slate-400 rounded-2xl px-8 hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
      </div>
    );
  }

  if (activeLessonId) {
    return (
      <LessonPlayer 
        moduleId={moduleId}
        lessonId={activeLessonId}
        lessons={module.lessons}
        moduleTitle={module.title}
        onBack={() => setActiveLessonId(null)}
      />
    );
  }

  const getLevelColor = (level: string) => {
    if (level.includes('初级')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (level.includes('高级')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className={`${isMobile ? 'space-y-6' : 'space-y-8'} font-inter pb-20`}>
      <Breadcrumbs 
        items={[
          { label: '商业智库', onClick: onBack },
          { label: module.category, onClick: onBack },
          { label: module.title, active: true }
        ]}
        predictions={[
          { label: '关联：全栈实战', subLabel: '系统闭环进阶', depth: 2 },
          { label: '延伸：商业画布', subLabel: '战略逻辑构建', depth: 1 }
        ]}
        onPredictionClick={(path) => console.log('Prediction:', path)}
      />
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center"
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl px-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
      </motion.div>

      <div className="bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className={`${isMobile ? 'block' : 'lg:flex'}`}>
          <div className={`${isMobile ? 'h-64' : 'lg:w-2/5 lg:min-h-[500px]'} relative group overflow-hidden`}>
            <ImageWithFallback
              src={module.thumbnail}
              alt={module.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-blue-600 text-white rounded-3xl w-24 h-24 p-0 hover:bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-white/10"
                  onClick={() => setActiveLessonId(module.lessons[0].id)}
                >
                   <Play className="w-10 h-10 ml-1 fill-current" />
                </Button>
              </motion.div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">内容</p>
                      <p className="text-white font-black text-sm">{module.lessonsCount} 课时</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">时长</p>
                      <p className="text-white font-black text-sm">{module.duration}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className={`${isMobile ? 'p-8' : 'lg:w-3/5 p-12'} flex flex-col justify-center`}>
            <div className="mb-8 flex flex-wrap gap-3">
              <Badge variant="outline" className={`${getLevelColor(module.level)} border-2 uppercase font-black tracking-[0.15em] text-[9px] px-3 py-1.5 rounded-xl`}>
                {module.level}
              </Badge>
              <Badge className="bg-white/5 border border-white/10 text-slate-300 uppercase font-black tracking-[0.15em] text-[9px] px-3 py-1.5 rounded-xl">
                {module.category.toUpperCase()}
              </Badge>
            </div>

            <h1 className={`text-white mb-4 font-black tracking-tight leading-tight ${isMobile ? 'text-3xl' : 'text-6xl'}`}>
              {module.title}
            </h1>
            <p className={`text-slate-400 mb-10 leading-relaxed font-medium ${isMobile ? 'text-base' : 'text-xl'}`}>
              {module.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => setActiveLessonId(module.lessons[0].id)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-8 rounded-[1.5rem] text-sm shadow-xl shadow-blue-600/20 border-b-4 border-blue-800 transition-all active:border-b-0 active:translate-y-1"
              >
                {t('unlock')} • {module.price}€
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="sm:w-auto px-10 border-white/10 text-white font-black uppercase tracking-widest py-8 rounded-[1.5rem] text-sm hover:bg-white/5"
              >
                观看预告片
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? 'block space-y-8' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
        <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-8`}>
          <div className="bg-[#0F172A]/30 border border-white/5 rounded-[2rem] p-8 md:p-10">
            <h3 className="text-xl text-white font-black tracking-widest uppercase mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              模块概览
            </h3>
            <div className="space-y-8">
              <p className="text-slate-400 text-lg leading-relaxed">{module.description}</p>
              
              <div>
                <h4 className="text-sm text-slate-500 font-black uppercase tracking-[0.2em] mb-6">核心收获</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {module.keyPoints.map((point, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-[#020617]/40 border border-white/5 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-slate-300 text-sm font-bold leading-relaxed">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A]/30 border border-white/5 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-indigo-400" />
                </div>
                课程目录
              </h3>
              <Badge className="bg-white/5 text-slate-400 border border-white/10 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest">
                {module.lessonsCount} 章节
              </Badge>
            </div>
            
            <div className="space-y-4">
              {module.lessons.map((lesson, index) => (
                <motion.div 
                  key={lesson.id} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group flex items-center justify-between p-6 bg-[#020617]/50 border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer"
                  onClick={() => setActiveLessonId(lesson.id)}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-slate-800 group-hover:text-blue-500/40 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors mb-1">{lesson.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-blue-400 text-[9px] font-black uppercase tracking-widest">视频课程</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <Play className="w-4 h-4 text-slate-400 group-hover:text-white ml-0.5 fill-current" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#0F172A]/60 to-[#020617] border border-white/5 rounded-[2rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16" />
            <h3 className="text-xs text-slate-500 font-black tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
              <Users size={14} className="text-blue-400" />
              主讲导师
            </h3>
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-2 border-white/5 p-1">
                   <ImageWithFallback src={module.instructor.avatar || defaultAvatarAsset} alt={module.instructor.name} className="rounded-xl object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center border-4 border-[#0F172A] shadow-lg">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <div>
                <h4 className="text-white text-lg font-black tracking-tight">{module.instructor.name}</h4>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">{module.instructor.title}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              {module.instructor.experience}
            </p>
          </div>

          <div className="bg-[#0F172A]/30 border border-white/5 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xs text-slate-500 font-black tracking-[0.3em] uppercase mb-6">技术规格</h3>
            {[
              { label: '难度系数', value: module.level, icon: Target, color: 'text-blue-400' },
              { label: '认证证书', value: 'Pro 级认证', icon: Award, color: 'text-emerald-400' },
              { label: '时效性', value: '永久有效', icon: ShieldCheck, color: 'text-blue-400' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-500 text-[10px] uppercase tracking-widest font-black">{item.label}</span>
                </div>
                <span className={`text-xs font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-600 rounded-[2rem] p-10 text-center shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 border-[20px] border-white/5 rounded-full"
            />
            <div className="relative z-10">
              <Target className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h3 className="text-white text-3xl font-black tracking-tight uppercase mb-4 leading-none">
                开启全能进阶
              </h3>
              <p className="text-blue-100 text-sm mb-10 font-bold opacity-80">
                立即解锁本模块，掌握 2026 最前沿商业增长逻辑。
              </p>
              <Button 
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black uppercase tracking-widest py-8 shadow-xl shadow-black/20 group-hover:scale-105 transition-transform"
              >
                {t('unlock')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}