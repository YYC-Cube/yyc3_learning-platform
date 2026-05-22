import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardSkeleton } from './DashboardSkeleton';
import { 
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  Zap
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { YYC3API } from '../../services/apiService';
import type { DashboardStats } from '../../types';

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await YYC3API.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const revenueData = [
    { name: '1月', revenue: 45000, users: 120 },
    { name: '2月', revenue: 52000, users: 145 },
    { name: '3月', revenue: 48000, users: 130 },
    { name: '4月', revenue: 61000, users: 190 },
    { name: '5月', revenue: 55000, users: 170 },
    { name: '6月', revenue: 67000, users: 210 },
  ];

  const modulePopularity = [
    { name: '人工智能实战', value: 85, color: '#3b82f6' },
    { name: '电子商务架构', value: 72, color: '#6366f1' },
    { name: 'SEO 数字化营销', value: 65, color: '#06b6d4' },
    { name: '品牌建设思维', value: 45, color: '#8b5cf6' },
    { name: '内容文案策划', value: 38, color: '#ec4899' },
  ];

  const chartConfig = {
    revenue: {
      label: "营收额",
      color: "#3b82f6",
    },
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">管理控制中心</h1>
          <p className="text-slate-500 text-sm font-medium">Focus 平台实时运营数据看板</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold px-6 h-11">
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all py-5 px-8 rounded-xl text-xs font-bold h-11 border-0 text-white">
            全局设置管理
          </Button>
        </div>
      </div>

      {/* Stats Grid — connected to KV API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总营收', value: `¥${(stats?.revenue ?? 0).toLocaleString()}`, trend: `+${stats?.weeklyGrowth ?? 0}%`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10', up: true },
          { label: '活跃学员', value: (stats?.activeUsers ?? 0).toLocaleString(), trend: '+5.2%', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', up: true },
          { label: '完成率', value: `${stats?.completionRate ?? 0}%`, trend: '+3.1%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', up: true },
          { label: '课程总数', value: String(stats?.totalCourses ?? 0), trend: `${stats?.avgSessionMinutes ?? 0}min/日`, icon: Award, color: 'text-violet-400', bg: 'bg-violet-500/10', up: true }
        ].map((stat, i) => (
          <Card key={i} className="bg-[#0F172A] border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge className={`bg-transparent border-none flex items-center gap-1 font-bold ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-2xl text-white font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-8 bg-[#0F172A] border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
          <CardHeader className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-bold tracking-tight text-xl">营收与增长趋势</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">营收额 (CNY)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <ChartContainer config={chartConfig} className="w-full h-[350px]">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-revenue)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Module Popularity Bar Chart */}
        <Card className="lg:col-span-4 bg-[#0F172A] border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-white font-bold tracking-tight text-xl uppercase">热门模块分布</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-7">
              {modulePopularity.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-bold">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="text-blue-400">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center shadow-inner">
              <Zap className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">智能业务建议</p>
              <p className="text-slate-500 text-[10px] mt-3 leading-relaxed font-bold uppercase italic">
                人工智能模块热度持续上升，建议增加进阶实战案例。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}