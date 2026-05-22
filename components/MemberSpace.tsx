import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useLanguage } from './LanguageContext';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  Download, 
  Play,
  Trophy,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface MemberSpaceProps {
  isMobile?: boolean;
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
}

export function MemberSpace({ 
  isMobile = false, 
  breakpoint = 'desktop' 
}: MemberSpaceProps) {
  const { language, t } = useLanguage();
  
  const userProgress = {
    totalModules: 32,
    completedModules: 8,
    inProgressModules: 3,
    totalHours: 156,
    completedHours: 45,
    certificates: 3,
    nextCertificate: "IA Marketing Expert"
  };

  const recentModules = [
    {
      id: 1,
      title: language === 'zh' ? "高级 SEO 技术" : "SEO Technique Avancé",
      category: "SEO",
      completedAt: "2025-01-20",
      progress: 100,
      duration: "3h 30min",
      status: "completed"
    },
    {
      id: 2,
      title: language === 'zh' ? "情感文案策划" : "Copywriting Émotionnel",
      category: "Copywriting",
      completedAt: null,
      progress: 65,
      duration: "2h 45min",
      status: "in-progress"
    },
    {
      id: 3,
      title: language === 'zh' ? "个人品牌打造" : "Branding Personnel",
      category: "Branding",
      completedAt: "2025-01-18",
      progress: 100,
      duration: "4h 15min",
      status: "completed"
    }
  ];

  const certificates = [
    {
      id: 1,
      title: language === 'zh' ? "电商专家" : "Expert E-commerce",
      earnedAt: "2025-01-15",
      modules: 6,
      badge: "🏆"
    },
    {
      id: 2,
      title: language === 'zh' ? "SEO 大师" : "Maître SEO",
      earnedAt: "2025-01-10",
      modules: 4,
      badge: "🎯"
    }
  ];

  const getGridCols = () => {
    switch (breakpoint) {
      case 'mobile': return 'grid-cols-2';
      case 'tablet': return 'grid-cols-2 md:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-4';
    }
  };

  return (
    <div className="space-y-8 font-inter">
      {/* Stats Board */}
      <div className={`grid ${getGridCols()} gap-6`}>
        {[
          { label: language === 'zh' ? '总进度' : 'Progression', value: `${Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: language === 'zh' ? '已修模块' : 'Modules', value: `${userProgress.completedModules}/${userProgress.totalModules}`, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: language === 'zh' ? '累计时长' : 'Temps', value: `${userProgress.completedHours}h`, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: language === 'zh' ? '专业认证' : 'Certificats', value: userProgress.certificates, icon: Award, color: 'text-blue-400', bg: 'bg-blue-600/10' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] flex flex-col items-center text-center group hover:border-blue-500/20 transition-all shadow-xl"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
        {/* Recent Learning Section */}
        <Card className="bg-[#0F172A]/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 md:p-10 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-white font-black tracking-widest text-xl uppercase flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                 <Sparkles size={16} className="text-blue-400" />
               </div>
               {language === 'zh' ? '最近学习' : 'Récemment appris'}
            </CardTitle>
            <Button variant="ghost" className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              View History
            </Button>
          </CardHeader>
          <CardContent className="p-8 md:p-10 space-y-6">
            {recentModules.map((module) => (
              <div key={module.id} className="group p-6 bg-[#020617]/40 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-1">
                    <h4 className="text-white font-black group-hover:text-blue-400 transition-colors">{module.title}</h4>
                    <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black">{module.category}</p>
                  </div>
                  <Badge className={`rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-widest ${module.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {module.status === 'completed' ? (language === 'zh' ? '已达成' : 'Terminé') : (language === 'zh' ? '深造中' : 'En cours')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${module.progress}%` }}
                      className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Honors & Certs Section */}
        <Card className="bg-[#0F172A]/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 md:p-10 border-b border-white/5">
            <CardTitle className="text-white font-black tracking-widest text-xl uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Trophy size={16} className="text-indigo-400" />
              </div>
              {language === 'zh' ? '我的荣誉' : 'Mes Honneurs'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-10 space-y-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-6 bg-gradient-to-r from-blue-600/5 to-transparent border border-white/5 rounded-3xl flex items-center justify-between group hover:border-blue-500/20 transition-all">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                    {cert.badge}
                  </div>
                  <div>
                    <h4 className="text-white font-black">{cert.title}</h4>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">ISSUED {cert.earnedAt}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="w-12 h-12 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-white/5">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            ))}
            
            <div className="mt-8 p-8 bg-[#020617]/60 border border-blue-500/20 rounded-[2rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-8 -mt-8" />
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-5">
                   <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                     <Target className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                     <h4 className="text-white font-black text-sm uppercase tracking-widest">{language === 'zh' ? '下一个里程碑' : 'Prochain Objectif'}</h4>
                     <p className="text-blue-400/80 text-xs font-bold mt-1 uppercase tracking-tight">{userProgress.nextCertificate}</p>
                   </div>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
