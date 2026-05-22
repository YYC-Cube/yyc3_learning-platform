// =============================================================================
// YYC3-Learning-Platform — Forgot Password Page
// =============================================================================

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { YYC3API } from '../../services/apiService';
import { ImageWithFallback } from '../figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ForgotPasswordPageProps {
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !newPassword.trim()) {
      toast.error('请填写邮箱和新密码');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('密码长度至少为 6 个字符');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      await YYC3API.resetPassword(email, newPassword);
      setIsSuccess(true);
      toast.success('密码重置成功！即将返回登录页...');
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : '密码重置失败';
      console.error('Password reset failed:', err);
      toast.error(`重置失败：${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 60, 0], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-amber-600/15 blur-[200px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -40, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] right-[-10%] w-[55%] h-[55%] bg-blue-600/15 blur-[200px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* Back button */}
          <button
            onClick={onBack}
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
              className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4 shadow-lg shadow-amber-600/10"
            >
              <KeyRound size={28} className="text-amber-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">重置密码</h1>
            <p className="text-slate-500 text-xs mt-2 text-center font-medium max-w-xs">
              输入您注册时的邮箱地址和新密码，系统将立即更新您的密码
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-emerald-400" />
              </div>
              <p className="text-white font-bold text-lg mb-2">密码已重置</p>
              <p className="text-slate-500 text-sm">正在返回登录页...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">注册邮箱</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="输入您注册时的邮箱"
                    className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-amber-500/10 transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">新密码</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="至少 6 位字符"
                    className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-amber-500/10 transition-all"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">确认新密码</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入新密码"
                    className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-amber-500/10 transition-all"
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
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black uppercase tracking-widest text-xs sm:text-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 flex items-center justify-center gap-2 mt-2 min-h-[48px]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>重置密码</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] mt-6">
          &copy; 2026 YYC3 Learning Platform
        </p>
      </motion.div>
    </div>
  );
}
