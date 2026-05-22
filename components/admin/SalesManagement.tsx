import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { defaultAvatarAsset } from '../../services/apiService';
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  Trophy,
  Search,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { YYC3API } from '../../services/apiService';
import type { SaleRecord, SalesKPI } from '../../types';

// Default mock sales data — used as fallback when KV is empty
const defaultSalesRecords: SaleRecord[] = [
  {
    id: '1',
    client: '张三',
    email: 'zhangsan@email.com',
    avatar: defaultAvatarAsset,
    module: '人工智能高级营销',
    price: 2500,
    date: '2026-01-22',
    time: '14:32',
    paymentMethod: '支付宝',
    status: 'completed',
    source: '自然搜索',
    transactionId: 'TXN_1234567890'
  },
  {
    id: '2',
    client: '李四',
    email: 'lisi@email.com',
    avatar: defaultAvatarAsset,
    module: 'SEO 技术实战 2026',
    price: 1999,
    date: '2026-01-22',
    time: '11:15',
    paymentMethod: '微信支付',
    status: 'completed',
    source: '合作伙伴',
    transactionId: 'TXN_0987654321'
  },
  {
    id: '3',
    client: '王五',
    email: 'wangwu@email.com',
    avatar: defaultAvatarAsset,
    module: '电子商务 Pro 全家桶',
    price: 4500,
    date: '2026-01-21',
    time: '16:45',
    paymentMethod: '支付宝',
    status: 'pending',
    source: '广告投放',
    transactionId: 'TXN_1122334455'
  },
  {
    id: '4',
    client: '赵六',
    email: 'zhaoliu@email.com',
    avatar: defaultAvatarAsset,
    module: '情绪文案策划',
    price: 1490,
    date: '2026-01-21',
    time: '09:22',
    paymentMethod: '支付宝',
    status: 'failed',
    source: '自然搜索',
    transactionId: 'TXN_5544332211'
  }
];

const defaultKPIs: SalesKPI = {
  totalRevenue: 1456800,
  monthlyRevenue: 284500,
  totalSales: 847,
  conversionRate: 8.2,
  avgOrderValue: 1720,
};

export function SalesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);
  const [salesKPIs, setSalesKPIs] = useState<SalesKPI>(defaultKPIs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const data = await YYC3API.getSales();
        if (data.records.length > 0) {
          setSalesRecords(data.records);
        } else {
          setSalesRecords(defaultSalesRecords);
        }
        if (data.kpis.totalRevenue > 0) {
          setSalesKPIs(data.kpis);
        }
      } catch (err) {
        console.error('Failed to load sales data:', err);
        setSalesRecords(defaultSalesRecords);
      } finally {
        setIsLoading(false);
      }
    };
    loadSalesData();
  }, []);

  const modules = ['人工智能高级营销', 'SEO 技术实战 2026', '电子商务 Pro 全家桶', '情绪文案策划', '个人品牌建设'];

  const revenueChart = [
    { date: '01/23', amount: 12000 },
    { date: '01/24', amount: 18500 },
    { date: '01/25', amount: 21000 },
    { date: '01/26', amount: 16500 },
    { date: '01/27', amount: 28500 },
    { date: '01/28', amount: 22000 },
    { date: '01/29', amount: 19500 },
  ];

  const chartConfig = {
    amount: {
      label: "营收额",
      color: "#3b82f6",
    },
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: '已完成', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
      pending: { label: '待处理', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
      failed: { label: '已失败', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredSales = salesRecords.filter(sale => {
    const matchesSearch = 
      sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'all' || sale.module === filterModule;
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">销售管理</h1>
          <p className="text-slate-400 mt-1">实时追踪平台营收、交易流水及转化详情</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white border-0 rounded-xl px-6 h-11 font-bold transition-all">
          <Download className="w-4 h-4 mr-2" />
          导出 CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总营收', value: `¥${salesKPIs.totalRevenue.toLocaleString()}`, sub: `本月 +¥${salesKPIs.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: '总销售量', value: String(salesKPIs.totalSales), sub: `客单价: ¥${salesKPIs.avgOrderValue}`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: '转化率', value: `${salesKPIs.conversionRate}%`, sub: '行业均值 5.4%', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: '月度营收', value: `¥${salesKPIs.monthlyRevenue.toLocaleString()}`, sub: `${salesRecords.length} 笔交易`, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((kpi, idx) => (
          <Card key={idx} className="bg-[#0F172A] border-white/5 shadow-xl rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{kpi.label}</p>
                  <p className="text-2xl text-white font-bold tracking-tight">{kpi.value}</p>
                  <p className={`${kpi.color} text-[10px] mt-1 font-bold uppercase tracking-wider`}>{kpi.sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <kpi.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 营收趋势图 */}
      <Card className="bg-[#0F172A] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-white font-bold tracking-tight">营收趋势 (最近 7 天)</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <LineChart data={revenueChart} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--color-amount)" 
                strokeWidth={4}
                dot={{ fill: 'var(--color-amount)', strokeWidth: 2, r: 6, stroke: '#020617' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#60a5fa' }}
                animationDuration={1500}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 过滤器 */}
      <Card className="bg-[#0F172A] border-white/5 shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px] relative group">
              <Search className="absolute left-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="搜索交易、客户、课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-white/5 text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
              />
            </div>
            
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-48 bg-slate-900/50 border-white/5 text-white rounded-xl">
                <SelectValue placeholder="课程模块" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">全部课程</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 bg-slate-900/50 border-white/5 text-white rounded-xl">
                <SelectValue placeholder="支付状态" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="failed">已失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 交易表格 */}
      <Card className="bg-[#0F172A] border-white/5 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">客户信息</th>
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">购买课程</th>
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">交易金额</th>
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">支付方式</th>
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">状态</th>
                  <th className="p-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">渠道</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 border border-white/10">
                          <AvatarImage src={sale.avatar} alt={sale.client} />
                          <AvatarFallback className="bg-slate-800 text-white text-xs">
                            {sale.client[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-blue-400 transition-colors">{sale.client}</p>
                          <p className="text-slate-500 text-xs">{sale.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-200 text-sm font-medium">{sale.module}</p>
                      <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{sale.date} {sale.time}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-blue-400 text-sm font-bold">¥{sale.price.toLocaleString()}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium">{sale.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="border-white/5 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {sale.source}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredSales.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest">未找到相关交易</p>
          <p className="text-slate-600 text-xs mt-2 uppercase">尝试调整搜索词或过滤器</p>
        </div>
      )}
    </div>
  );
}