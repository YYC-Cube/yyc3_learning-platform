import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowUpRight, 
  Clock, 
  ChevronRight, 
  Trophy, 
  Monitor,
  Video,
  Play,
  Star,
  Sparkles,
  BarChart3,
  Calendar,
  Activity,
  Target,
  Brain
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip
} from 'recharts';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useChartReady } from '../hooks/useChartReady';
import { toast } from 'sonner';
import type { ModuleCardData, Breakpoint, StatCard, RadarDataPoint, ActivityDataPoint } from '../types';

interface UserDashboardProps {
  activeCategory: string;
  modules: ModuleCardData[];
  onModuleClick: (id: string) => void;
  isMobile: boolean;
  breakpoint: Breakpoint;
  onNavigate?: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  activeCategory, 
  modules, 
  onModuleClick, 
  isMobile,
  breakpoint,
  onNavigate
}) => {
  const { t } = useLanguage();
  const { containerRef: radarRef, isReady: radarReady } = useChartReady();
  const { containerRef: activityRef, isReady: activityReady } = useChartReady();

  const radarData: RadarDataPoint[] = [
    { subject: '高并发架构', A: 120, fullMark: 150 },
    { subject: '营销增长', A: 98, fullMark: 150 },
    { subject: '产品设计', A: 86, fullMark: 150 },
    { subject: '商业化', A: 99, fullMark: 150 },
    { subject: '技术领导力', A: 85, fullMark: 150 },
    { subject: '数据科学', A: 65, fullMark: 150 },
  ];

  const activityData: ActivityDataPoint[] = [
    { name: '周一', value: 45 },
    { name: '周二', value: 78 },
    { name: '周三', value: 56 },
    { name: '周四', value: 92 },
    { name: '周五', value: 64 },
    { name: '周六', value: 85 },
    { name: '周日', value: 72 },
  ];

  const stats: StatCard[] = [
    { label: '已修学分', value: '128', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '学习时长', value: '42h', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: '周排名', value: 'Top 2%', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: '解锁模块', value: '05', icon: Monitor, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Hero */}
      <section className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 blur-[100px] opacity-50 pointer-events-none" />
        <div className={`bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] ${isMobile ? 'p-6' : 'rounded-[3rem] p-10 md:p-16'} flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden`}>
          <div className="flex-1 space-y-4 md:space-y-6 relative z-10">
            <div className="flex items-center gap-3">
               <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg shadow-blue-600/30">{t('welcome')}</span>
               <div className="h-px w-12 bg-white/10" />
            </div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-black text-white tracking-tight leading-none italic uppercase`}>
               开启您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">2026增长之旅</span>
            </h1>
            <p className={`text-slate-400 ${isMobile ? 'text-sm' : 'text-lg md:text-xl'} font-medium max-w-2xl leading-relaxed`}>
              基于 YYC3 极简高端方法论，我们为您定制了针对高并发架构与全链路营销的沉浸式实战路线。
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <button 
                onClick={() => {
                  if (modules.length > 0) {
                    onModuleClick(modules[0].id);
                  } else {
                    toast.info('暂无可继续的课程');
                  }
                }}
                className={`${isMobile ? 'px-6 py-3 text-[10px]' : 'px-10 py-4 text-xs'} bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-2`}
              >
                继续学习 <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => onNavigate?.('roadmap')}
                className={`${isMobile ? 'px-6 py-3 text-[10px]' : 'px-10 py-4 text-xs'} bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest`}
              >
                浏览路线图
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-80 space-y-4">
             <div className="bg-[#020617]/60 border border-white/5 p-8 rounded-[2.5rem] relative group/card hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                   <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                      <BarChart3 size={24} />
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">学习进度</span>
                      <p className="text-xl font-black text-white">68%</p>
                   </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '68%' }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]" 
                   />
                </div>
                <p className="text-[9px] text-slate-500 font-bold text-center mt-4">预计 4 天内完成当前阶段</p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0F172A]/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 group hover:border-blue-500/20 transition-all"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
               <stat.icon size={28} />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Capabilities & Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart: Ability Diagnosis */}
        <section className="lg:col-span-7 bg-[#0F172A]/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Brain size={20} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight italic">能力模型诊断</h2>
            </div>
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest border border-blue-400/20 px-3 py-1 rounded-full">实战评估版</span>
          </div>

          <div ref={radarRef} className="relative h-[350px] w-full min-w-0 flex items-center justify-center">
            {radarReady ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                  />
                  <Radar
                    name="言语"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">最强项</p>
                <p className="text-sm font-black text-blue-400">高并发架构</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">待提升</p>
                <p className="text-sm font-black text-indigo-400">数据科学</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                <button 
                  onClick={() => {
                    onNavigate?.('profile');
                    toast.info('正在生成深度能力报告...', { description: '请前往个人中心查看完整分析' });
                  }}
                  className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  深度报告 <ArrowUpRight size={12} />
                </button>
             </div>
          </div>
        </section>

        {/* Learning Activity */}
        <section className="lg:col-span-5 bg-[#0F172A]/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight italic">活跃度分析</h2>
          </div>

          <div ref={activityRef} className="relative h-[250px] w-full min-w-0 mt-auto flex items-center justify-center">
             {activityReady ? (
               <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <AreaChart data={activityData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" hide />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#818cf8', fontWeight: 900, fontSize: '10px' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="value" 
                       stroke="#6366f1" 
                       fillOpacity={1} 
                       fill="url(#colorValue)" 
                       strokeWidth={3}
                     />
                  </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />
             )}
          </div>

          <div className="space-y-4 mt-8">
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Target size={16} />
                   </div>
                   <span className="text-[10px] text-white font-black uppercase tracking-widest">本周目标完成度</span>
                </div>
                <span className="text-sm font-black text-emerald-400">92%</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Calendar size={16} />
                   </div>
                   <span className="text-[10px] text-white font-black uppercase tracking-widest">下个里程碑</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">2月7日 架构周</span>
             </div>
          </div>
        </section>
      </div>

      {/* Recommended Modules */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div>
             <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
               精选实战模块 <Sparkles className="text-blue-500" size={24} />
             </h2>
             <p className="text-slate-500 text-sm mt-1 font-medium">根据您的学习历史推荐的 Top 级实操内容</p>
          </div>
          <button 
            onClick={() => onNavigate?.('courses')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
          >
            {t('all_modules')} <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.slice(0, 3).map((module) => (
            <motion.div 
              key={module.id}
              whileHover={{ y: -10 }}
              onClick={() => onModuleClick(module.id)}
              className="bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl hover:border-blue-500/30 transition-all"
            >
              <div className="h-64 relative overflow-hidden">
                <ImageWithFallback src={module.thumbnail} alt={module.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                
                {module.isPromoted && (
                   <div className="absolute top-6 left-6 flex items-center gap-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl">
                      <Star size={12} className="fill-current" />
                      官方推荐
                   </div>
                )}
                
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex items-center gap-3 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Play size={16} className="fill-current ml-0.5" />
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">立即进入</p>
                         <p className="text-xs font-black uppercase tracking-tight">沉浸式学习</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight uppercase group-hover:text-blue-400 transition-colors">{module.title}</h3>
                    <p className="text-slate-500 text-xs font-medium mt-1">{module.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Video size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{module.lessonsCount} 课时</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{module.duration}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-lg border border-white/10 font-black uppercase tracking-widest">{module.level}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};