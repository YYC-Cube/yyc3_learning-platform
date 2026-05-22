import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Award, 
  Target, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Calendar,
  Flame,
  Trophy,
  ChevronRight,
  TrendingUp,
  MapPin,
  Mail,
  Users,
  X,
  FileText,
  BarChart3,
  Lightbulb,
  ArrowRight,
  PieChart,
  ExternalLink,
  Camera,
  Loader2
} from 'lucide-react';
import { YYC3API, defaultAvatarAsset } from '../services/apiService';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Breadcrumbs } from './Breadcrumbs';
import { useChartReady } from '../hooks/useChartReady';
import { toast } from "sonner";
import type { PeerComparisonPoint } from '../types';

// 模拟同行对比数据
const peerComparisonData: PeerComparisonPoint[] = [
  { name: 'Week 1', user: 45, peer: 40 },
  { name: 'Week 2', user: 52, peer: 42 },
  { name: 'Week 3', user: 48, peer: 45 },
  { name: 'Week 4', user: 70, peer: 48 },
  { name: 'Week 5', user: 85, peer: 50 },
  { name: 'Week 6', user: 92, peer: 55 },
];

interface ProfileProps {
  onModuleClick: (id: string) => void;
}

interface ArchitectureDiagramProps {
  code: string;
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ code }) => {
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return <pre className="bg-[#020617] p-4 rounded-xl text-xs text-blue-400 font-mono">{code}</pre>;
  
  const handleNodeClick = (nodeName: string) => {
    toast.info(`正在为您检索: ${nodeName}`, {
      description: `即将进入“${nodeName}”相关的实战知识卡片`,
      className: "bg-[#020617] border border-blue-500/30 text-white rounded-2xl",
    });
  };

  return (
    <div className="bg-[#020617] border border-blue-500/20 rounded-xl p-8 my-4 overflow-x-auto custom-scrollbar">
      <div className="flex flex-col gap-8">
        {lines.map((line, i) => {
          const hasBi = line.includes('<->');
          const hasBack = line.includes('<-') && !hasBi;
          const separator = hasBi ? '<->' : (hasBack ? '<-' : '->');
          
          const parts = line.split(separator).map(p => p.trim().replace(/[\[\]]/g, ''));
          
          return (
            <div key={i} className="flex items-center gap-4 min-w-max">
              {parts.map((node, ni) => (
                <div key={ni} className="contents group/item relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ni * 0.1 }}
                    onClick={() => handleNodeClick(node)}
                    className="px-5 py-3 bg-blue-600/5 border border-blue-500/30 rounded-xl text-[11px] font-black text-blue-400 uppercase tracking-widest shadow-lg shadow-blue-500/5 group/node relative cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/node:opacity-100 transition-opacity rounded-xl" />
                    <div className="flex items-center gap-2">
                       {node}
                       <ExternalLink size={10} className="opacity-0 group-hover/node:opacity-50 transition-opacity" />
                    </div>

                    {/* Rich Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 opacity-0 group-hover/node:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover/node:translate-y-0 z-50">
                      <div className="bg-[#020617] border border-blue-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] text-blue-400 font-black uppercase tracking-tighter">节点状态</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-white font-bold mb-1 leading-tight">实战案例已就绪</p>
                        <div className="flex items-center gap-2 text-[7px] text-slate-500 font-black uppercase tracking-widest">
                          <Clock size={8} /> 2小时前更新
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/5 text-[7px] text-blue-300 italic">
                          点击穿透至“{node}”深度解析
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-[#020617] border-r border-b border-blue-500/40 absolute left-1/2 -translate-x-1/2 -bottom-1 rotate-45" />
                    </div>
                  </motion.div>
                  
                  {ni < parts.length - 1 && (
                    <div className="flex items-center px-2">
                      {(hasBi || hasBack) && (
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-blue-500" />
                      )}
                      <div className="w-10 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                      {(hasBi || !hasBack) && (
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-indigo-500" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">YYC3 V2 拓扑引擎</p>
        <div className="flex gap-4 text-[7px] font-black uppercase tracking-tighter text-slate-500">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 点击节点穿透</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> 知识卡片关联</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Lightweight Markdown-like renderer — replaces react-markdown to avoid
 * heavy Node.js stream dependencies that break in this ESM-only bundler.
 * Supports: fenced code blocks (``` ... ```), inline `code`, **bold**,
 * headings (#), and falls back to <p> paragraphs.
 * Architecture DSL code blocks (```arch) render as <ArchitectureDiagram />.
 */
interface SimpleMarkdownProps {
  text: string;
}

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ text }) => {
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {blocks.map((block, idx) => {
        // Fenced code block
        if (block.startsWith('```') && block.endsWith('```')) {
          const inner = block.slice(3, -3);
          const newlineIdx = inner.indexOf('\n');
          const lang = newlineIdx > 0 ? inner.slice(0, newlineIdx).trim() : '';
          const code = newlineIdx > 0 ? inner.slice(newlineIdx + 1) : inner;

          if (lang === 'arch') {
            return <ArchitectureDiagram key={idx} code={code.replace(/\n$/, '')} />;
          }

          return (
            <pre key={idx} className="bg-[#020617] border border-white/10 rounded-xl p-4 my-3 overflow-x-auto text-xs font-mono text-blue-400">
              <code>{code}</code>
            </pre>
          );
        }

        // Regular text — split into paragraphs and render simple inline elements
        return block
          .split('\n')
          .filter(Boolean)
          .map((line, li) => {
            // Headings
            if (line.startsWith('### ')) return <h3 key={`${idx}-${li}`} className="text-sm font-black text-white mt-3 mb-1">{line.slice(4)}</h3>;
            if (line.startsWith('## ')) return <h2 key={`${idx}-${li}`} className="text-base font-black text-white mt-4 mb-1">{line.slice(3)}</h2>;
            if (line.startsWith('# ')) return <h1 key={`${idx}-${li}`} className="text-lg font-black text-white mt-4 mb-2">{line.slice(2)}</h1>;

            // Inline formatting: **bold** and `code`
            const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
            return (
              <p key={`${idx}-${li}`} className="text-xs text-slate-300 leading-relaxed mb-1.5">
                {parts.map((part, pi) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pi} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={pi} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>;
                  }
                  return <span key={pi}>{part}</span>;
                })}
              </p>
            );
          });
      })}
    </>
  );
};

export const Profile: React.FC<ProfileProps> = ({ onModuleClick }) => {
  const { t } = useLanguage();
  const { userId, userProfile, refreshProfile } = useAuth();
  const { containerRef: peerChartRef, isReady: peerChartReady } = useChartReady();
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ date: string; count: number } | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');

  // Avatar upload
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('仅支持 JPG/PNG/WebP/GIF 格式');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uid = userId || 'default';
      await YYC3API.uploadAvatar(uid, base64, file.type);
      await refreshProfile();
      toast.success('头像更新成功');
    } catch (err) {
      console.error('头像上传失败:', err);
      toast.error('头像上传失败，请稍后重试');
    } finally {
      setIsUploadingAvatar(false);
      // Reset input so same file can be re-selected
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const catchUpStrategy = useMemo(() => {
    const lastPoint = peerComparisonData[peerComparisonData.length - 1];
    const diff = lastPoint.user - lastPoint.peer;
    
    if (diff > 20) {
      return {
        title: "高阶领袖策略",
        desc: "您已大幅领先行业均值，当前策略应转向“知识输出”与“方法论沉淀”。建议开始准备 YYC3 架构师认证讲师申请。",
        action: "申请专家认证",
        color: "text-amber-400",
        bg: "bg-amber-400/10"
      };
    } else if (diff > 0) {
      return {
        title: "持续领先策略",
        desc: "您的进步速度优于 85% 的同行。建议保持当前的“全链路”攻克节奏，重点补齐数据安全相关短板。",
        action: "强化核心模块",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
      };
    } else {
      return {
        title: "极速赶超策略",
        desc: "当前进度略低于一梯队。建议开启“7日冲刺模式”，聚焦于高价值实战案例，利用 AI 陪练快速缩短差距。",
        action: "开启极速模式",
        color: "text-rose-400",
        bg: "bg-rose-400/10"
      };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = userId || 'default';
        const [actData, notesData] = await Promise.all([
          YYC3API.getActivity(uid),
          YYC3API.getDailyNotes(uid),
        ]);
        setActivity(actData);
        setDailyNotes(notesData);
      } catch (err) {
        console.error('获取数据失败', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSaveDailyNote = async () => {
    if (!selectedDay) return;
    const newNotes = { ...dailyNotes, [selectedDay.date]: tempNote };
    setDailyNotes(newNotes);
    setIsEditingNote(false);
    
    try {
      await YYC3API.saveDailyNotes(newNotes, userId || 'default');
    } catch (err) {
      console.error('保存日记失败', err);
    }
  };

  useEffect(() => {
    if (selectedDay) {
      setTempNote(dailyNotes[selectedDay.date] || '');
      setIsEditingNote(false);
    }
  }, [selectedDay, dailyNotes]);

  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 168); 
    
    while(startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const current = new Date(startDate);
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        count: activity[dateStr] || 0
      });
      current.setDate(current.getDate() + 1);
    }
    return data;
  }, [activity]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (count < 15) return 'bg-blue-500/20';
    if (count < 30) return 'bg-blue-500/40';
    if (count < 60) return 'bg-blue-500/70';
    return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
  };

  const getMockDayDetails = (date: string) => {
    const lessons = [
      "高并发架构：Redis 缓存层优化实战",
      "全链路营销：用户留存漏斗分析",
      "产品架构：领域驱动设计 (DDD) 落地",
      "SaaS 增长：定价策略与转化路径"
    ];
    const count = Math.floor(Math.random() * 3) + 1;
    return lessons.slice(0, count);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 relative">
      <Breadcrumbs 
        items={[
          { label: '商业智库', isSearchKeyword: true },
          { label: `${userProfile?.firstName || '用户'}的数字化空间`, active: true }
        ]} 
        predictions={[
          { label: '课程：DDD实战', subLabel: '系统架构深度解析', depth: 2 },
          { label: '工具：增长漏斗', subLabel: '数字化营销建模', depth: 1 },
          { label: 'AI报告回溯', subLabel: '自动化诊断分析', depth: 3 }
        ]}
        onPredictionClick={(path) => toast.success(`跳转预测路径: ${path.label} (${path.subLabel})`)}
      />
      {/* 个人主页 Hero */}
      <div className="bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-32 -mt-32" />
         
         <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="relative group">
               <div className="w-40 h-40 rounded-[2.5rem] p-1 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden border-4 border-[#0F172A]">
                     <ImageWithFallback src={userProfile?.avatar || defaultAvatarAsset} alt="头像" className="w-full h-full object-cover" />
                  </div>
                  {/* Upload overlay on hover */}
                  <div 
                    onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
                    className="absolute inset-1 rounded-[2.2rem] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={28} className="text-white animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Camera size={24} className="text-white" />
                        <span className="text-[8px] text-white font-black uppercase tracking-widest">更换头像</span>
                      </div>
                    )}
                  </div>
               </div>
               <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
               />
               <button 
                  onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
               >
                  {isUploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
               </button>
            </div>

            <div className="flex-1 text-center md:text-left">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">
                    {userProfile?.firstName || '用户'}{userProfile?.lastName ? ` ${userProfile.lastName}` : ''}
                  </h1>
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg shadow-lg shadow-blue-600/20">
                    {userProfile?.membershipTier === 'platinum' ? '铂金会员' : userProfile?.membershipTier === 'premium' ? '高级会员' : '基础会员'}
                  </span>
               </div>
               <p className="text-slate-400 font-medium text-lg mb-8 max-w-xl mx-auto md:mx-0">
                  {userProfile?.bio || '欢迎加入 YYC3 商业培训平台'}
               </p>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  <div className="flex items-center gap-2.5 text-slate-500">
                     <MapPin size={18} className="text-blue-500" />
                     <span className="text-sm font-bold uppercase tracking-wider">{userProfile?.location || '未设置'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                     <Mail size={18} className="text-indigo-500" />
                     <span className="text-sm font-bold uppercase tracking-wider">{userProfile?.email || '未绑定'}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="bg-[#020617]/60 border border-white/5 p-6 rounded-[2rem] text-center min-w-[140px] group hover:border-blue-500/30 transition-colors">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">连胜天数</p>
                  <div className="flex items-center justify-center gap-2">
                     <Flame size={20} className="text-rose-500 animate-pulse" />
                     <span className="text-2xl font-black text-white">{userProfile?.streakDays ?? 0}</span>
                  </div>
               </div>
               <div className="bg-[#020617]/60 border border-white/5 p-6 rounded-[2rem] text-center min-w-[140px] group hover:border-blue-500/30 transition-colors">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">已获证书</p>
                  <div className="flex items-center justify-center gap-2">
                     <Award size={20} className="text-emerald-500" />
                     <span className="text-2xl font-black text-white">{String(userProfile?.certificatesCount ?? 0).padStart(2, '0')}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 学习活跃度热力图 & 每日详情交互 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <div className="xl:col-span-3 bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Clock className="text-blue-500" size={20} />
                     学习活跃度热力图
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">点击方块查看每日学习进度明细。</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-slate-600">
                  <span>少</span>
                  <div className="flex gap-1.5">
                     {[0, 15, 30, 60, 100].map(val => (
                        <div key={val} className={`w-3 h-3 rounded-sm ${getColorClass(val)}`} />
                     ))}
                  </div>
                  <span>多</span>
               </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
               <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[800px]">
                  {heatmapData.map((day, i) => (
                     <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.001 }}
                        onClick={() => setSelectedDay(day)}
                        className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer ring-offset-2 ring-offset-[#020617] hover:ring-2 hover:ring-blue-500 ${selectedDay?.date === day.date ? 'ring-2 ring-blue-500 scale-125' : ''} ${getColorClass(day.count)}`}
                     />
                  ))}
               </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-8 pt-8 border-t border-white/5">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                     <TrendingUp size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">月度时长增长</p>
                     <p className="text-lg font-black text-white">+24.5%</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                     <Calendar size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">平均每日学习</p>
                     <p className="text-lg font-black text-white">42 钟</p>
                  </div>
               </div>
            </div>
         </div>

         {/* 每日明细卡片 */}
         <div className="bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               <FileText size={14} className="text-blue-400" />
               每日进度明细
            </h3>

            <AnimatePresence mode="wait">
               {selectedDay ? (
                  <motion.div
                     key={selectedDay.date}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="flex-1"
                  >
                     <div className="mb-6">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{selectedDay.date}</p>
                        <p className="text-2xl font-black text-white">{selectedDay.count} <span className="text-xs text-slate-500 uppercase">分钟</span></p>
                     </div>
                     
                     <div className="space-y-4">
                        {getMockDayDetails(selectedDay.date).map((lesson, i) => (
                           <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-blue-500/30 transition-colors">
                              <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">完成章节</p>
                              <p className="text-xs font-bold text-slate-300 leading-relaxed">{lesson}</p>
                           </div>
                        ))}
                        
                        {/* 学习心得摘要入口 */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">学习心得摘要</p>
                              <button 
                                 onClick={() => setIsEditingNote(!isEditingNote)}
                                 className="text-[9px] text-blue-400 font-black uppercase tracking-widest hover:text-white transition-colors"
                              >
                                 {isEditingNote ? '取消' : (dailyNotes[selectedDay.date] ? '编辑' : '添加')}
                              </button>
                           </div>
                           
                           {isEditingNote ? (
                              <div className="space-y-3">
                                 <textarea 
                                    value={tempNote}
                                    onChange={(e) => setTempNote(e.target.value)}
                                    placeholder="输入感悟 (支持架构 DSL, 如: [Web] -> [API] -> [DB])"
                                    className="w-full bg-[#020617]/50 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 min-h-[120px] resize-none font-mono"
                                 />
                                 <div className="flex gap-2">
                                    <button 
                                       onClick={handleSaveDailyNote}
                                       className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500"
                                    >
                                       保存心得
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl max-h-[250px] overflow-y-auto custom-scrollbar">
                                 {dailyNotes[selectedDay.date] ? (
                                    <div className="prose prose-invert prose-xs max-w-none">
                                       <SimpleMarkdown text={dailyNotes[selectedDay.date]} />
                                    </div>
                                 ) : (
                                    <p className="text-xs text-slate-400 italic leading-relaxed">
                                       今日暂无心得记录，点击上方添加。
                                    </p>
                                 )}
                              </div>
                           )}
                        </div>

                        {selectedDay.count === 0 && (
                           <div className="py-10 text-center">
                              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">该日无学习记录</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                     <Zap size={40} className="text-slate-600 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">点击热力图方块<br/>查看详细轨迹</p>
                  </div>
               )}
            </AnimatePresence>
            
            <button className="mt-auto w-full py-4 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-colors">
               导出完整周报
            </button>
         </div>
      </div>

      {/* 近期成就 & AI 诊断报告入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-[#0F172A]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
               <Trophy className="text-amber-500" size={20} />
               近期成就勋章
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                  { name: '快准狠', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: '完成首个实战模块' },
                  { name: '架构师', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: '全勤完成核心课' },
                  { name: '社交达人', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: '社区获得100+赞' },
                  { name: '长黑客', icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10', desc: '通关所有实战案例' },
               ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                     <div className={`w-20 h-20 rounded-[2rem] ${badge.bg} flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform shadow-lg`}>
                        <badge.icon className={badge.color} size={32} />
                     </div>
                     <p className="text-xs font-black text-white mb-1 uppercase tracking-wider">{badge.name}</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{badge.desc}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"
            />
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight italic leading-none mb-4">学习路径诊断</h3>
                  <p className="text-blue-100 text-sm font-medium opacity-80 leading-relaxed">
                     基于 AI 分析，您的架构思维已达到 前 5%。建议下一步攻克“全链路自动化”模块。
                  </p>
               </div>
               <button 
                  onClick={() => setIsReportOpen(true)}
                  className="w-full py-4 bg-white text-slate-950 text-[10px] font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 group-hover:gap-4"
               >
                  获取详细报告 <ChevronRight size={16} />
               </button>
            </div>
         </div>
      </div>

      {/* AI 诊断详细报告弹窗 (Modal) */}
      <AnimatePresence>
         {isReportOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsReportOpen(false)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
               />
               
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-4xl max-h-[90vh] bg-[#0F172A] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] relative z-10 overflow-hidden flex flex-col"
               >
                  {/* Header */}
                  <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0F172A] z-20">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                           <BarChart3 size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">YYC3 AI 深度诊断系统</p>
                           <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">2026 商业进阶分析报告</h2>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsReportOpen(false)}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar space-y-12">
                     {/* 能力雷达摘要 */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                           { label: '系统架构力', score: 98, color: 'text-blue-400' },
                           { label: '市场洞察力', score: 85, color: 'text-indigo-400' },
                           { label: '落地执行力', score: 92, color: 'text-emerald-400' },
                        ].map((stat, i) => (
                           <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                              <div className="flex items-baseline gap-2">
                                 <span className={`text-4xl font-black ${stat.color}`}>{stat.score}</span>
                                 <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">/ 100</span>
                              </div>
                              <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.score}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className={`h-full bg-current ${stat.color}`} 
                                 />
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* 同行对比动态趋势 */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                              <PieChart className="text-blue-500" size={18} />
                              成长力：与同行平均水平对比
                           </h3>
                           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
                              <div className="flex items-center gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                 <span className="text-white">您的进度</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                                 <span className="text-slate-500">同行平均</span>
                              </div>
                           </div>
                        </div>
                        <div ref={peerChartRef} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] h-[300px] w-full">
                           {peerChartReady ? (
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={peerComparisonData}>
                                    <defs>
                                       <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis 
                                       dataKey="name" 
                                       stroke="#475569" 
                                       fontSize={10} 
                                       tickLine={false} 
                                       axisLine={false} 
                                       dy={10}
                                    />
                                    <YAxis 
                                       stroke="#475569" 
                                       fontSize={10} 
                                       tickLine={false} 
                                       axisLine={false} 
                                    />
                                    <Tooltip 
                                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                       itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Area 
                                       type="monotone" 
                                       dataKey="user" 
                                       stroke="#3b82f6" 
                                       strokeWidth={3}
                                       fillOpacity={1} 
                                       fill="url(#colorUser)" 
                                    />
                                    <Line 
                                       type="monotone" 
                                       dataKey="peer" 
                                       stroke="#475569" 
                                       strokeDasharray="5 5"
                                       dot={false}
                                    />
                                 </AreaChart>
                              </ResponsiveContainer>
                           ) : (
                              <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl flex items-center justify-center">
                                 <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Analyzing Environment...</span>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* 核心结论 */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                              <Lightbulb className="text-amber-500" size={18} />
                              AI 策略洞察
                           </h3>
                           <div className={`px-4 py-1.5 ${catchUpStrategy.bg} ${catchUpStrategy.color} rounded-full text-[9px] font-black uppercase tracking-widest border border-current/20`}>
                              {catchUpStrategy.title}
                           </div>
                        </div>
                        <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] space-y-6">
                           <p className="text-slate-300 leading-relaxed font-medium">
                              <span className="text-blue-400 font-black">{userProfile?.firstName || '用户'}</span>，根据您在“并发”与“DDD”模块的表现，以及最新的同行对比趋势：
                           </p>
                           
                           <div className="bg-[#020617]/40 border border-white/5 p-6 rounded-2xl">
                              <p className={`text-sm font-bold ${catchUpStrategy.color} mb-2 flex items-center gap-2`}>
                                 <Zap size={14} /> 赶超建议
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed italic">
                                 {catchUpStrategy.desc}
                              </p>
                           </div>

                           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <li className="flex items-center gap-3 text-sm text-slate-400">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                 架构知识点覆盖率 94%
                              </li>
                              <li className="flex items-center gap-3 text-sm text-slate-400">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                 实战案例过关率 100%
                              </li>
                              <li className="flex items-center gap-3 text-sm text-slate-400">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                 平均攻克耗时低于 12% 同行
                              </li>
                              <li className="flex items-center gap-3 text-sm text-slate-400">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                 社区活跃度 Top 10%
                              </li>
                           </ul>
                        </div>
                     </div>

                     {/* 建议路径 */}
                     <div className="space-y-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                           <Target className="text-rose-500" size={18} />
                           下一阶段作战图
                        </h3>
                        <div className="space-y-4">
                           {[
                              { id: 'm1', stage: '核心进阶', title: '全链路自动化与 AIOps', status: '建议攻克' },
                              { id: 'm2', stage: '商业变现', title: 'SaaS 全球化合规与本地化策略', status: '待解锁' },
                              { id: 'm3', stage: '领袖力', title: '技术团队管理与架构决策方法论', status: '待解锁' },
                           ].map((step, i) => (
                              <div 
                                 key={i} 
                                 onClick={() => {
                                    onModuleClick(step.id);
                                    setIsReportOpen(false);
                                 }}
                                 className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer group"
                              >
                                 <div className="flex items-center gap-6">
                                    <span className="text-2xl font-black text-slate-800 group-hover:text-blue-500/40">{String(i + 1).padStart(2, '0')}</span>
                                    <div>
                                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{step.stage}</p>
                                       <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{step.title}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${i === 0 ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-600'}`}>{step.status}</span>
                                    <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="p-8 md:p-10 border-t border-white/5 flex items-center justify-between sticky bottom-0 bg-[#0F172A] z-20">
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">报告生成日期：2026.02.03</p>
                     <div className="flex gap-4">
                        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                           下载 PDF
                        </button>
                        <button 
                           onClick={() => {
                              onModuleClick('m1');
                              setIsReportOpen(false);
                           }}
                           className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
                        >
                           立即开启建议章节
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};