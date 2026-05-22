import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trello, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Compass,
  UserCircle,
  Crown,
  Map,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeMobileMenu: () => void;
  isOpen?: boolean;
  isMobile?: boolean;
  onLogout?: () => void;
  userRole?: 'user' | 'admin' | 'vip';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  closeMobileMenu, 
  isOpen = true,
  isMobile = false,
  onLogout,
  userRole = 'user'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Desktop: Collapsed by default (w-20), expands on hover (w-64)
  // Mobile: Controlled by isOpen prop (slide in/out)
  const isExpanded = isMobile ? isOpen : (isHovered);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '概览仪表盘' },
    { id: 'courses', icon: Compass, label: '课程广场' },
    { id: 'kanban', icon: Trello, label: '学习看板' },
    { id: 'community', icon: Users, label: '社区交流' },
    { id: 'certificates', icon: Award, label: '我的证书' },
    { id: 'roadmap', icon: Map, label: '项目路线图' },
    { id: 'profile', icon: UserCircle, label: '个人中心' },
    ...(userRole === 'admin' ? [{ id: 'admin', icon: Crown, label: '管理后台' }] : []),
  ];

  const sidebarVariants = {
    mobileClosed: { x: "-100%" },
    mobileOpen: { x: 0, width: "16rem" }, // w-64
    desktopCollapsed: { x: 0, width: "5rem" }, // w-20
    desktopExpanded: { x: 0, width: "16rem" } // w-64
  };

  const getVariant = () => {
    if (isMobile) {
      return isOpen ? "mobileOpen" : "mobileClosed";
    }
    return isHovered ? "desktopExpanded" : "desktopCollapsed";
  };

  return (
    <motion.div 
      initial={false}
      animate={getVariant()}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`fixed inset-y-0 left-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col overflow-hidden`}
    >
      {/* Brand Section */}
      <div className={`flex items-center gap-3 h-24 px-6 transition-all duration-300 ${!isExpanded && !isMobile ? 'justify-center px-0' : ''}`}>
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-blue-600/10 border border-blue-500/20 p-1 shadow-lg shadow-blue-600/5">
          <ImageWithFallback src={appLogo} alt="YYC3 Logo" className="w-full h-full object-contain" />
        </div>
        
        <AnimatePresence mode="wait">
          {(isExpanded || isMobile) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span className="text-lg font-black tracking-tighter text-white leading-none uppercase">YYC3</span>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Platinum</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-2 px-3 py-4">
        <AnimatePresence mode="wait">
          {(isExpanded || isMobile) ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mb-4 px-3 whitespace-nowrap"
            >
              Main Menu
            </motion.p>
          ) : (
            <div className="h-4 mb-4" /> // Spacer
          )}
        </AnimatePresence>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) closeMobileMenu();
            }}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative group overflow-hidden ${
              activeTab === item.id 
                ? 'text-white' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            } ${!isExpanded && !isMobile ? 'justify-center' : ''}`}
            title={!isExpanded ? item.label : ''}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute inset-0 bg-blue-600/10 border border-blue-500/30 rounded-2xl"
              />
            )}
            
            <item.icon size={20} className={`flex-shrink-0 relative z-10 transition-colors ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
            
            <AnimatePresence mode="wait">
              {(isExpanded || isMobile) && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-black text-[13px] uppercase tracking-wide relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {activeTab === item.id && (isExpanded || isMobile) && (
              <motion.div layoutId="active-indicator" className="ml-auto relative z-10">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-6 px-3 pb-6">
        <div className="h-px bg-white/5 w-full" />
        
        {/* User Status Card */}
        <AnimatePresence mode="wait">
          {(isExpanded || isMobile) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 rounded-3xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 relative overflow-hidden group shadow-xl"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" 
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Star size={12} className="text-white fill-current" />
                  </div>
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Pro</p>
                </div>
                <p className="text-xs text-white/80 font-bold leading-relaxed mb-4">
                  全平台权益
                </p>
                <button 
                  onClick={() => {
                    setActiveTab('profile');
                    if (isMobile) closeMobileMenu();
                  }}
                  className="w-full py-2 bg-white text-slate-950 text-[10px] font-black rounded-lg hover:bg-blue-50 transition-colors shadow-lg uppercase tracking-wider"
                >
                  查看
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <button 
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all group ${!isExpanded && !isMobile ? 'justify-center' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              closeMobileMenu();
            }}
            title={!isExpanded ? '账号设置' : ''}
          >
            <Settings size={20} className="flex-shrink-0 group-hover:rotate-45 transition-transform" />
            {(isExpanded || isMobile) && (
              <span className="font-black text-[13px] uppercase tracking-wide whitespace-nowrap">账号设置</span>
            )}
          </button>
          
          <button 
            className={`w-full flex items-center gap-4 px-3 py-3 text-rose-500/60 hover:text-rose-400 transition-colors ${!isExpanded && !isMobile ? 'justify-center' : ''}`}
            title={!isExpanded ? '退出系统' : ''}
            onClick={onLogout}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(isExpanded || isMobile) && (
              <span className="font-black text-[13px] uppercase tracking-wide whitespace-nowrap">退出系统</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};