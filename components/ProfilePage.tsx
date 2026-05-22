import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { 
  User, 
  Settings, 
  Award, 
  Clock, 
  BookOpen, 
  Zap, 
  ChevronRight, 
  Camera,
  Mail,
  Calendar,
  Shield,
  QrCode,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export function ProfilePage() {
  const { t, language } = useLanguage();

  const userStats = [
    { label: language === 'zh' ? '累计学习' : 'Temps total', value: '124h', icon: Clock, color: 'text-orange-500' },
    { label: language === 'zh' ? '已修模块' : 'Modules finis', value: '18', icon: BookOpen, color: 'text-blue-500' },
    { label: language === 'zh' ? '获得证书' : 'Certificats', value: '3', icon: Award, color: 'text-yellow-500' },
    { label: language === 'zh' ? '活跃天数' : 'Jours actifs', value: '42', icon: Zap, color: 'text-green-500' }
  ];

  const medals = [
    { id: 1, name: language === 'zh' ? '初露锋芒' : 'Débutant', icon: '🌱', date: '2025.12.01' },
    { id: 2, name: language === 'zh' ? '学霸附体' : 'Savant', icon: '🧠', date: '2026.01.10' },
    { id: 3, name: language === 'zh' ? '效率达人' : 'Productif', icon: '⚡', date: '2026.01.20' },
    { id: 4, name: language === 'zh' ? '商业精英' : 'Elite Biz', icon: '💼', date: '2026.01.25' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-orange-600/20 via-black to-orange-900/20 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 focus-gradient-bg opacity-30"></div>
        </div>
        
        <div className="px-8 -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-3xl bg-gray-900 border-4 border-black shadow-2xl flex items-center justify-center text-4xl font-bold text-orange-500 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
              JD
            </motion.div>
            <div className="text-center md:text-left pb-2">
              <h1 className="text-4xl font-bebas tracking-widest text-white uppercase">Jean Dupont</h1>
              <p className="text-gray-400 font-inter text-sm flex items-center justify-center md:justify-start mt-1">
                <Mail className="w-3 h-3 mr-2" /> jean.dupont@example.com
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 pb-2">
            <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-montserrat text-xs uppercase tracking-widest">
              <Settings className="w-4 h-4 mr-2" />
              {language === 'zh' ? '编辑资料' : 'Modifier'}
            </Button>
            <Button className="focus-btn-primary rounded-xl font-montserrat text-xs uppercase tracking-widest py-5">
              <Share2 className="w-4 h-4 mr-2" />
              {language === 'zh' ? '分享名片' : 'Partager'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {userStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl group hover:border-orange-500/30 transition-all"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
            <p className="text-2xl text-white font-bebas tracking-wider mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bebas tracking-widest text-white uppercase">
                  {language === 'zh' ? '最近学习' : 'Activité Récente'}
                </h3>
                <Button variant="link" className="text-orange-500 text-xs uppercase tracking-widest">
                  {language === 'zh' ? '查看全部' : 'Tout voir'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'IA 营销实战指南', progress: 75, date: '2h ago', cat: 'AI' },
                  { title: 'SEO 高级策略', progress: 40, date: 'Yesterday', cat: 'SEO' },
                  { title: '品牌视觉规范', progress: 95, date: '3 days ago', cat: 'Branding' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bebas">
                      {item.cat}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white text-sm font-medium">{item.title}</h4>
                        <span className="text-[10px] text-gray-500 uppercase">{item.date}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={item.progress} className="h-1 flex-1 bg-gray-800" />
                        <span className="text-[10px] font-bold text-orange-500">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medals / Achievements */}
          <div className="space-y-4">
            <h3 className="text-xl font-bebas tracking-widest text-white uppercase px-2">
              {language === 'zh' ? '成就勋章' : 'Médailles'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
              {medals.map((medal) => (
                <div key={medal.id} className="flex flex-col items-center p-6 rounded-2xl bg-gray-900 border border-white/5 hover:bg-white/[0.02] hover:border-orange-500/30 transition-all group">
                  <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">
                    {medal.icon}
                  </div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">{medal.name}</p>
                  <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-tighter">{medal.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Membership Status */}
          <Card className="bg-gradient-to-br from-orange-500/20 to-black border-orange-500/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(231,156,28,0.1)]">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-orange-500 text-black font-bold text-[10px] uppercase tracking-widest px-3 py-1">PREMIUM</Badge>
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="text-white font-bebas text-2xl tracking-widest uppercase">Focus Pro Member</h4>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-tighter">Valid until Jan 2027</p>
              </div>
              <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-xl font-montserrat text-[10px] font-bold uppercase tracking-widest py-6">
                {language === 'zh' ? '续费会员' : 'Renouveler'}
              </Button>
            </CardContent>
          </Card>

          {/* Sharing QR Code Placeholder */}
          <Card className="bg-gray-900/50 border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-8 text-center space-y-4">
              <h4 className="text-white text-sm font-bebas tracking-widest uppercase">
                {language === 'zh' ? '小程序便捷学习' : 'Accès Mobile'}
              </h4>
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <QrCode className="w-full h-full text-black" />
              </div>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                {language === 'zh' ? '扫描上方二维码，随时随地开启学习' : 'Scannez pour apprendre n\'importe où'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
