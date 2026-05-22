// =============================================================================
// YYC3-Learning-Platform — Register Page
// =============================================================================

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('请填写所有必填字段');
      return;
    }

    if (password.length < 6) {
      toast.error('密码长度至少为 6 个字符');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name);
      toast.success('注册成功，欢迎加入 YYC3！');
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败';
      console.error('Signup failed:', err);
      toast.error(`注册失败：${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-indigo-600/20 blur-[200px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[55%] bg-blue-600/15 blur-[200px] rounded-full"
        />
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Back button */}
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>返回登录</span>
          </button>

          {/* Logo & brand */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/10"
            >
              <ImageWithFallback src={appLogo} alt="YYC3" className="w-10 h-10 object-contain" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">创建账户</h1>
            <p className="text-slate-500 text-xs mt-2 text-center font-medium">加入 YYC3 精英商业学习社区</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">姓名</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入姓名"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">邮箱地址</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">密码</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位字符"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">确认密码</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black uppercase tracking-widest text-xs sm:text-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 mt-2 min-h-[48px]"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>创建账户</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login link */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-xs">
              已有账户？
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1 uppercase tracking-wide transition-colors"
              >
                立即登录
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] mt-6">
          &copy; 2026 YYC3 Learning Platform
        </p>
      </motion.div>
    </div>
  );
}
