import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Bell, ChevronDown, UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { defaultAvatarAsset } from '../services/apiService';
import type { UserSummary } from '../types';

interface HeaderProps {
  user: UserSummary;
  isMobile: boolean;
  isTablet: boolean;
  isLiveActive?: boolean;
  onSearch: (query: string) => void;
  isGuest?: boolean;
  onLogout?: () => void;
  onTabChange?: (tab: string) => void;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isMobile, isTablet, isLiveActive, onSearch, isGuest, onLogout, onTabChange, onOpenFeedback }) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: '1', title: '课程更新', desc: '《高并发架构》新增实战章节', time: '5分钟前', unread: true },
    { id: '2', title: '证书颁发', desc: '恭喜获得「营销增长」结业证书', time: '2小时前', unread: true },
    { id: '3', title: '社区回复', desc: '您的帖子收到了 3 条新回复', time: '昨天', unread: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className={`${isMobile ? 'h-16' : 'h-24'} flex items-center justify-between px-6 md:px-10 border-b border-white/5 sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-xl`}>
      {/* Search Bar - Enhanced for Chinese Fuzzy Search (Desktop/Tablet only) */}
      {!isMobile && (
        <div className="relative group w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('search')} 
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.07] transition-all placeholder:text-slate-600 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Mobile: Active tab indicator */}
      {isMobile && (
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <span className="text-[10px] text-white font-black uppercase tracking-widest">{t('dashboard')}</span>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-8 ml-auto">
        {/* Live Indicator */}
        {isLiveActive && !isMobile && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]" />
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{t('active_live')}</span>
          </div>
        )}

        {/* Global Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setIsMenuOpen(false);
            }}
            className="relative p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group"
            aria-label="通知中心"
          >
            <Bell size={20} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-[#0F172A] border border-white/5 rounded-3xl p-3 shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2 flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">通知中心</p>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-black">
                    {notifications.filter(n => n.unread).length} 条未读
                  </span>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        )}
                        {!notif.unread && <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{notif.title}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{notif.desc}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center py-2 text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                    查看全部通知
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-colors">
              <ImageWithFallback src={user.avatar || defaultAvatarAsset} alt="User" className="w-full h-full object-cover" />
            </div>
            {!isMobile && (
              <div className="text-left">
                <p className="text-xs font-black text-white leading-none uppercase tracking-tight">{user.firstName} {user.lastName}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                  {isGuest ? '体验模式' : t('pro_member')}
                </p>
              </div>
            )}
            <ChevronDown size={14} className={`text-slate-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-[#0F172A] border border-white/5 rounded-3xl p-3 shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-4 border-b border-white/5 mb-2">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                       <ImageWithFallback src={user.avatar || defaultAvatarAsset} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs font-black text-white leading-none uppercase tracking-tight truncate">{user.firstName} {user.lastName}</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                         {isGuest ? '体验模式' : t('pro_member')}
                       </p>
                     </div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">系统快捷操作</p>
                </div>
                
                <div className="space-y-1">
                  {[
                    { label: t('profile'), icon: UserCircle, action: 'profile' },
                    { label: t('settings'), icon: Settings, action: 'settings' },
                    { label: '帮助与反馈', icon: HelpCircle, action: 'feedback' },
                  ].map((item) => (
                    <button 
                      key={item.action} 
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (item.action === 'profile') {
                          onTabChange?.('profile');
                        } else if (item.action === 'settings') {
                          onTabChange?.('profile');
                        } else if (item.action === 'feedback') {
                          onOpenFeedback?.();
                        }
                      }}
                      className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                       <item.icon size={18} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                       <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={() => { setIsMenuOpen(false); onLogout?.(); }}
                    className="w-full flex items-center gap-4 px-4 py-3 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all group"
                  >
                     <LogOut size={18} />
                     <span className="text-xs font-bold uppercase tracking-wide">{t('logout')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};