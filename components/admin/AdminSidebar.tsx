import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";
import { 
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Briefcase,
  UserCheck,
  MessageCircle,
  Settings,
  ArrowLeft,
  Package,
  Bell,
  Trello,
  Radio,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBackToUser: () => void;
}

const adminSections = [
  { id: 'dashboard', name: '数据概览', icon: LayoutDashboard },
  { id: 'users', name: '用户管理', icon: ShieldCheck },
  { id: 'modules', name: '课程管理', icon: BookOpen, count: 32 },
  { id: 'clients', name: '学员列表', icon: Users, count: 1847 },
  { id: 'sales', name: '销售统计', icon: CreditCard },
  { id: 'services', name: '服务管理', icon: Briefcase, count: 12 },
  { id: 'projects', name: '项目看板', icon: Trello, count: 18 },
  { id: 'lives', name: '直播中心', icon: Radio, count: 2 },
  { id: 'affiliates', name: '联盟营销', icon: UserCheck, count: 156 },
  { id: 'support', name: '工单支持', icon: MessageCircle, count: 23 },
  { id: 'settings', name: '全局设置', icon: Settings },
];

export function AdminSidebar({ activeSection, onSectionChange, onBackToUser }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-[#0F172A] border-r border-white/5 flex flex-col h-full shadow-2xl">
      {/* Header Admin */}
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden bg-white/5 p-1">
            <ImageWithFallback src={appLogo} alt="YYC3 Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white text-md font-bold tracking-tight uppercase">YYC3</h1>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">管理控制台</p>
          </div>
        </div>
        
        <Button 
          variant="ghost"
          onClick={onBackToUser}
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl h-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回用户界面
        </Button>
      </div>

      {/* Navigation Admin */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {adminSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 rounded-xl" />
              )}
              <div className="flex items-center space-x-3 relative z-10">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="text-sm font-bold">{section.name}</span>
              </div>
              {section.count && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px] font-bold border border-white/5 relative z-10">
                  {section.count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Actions */}
      <div className="p-6 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>活动通知</span>
          </div>
          <Badge className="bg-blue-600 text-white border-0 text-[10px]">3</Badge>
        </div>
        <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">
          当前登录: 超级管理员
        </div>
      </div>
    </div>
  );
}