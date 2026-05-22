// =============================================================================
// YYC3-Learning-Platform — Admin: User Management Panel (v2.6.0-fix)
// =============================================================================
// Features: debounced search + highlight, custom virtual scrolling (zero deps),
//           multi-select batch role change, batch delete, JSON export.
// Cache-bust: removed react-window dependency entirely.

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  Crown,
  Star,
  User,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  Loader2,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  Download,
  UserCog,
  MinusSquare,
} from 'lucide-react';
import { YYC3API } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { defaultAvatarAsset } from '../../services/apiService';
import { toast } from 'sonner';
import type { UserProfile, UserRole } from '../../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UsersManagementProps {
  isMobile?: boolean;
}

interface RoleOption {
  value: UserRole;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROW_HEIGHT = 72;
const VIRTUAL_SCROLL_THRESHOLD = 30;

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'user', label: '普通用户', icon: User, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { value: 'vip', label: 'VIP 会员', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { value: 'admin', label: '管理员', icon: Crown, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

const getRoleBadge = (role: UserRole) => {
  return ROLE_OPTIONS.find(r => r.value === role) || ROLE_OPTIONS[0];
};

// ---------------------------------------------------------------------------
// useDebounce hook
// ---------------------------------------------------------------------------

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Search highlight helper
// ---------------------------------------------------------------------------

interface HighlightedTextProps {
  text: string;
  query: string;
}

function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query.trim()) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        // Rebuild regex for each test since exec/test advances lastIndex on 'g'
        const testRegex = new RegExp(`^${escaped}$`, 'i');
        return testRegex.test(part) ? (
          <mark
            key={i}
            className="bg-blue-500/30 text-blue-300 rounded-sm px-0.5 font-bold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Custom Virtual Scroll component (no external dependency)
// ---------------------------------------------------------------------------

const OVERSCAN_COUNT = 5;

interface VirtualizedUserListProps {
  users: UserProfile[];
  rowHeight: number;
  maxHeight: number;
  renderRow: (user: UserProfile, style?: React.CSSProperties) => React.ReactNode;
}

function VirtualizedUserList({ users, rowHeight, maxHeight, renderRow }: VirtualizedUserListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = users.length * rowHeight;
  const viewportHeight = Math.min(maxHeight, totalHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_COUNT);
  const endIndex = Math.min(
    users.length - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + OVERSCAN_COUNT,
  );

  const visibleUsers = users.slice(startIndex, endIndex + 1);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ height: viewportHeight, overflowY: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleUsers.map((user, i) => {
          const actualIndex = startIndex + i;
          return renderRow(user, {
            position: 'absolute',
            top: actualIndex * rowHeight,
            left: 0,
            right: 0,
            height: rowHeight,
          });
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UsersManagement({ isMobile = false }: UsersManagementProps) {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const debouncedQuery = useDebounce(rawSearchQuery, 250);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [roleDropdownUserId, setRoleDropdownUserId] = useState<string | null>(null);
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserProfile | null>(null);

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchRoleDropdownOpen, setBatchRoleDropdownOpen] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);

  // Container ref for virtual scrolling sizing
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  // Measure container height
  useEffect(() => {
    const measure = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
        // Take available viewport minus position, clamped
        const available = window.innerHeight - rect.top - 40;
        setListHeight(Math.max(300, Math.min(available, 800)));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [loading]);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchUsers = useCallback(async () => {
    if (!accessToken) {
      toast.error('需要管理员权限');
      return;
    }
    setLoading(true);
    try {
      const data = await YYC3API.listUsers(accessToken);
      setUsers(data);
    } catch (err) {
      console.error('获取用户列表失败:', err);
      toast.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---------------------------------------------------------------------------
  // Filtered data
  // ---------------------------------------------------------------------------

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = debouncedQuery.toLowerCase();
      const matchesSearch =
        !q ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedQuery, roleFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      vips: users.filter(u => u.role === 'vip').length,
      regular: users.filter(u => u.role === 'user').length,
    }),
    [users],
  );

  const allSelected = filteredUsers.length > 0 && selectedIds.size === filteredUsers.length;
  const someSelected = selectedIds.size > 0;
  const indeterminate = someSelected && !allSelected;
  const useVirtualScroll = filteredUsers.length >= VIRTUAL_SCROLL_THRESHOLD;

  // Count deletable users in selection (non-admin)
  const deletableSelected = useMemo(() => {
    return Array.from(selectedIds).filter(id => {
      const u = users.find(usr => usr.id === id);
      return u && u.role !== 'admin';
    });
  }, [selectedIds, users]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleSetRole = async (targetUserId: string, newRole: UserRole) => {
    if (!accessToken) return;
    setChangingRoleFor(targetUserId);
    try {
      await YYC3API.setUserRole(targetUserId, newRole, accessToken);
      setUsers(prev =>
        prev.map(u => (u.id === targetUserId ? { ...u, role: newRole } : u)),
      );
      if (selectedUser?.id === targetUserId) {
        setSelectedUser(prev => (prev ? { ...prev, role: newRole } : null));
      }
      toast.success(`角色已更新为 ${getRoleBadge(newRole).label}`);
    } catch (err) {
      console.error('角色更新失败:', err);
      toast.error('角色更新失败');
    } finally {
      setChangingRoleFor(null);
      setRoleDropdownUserId(null);
    }
  };

  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (!accessToken) return;
    setDeletingUserId(targetUser.id);
    try {
      await YYC3API.deleteUser(targetUser.id, accessToken);
      setUsers(prev => prev.filter(u => u.id !== targetUser.id));
      if (selectedUser?.id === targetUser.id) setSelectedUser(null);
      setConfirmDeleteUser(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(targetUser.id);
        return next;
      });
      toast.success(`用户 ${targetUser.firstName} 已删除`);
    } catch (err) {
      console.error('删除用户失败:', err);
      toast.error('删除用户失败');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Batch role change
  const handleBatchSetRole = async (newRole: UserRole) => {
    if (!accessToken || selectedIds.size === 0) return;
    setBatchProcessing(true);
    setBatchRoleDropdownOpen(false);
    try {
      const ids = Array.from(selectedIds);
      await YYC3API.batchSetRole(ids, newRole, accessToken);
      setUsers(prev =>
        prev.map(u => (selectedIds.has(u.id) ? { ...u, role: newRole } : u)),
      );
      toast.success(`已批量更新 ${ids.length} 位用户角色为 ${getRoleBadge(newRole).label}`);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('批量角色更新失败:', err);
      toast.error('批量角色更新失败');
    } finally {
      setBatchProcessing(false);
    }
  };

  // Batch delete
  const handleBatchDelete = async () => {
    if (!accessToken || deletableSelected.length === 0) return;
    setBatchDeleting(true);
    try {
      const result = await YYC3API.batchDeleteUsers(deletableSelected, accessToken);
      const deletedIds = new Set(
        result.results.filter(r => r.success).map(r => r.userId),
      );
      setUsers(prev => prev.filter(u => !deletedIds.has(u.id)));
      setSelectedIds(prev => {
        const next = new Set(prev);
        deletedIds.forEach(id => next.delete(id));
        return next;
      });
      if (selectedUser && deletedIds.has(selectedUser.id)) setSelectedUser(null);
      setShowBatchDeleteConfirm(false);

      if (result.skipped > 0) {
        toast.success(`已删除 ${result.deleted} 人，${result.skipped} 人被跳过（管理员/自身保护）`);
      } else {
        toast.success(`已批量删除 ${result.deleted} 位用户`);
      }
    } catch (err) {
      console.error('批量删除失败:', err);
      toast.error('批量删除失败');
    } finally {
      setBatchDeleting(false);
    }
  };

  // Export selected users as JSON
  const handleExportUsers = () => {
    const toExport = someSelected
      ? users.filter(u => selectedIds.has(u.id))
      : filteredUsers;
    const payload = {
      exportedAt: new Date().toISOString(),
      platform: 'YYC3-Learning-Platform',
      count: toExport.length,
      users: toExport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3-users-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`已导出 ${toExport.length} 位用户数据`);
  };

  // Toggle selection
  const toggleSelect = (userId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  // ---------------------------------------------------------------------------
  // Shared row renderer
  // ---------------------------------------------------------------------------

  const renderUserRow = (user: UserProfile, style?: React.CSSProperties) => {
    const roleBadge = getRoleBadge(user.role);
    const RoleIcon = roleBadge.icon;
    const isChangingRole = changingRoleFor === user.id;
    const isDropdownOpen = roleDropdownUserId === user.id;
    const isDeleting = deletingUserId === user.id;
    const isSelected = selectedIds.has(user.id);
    const lastActive = user.lastActiveAt
      ? new Date(user.lastActiveAt).toLocaleDateString('zh-CN')
      : '未知';

    return (
      <div
        key={user.id}
        style={style}
        className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 items-center hover:bg-white/[0.02] transition-colors group border-b border-white/5 ${
          isSelected ? 'bg-blue-600/5' : ''
        }`}
      >
        {/* Checkbox */}
        <div className="hidden sm:flex sm:col-span-1 items-center">
          <button
            onClick={() => toggleSelect(user.id)}
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            {isSelected ? (
              <CheckSquare size={16} className="text-blue-400" />
            ) : (
              <Square size={16} />
            )}
          </button>
        </div>

        {/* User info */}
        <div className="sm:col-span-3 flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/10 flex-shrink-0">
            <ImageWithFallback
              src={user.avatar || defaultAvatarAsset}
              alt={user.firstName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              <HighlightedText
                text={`${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`}
                query={debouncedQuery}
              />
            </p>
            <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
              <Mail size={10} />
              <HighlightedText text={user.email || '未绑定'} query={debouncedQuery} />
            </p>
          </div>
        </div>

        {/* Role (with dropdown) */}
        <div className="sm:col-span-2 flex items-center relative">
          <button
            onClick={() =>
              setRoleDropdownUserId(isDropdownOpen ? null : user.id)
            }
            disabled={isChangingRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${roleBadge.bg} ${roleBadge.color} border-current/20 hover:scale-105 disabled:opacity-50`}
          >
            {isChangingRole ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RoleIcon size={12} />
            )}
            {roleBadge.label}
            <ChevronDown
              size={10}
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 z-50 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
              >
                {ROLE_OPTIONS.map(opt => {
                  const OptIcon = opt.icon;
                  const isActive = user.role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSetRole(user.id, opt.value)}
                      disabled={isActive}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 cursor-default'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <OptIcon size={12} />
                      {opt.label}
                      {isActive && (
                        <CheckCircle2 size={12} className="ml-auto text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Membership tier */}
        <div className="sm:col-span-2 flex items-center">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
              user.membershipTier === 'platinum'
                ? 'bg-indigo-500/10 text-indigo-400'
                : user.membershipTier === 'premium'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-white/5 text-slate-500'
            }`}
          >
            {user.membershipTier === 'platinum'
              ? '铂金'
              : user.membershipTier === 'premium'
              ? '高级'
              : '基础'}
          </span>
        </div>

        {/* Last active */}
        <div className="sm:col-span-2 flex items-center text-[10px] text-slate-500 font-bold">
          <Clock size={12} className="mr-1.5 flex-shrink-0" />
          {lastActive}
        </div>

        {/* Actions */}
        <div className="sm:col-span-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedUser(user)}
            className="px-3 py-1.5 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 hover:text-white transition-all"
          >
            详情
          </button>
          <button
            onClick={() => setConfirmDeleteUser(user)}
            disabled={user.role === 'admin' || isDeleting}
            className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title={user.role === 'admin' ? '无法删除管理员' : '删除用户'}
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
            加载用户列表...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Users size={20} />
            </div>
            用户管理
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            管理平台用户角色与权限 {useVirtualScroll && <span className="text-blue-500/50 text-[9px] ml-2">虚拟滚动已启用</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            <Download size={14} />
            {someSelected ? `导出 ${selectedIds.size} 人` : '导出全部'}
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            <RefreshCw size={14} />
            刷新列表
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '总用户', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: '管理员', value: stats.admins, icon: Crown, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'VIP', value: stats.vips, icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: '普通用户', value: stats.regular, icon: User, color: 'text-slate-400', bg: 'bg-slate-400/10' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#0F172A]/60 border border-white/5 rounded-2xl p-5 group hover:border-blue-500/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={rawSearchQuery}
            onChange={e => setRawSearchQuery(e.target.value)}
            placeholder="搜索用户名、邮箱或 ID...（250ms 防抖）"
            className="w-full pl-11 pr-4 py-3 bg-[#0F172A]/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {rawSearchQuery !== debouncedQuery && (
            <Loader2
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/50 animate-spin"
            />
          )}
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'vip', 'user'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                roleFilter === role
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
              }`}
            >
              {role === 'all' ? '全部' : role === 'admin' ? '管理员' : role === 'vip' ? 'VIP' : '普通'}
            </button>
          ))}
        </div>
      </div>

      {/* Batch action bar */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap items-center gap-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl px-6 py-3"
          >
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              已选 {selectedIds.size} 人
            </span>

            {/* Batch role dropdown */}
            <div className="relative">
              <button
                onClick={() => setBatchRoleDropdownOpen(!batchRoleDropdownOpen)}
                disabled={batchProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {batchProcessing ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <UserCog size={12} />
                )}
                批量更改角色
                <ChevronDown
                  size={10}
                  className={`transition-transform ${batchRoleDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {batchRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 z-50 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                  >
                    {ROLE_OPTIONS.map(opt => {
                      const OptIcon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleBatchSetRole(opt.value)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <OptIcon size={12} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Batch delete button */}
            <button
              onClick={() => setShowBatchDeleteConfirm(true)}
              disabled={deletableSelected.length === 0 || batchDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/80 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {batchDeleting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
              批量删除{deletableSelected.length > 0 ? ` (${deletableSelected.length})` : ''}
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto flex items-center gap-1 px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              <X size={12} />
              取消选择
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User table */}
      <div
        ref={listContainerRef}
        className="bg-[#0F172A]/40 border border-white/5 rounded-[2rem] overflow-hidden"
      >
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="col-span-1 flex items-center">
            <button onClick={toggleSelectAll} className="text-slate-500 hover:text-blue-400 transition-colors">
              {allSelected ? (
                <CheckSquare size={16} className="text-blue-400" />
              ) : indeterminate ? (
                <MinusSquare size={16} className="text-blue-400/60" />
              ) : (
                <Square size={16} />
              )}
            </button>
          </div>
          <div className="col-span-3 text-[9px] text-slate-500 font-black uppercase tracking-widest">
            用户
          </div>
          <div className="col-span-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
            角色
          </div>
          <div className="col-span-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
            会员等级
          </div>
          <div className="col-span-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
            最后活跃
          </div>
          <div className="col-span-2 text-[9px] text-slate-500 font-black uppercase tracking-widest text-right">
            操作
          </div>
        </div>

        {/* User rows */}
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-bold">
              {debouncedQuery ? '未找到匹配的用户' : '暂无用户数据'}
            </p>
          </div>
        ) : useVirtualScroll ? (
          /* Virtual scrolling for large lists — custom implementation */
          <VirtualizedUserList
            users={filteredUsers}
            rowHeight={ROW_HEIGHT}
            maxHeight={listHeight}
            renderRow={renderUserRow}
          />
        ) : (
          /* Standard rendering for small lists */
          <div>
            {filteredUsers.map(user => renderUserRow(user))}
          </div>
        )}
      </div>

      {/* Footer counts */}
      <div className="flex items-center justify-between text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2">
        <span>
          显示 {filteredUsers.length} / {users.length} 用户
          {debouncedQuery && ` · 搜索: "${debouncedQuery}"`}
        </span>
        <span>
          {useVirtualScroll ? '虚拟滚动模式' : '标准渲染模式'}
        </span>
      </div>

      {/* User detail modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-tight italic">
                  用户详情
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-8 space-y-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-white/10">
                    <ImageWithFallback
                      src={selectedUser.avatar || defaultAvatarAsset}
                      alt={selectedUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">
                      {selectedUser.firstName}
                      {selectedUser.lastName ? ` ${selectedUser.lastName}` : ''}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const badge = getRoleBadge(selectedUser.role);
                        const BadgeIcon = badge.icon;
                        return (
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${badge.bg} ${badge.color}`}
                          >
                            <BadgeIcon size={10} />
                            {badge.label}
                          </span>
                        );
                      })()}
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                          selectedUser.membershipTier === 'platinum'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : selectedUser.membershipTier === 'premium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-white/5 text-slate-500'
                        }`}
                      >
                        {selectedUser.membershipTier === 'platinum'
                          ? '铂金会员'
                          : selectedUser.membershipTier === 'premium'
                          ? '高级会员'
                          : '基础会员'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">
                      用户 ID
                    </p>
                    <p className="text-xs text-slate-300 font-mono truncate">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Mail size={8} /> 邮箱
                    </p>
                    <p className="text-xs text-slate-300 truncate">
                      {selectedUser.email || '未绑定'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MapPin size={8} /> 位置
                    </p>
                    <p className="text-xs text-slate-300">
                      {selectedUser.location || '未设置'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar size={8} /> 注册日期
                    </p>
                    <p className="text-xs text-slate-300">
                      {selectedUser.joinedAt
                        ? new Date(selectedUser.joinedAt).toLocaleDateString('zh-CN')
                        : '未知'}
                    </p>
                  </div>
                </div>

                {/* Progress stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-blue-400">
                      {selectedUser.completionPercentage}%
                    </p>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">
                      课程完成
                    </p>
                  </div>
                  <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-blue-400">
                      {selectedUser.streakDays}
                    </p>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">
                      连胜天数
                    </p>
                  </div>
                  <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-blue-400">
                      {selectedUser.certificatesCount}
                    </p>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">
                      证书数
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {selectedUser.bio && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2">
                      个人简介
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Single delete confirmation modal */}
      <AnimatePresence>
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteUser(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-[#0F172A] border border-rose-500/20 rounded-[2rem] shadow-2xl relative z-10 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle size={28} className="text-rose-500" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">确认删除用户</h3>
                <p className="text-sm text-slate-400 mb-6">
                  确定要删除用户{' '}
                  <strong className="text-white">{confirmDeleteUser.firstName}</strong>{' '}
                  吗？此操作不可撤销。
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setConfirmDeleteUser(null)}
                    className="flex-1 py-3 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDeleteUser(confirmDeleteUser)}
                    disabled={deletingUserId === confirmDeleteUser.id}
                    className="flex-1 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deletingUserId === confirmDeleteUser.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Batch delete confirmation modal */}
      <AnimatePresence>
        {showBatchDeleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBatchDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#0F172A] border border-rose-500/20 rounded-[2rem] shadow-2xl relative z-10 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle size={28} className="text-rose-500" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">确认批量删除</h3>
                <p className="text-sm text-slate-400 mb-3">
                  即将删除 <strong className="text-rose-400">{deletableSelected.length}</strong> 位用户。
                  此操作不可撤销。
                </p>
                {selectedIds.size > deletableSelected.length && (
                  <p className="text-[10px] text-amber-400/70 bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-2 mb-3 font-bold">
                    注：已选中的管理员账户（{selectedIds.size - deletableSelected.length} 人）将被自动跳过
                  </p>
                )}

                {/* Preview list */}
                <div className="w-full max-h-40 overflow-y-auto bg-white/[0.02] rounded-xl border border-white/5 divide-y divide-white/5 mb-6">
                  {deletableSelected.map(uid => {
                    const u = users.find(usr => usr.id === uid);
                    if (!u) return null;
                    return (
                      <div key={uid} className="flex items-center gap-3 px-4 py-2.5 text-left">
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                          <ImageWithFallback
                            src={u.avatar || defaultAvatarAsset}
                            alt={u.firstName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-white font-bold truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-[9px] text-slate-500 truncate">{u.email || u.id}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowBatchDeleteConfirm(false)}
                    className="flex-1 py-3 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    disabled={batchDeleting}
                    className="flex-1 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {batchDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    确认删除 {deletableSelected.length} 人
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}