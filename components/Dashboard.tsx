import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
} from 'recharts';
import { TrendingUp, Users, BookOpen, Clock, ArrowUpRight, CheckCircle2, Circle, MoreHorizontal, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { defaultAvatarAsset } from '../services/apiService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

const data = [
  { name: '周一', value: 400 },
  { name: '周二', value: 300 },
  { name: '周三', value: 600 },
  { name: '周四', value: 800 },
  { name: '周五', value: 500 },
  { name: '周六', value: 900 },
  { name: '周日', value: 1100 },
];

const barData = [
  { name: '营销', value: 80 },
  { name: '管理', value: 65 },
  { name: '技术', value: 45 },
  { name: '财务', value: 90 },
];

const todoTasks = [
  { id: 1, text: '高并发系统压力测试', done: false, priority: 'P0' },
  { id: 2, text: '法语国际化文案核对', done: true, priority: 'P2' },
  { id: 3, text: 'VIP 成员权限 API 联调', done: false, priority: 'P0' },
];

const chartConfig = {
  value: {
    label: "活跃度",
    color: "#3b82f6",
  },
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">欢迎回来, 超级管理员</h1>
          <p className="text-slate-400 mt-1">这是 YYC3 平台的实时运行概览。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-sm">
                <ImageWithFallback 
                  src={defaultAvatarAsset} 
                  alt="User" 
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">+1,240 名在线学员</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总营收', value: '€24,500', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12.5%' },
          { label: '活跃用户', value: '3,842', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+5.2%' },
          { label: '课程完成度', value: '78.4%', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', trend: '+2.1%' },
          { label: '平均学习时长', value: '42m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '-0.8%' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0F172A] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl group-hover:from-blue-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shadow-sm`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium relative z-10">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1 relative z-10">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0F172A] p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              学习增长曲线 <ArrowUpRight size={16} className="text-blue-400" />
            </h3>
            <select className="bg-slate-800/50 text-xs text-slate-300 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500/50">
              <option>最近 7 天</option>
              <option>最近 30 天</option>
            </select>
          </div>
          
          <ChartContainer config={chartConfig} className="flex-1 w-full h-full min-h-[300px]">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-value)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0F172A] p-6 rounded-3xl border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              我的待办事项
            </h3>
            <div className="space-y-3">
              {todoTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer">
                  {task.done ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-500 group-hover:text-blue-400 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {task.text}
                  </span>
                  {task.priority === 'P0' && (
                    <span className="ml-auto text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold">P0</span>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors border border-dashed border-white/10 rounded-xl hover:bg-white/5">
              <Plus size={14} /> 添加新任务
            </button>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-8">课程热度排行</h3>
            <div className="space-y-7">
              {barData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{item.name}实战系列</span>
                    <span className="text-blue-400 font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 shadow-inner">
              <p className="text-[10px] text-blue-400 mb-2 uppercase font-bold tracking-widest">下周预测</p>
              <p className="text-sm text-slate-300 italic">"营销实战" 课程预计将有 15% 的环比增长。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};