// =============================================================================
// YYC3-Learning-Platform — Login Page
// =============================================================================

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginPage({ onSwitchToRegister, onForgotPassword }: LoginPageProps) {
  const { login, enterGuestMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('请填写邮箱和密码');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('登录成功，欢迎回来！');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('登录失败：请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setIsLoading(true);
    try {
      await enterGuestMode();
      toast.success('已进入体验模式');
    } catch (err) {
      console.error('Guest mode entry failed:', err);
      toast.error('进入体验模式失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 blur-[200px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -60, 0], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[200px] rounded-full"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* Logo & brand */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/10"
            >
              <ImageWithFallback src={appLogo} alt="YYC3" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">YYC3</h1>
            <p className="text-[10px] sm:text-[11px] text-blue-400 font-black tracking-[0.3em] uppercase mt-1">Learning Platform</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 text-center font-medium">登录您的学习账户</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">邮箱地址</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">密码</label>
                {onForgotPassword && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-[10px] text-blue-400/70 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
                  >
                    忘记密码？
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-12 py-3 sm:py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoComplete="current-password"
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

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs sm:text-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>登录</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">或</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Guest mode */}
          <motion.button
            onClick={handleGuestMode}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-white/[0.07] font-bold uppercase tracking-widest text-xs py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Zap size={14} className="text-blue-400" />
            <span>体验模式（免注册）</span>
          </motion.button>

          {/* Register link */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-xs">
              还没有账户？
              <button
                onClick={onSwitchToRegister}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1 uppercase tracking-wide transition-colors"
              >
                立即注册
                <ArrowRight size={12} className="inline ml-0.5" />
              </button>
            </p>
          </div>
        </div>

        {/* Bottom branding */}
        <p className="text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] mt-6">
          &copy; 2026 YYC3 Learning Platform
        </p>
      </motion.div>
    </div>
  );
}