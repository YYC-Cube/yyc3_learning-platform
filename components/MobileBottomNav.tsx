import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Compass,
  Trello,
  Users,
  UserCircle,
  Crown
} from 'lucide-react';
import type { UserRole } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
}

const baseNavItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '概览' },
  { id: 'courses', icon: Compass, label: '课程' },
  { id: 'kanban', icon: Trello, label: '看板' },
  { id: 'community', icon: Users, label: '社区' },
  { id: 'profile', icon: UserCircle, label: '我的' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange, userRole }) => {
  const resolvedTab = activeTab === 'module-detail' ? 'courses' : activeTab;

  const navItems = userRole === 'admin'
    ? [...baseNavItems, { id: 'admin', icon: Crown, label: '管理' }]
    : baseNavItems;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#0F172A]/95 backdrop-blur-2xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = resolvedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-px left-3 right-3 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                size={20}
                className={`transition-colors ${
                  isActive ? 'text-blue-500' : 'text-slate-600'
                }`}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-wider transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};