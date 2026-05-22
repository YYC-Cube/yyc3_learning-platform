// =============================================================================
// YYC3-Learning-Platform — Certificates Page (Phase 2 — v3.0.0)
// =============================================================================
// KV-backed certificate management with Canvas PDF generation
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { YYC3API } from '../services/apiService';
import { toast } from 'sonner';
import type { Certificate } from '../types';
import { 
  Trophy,
  Download,
  Share2,
  Calendar,
  Award,
  Target,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  ShieldCheck,
  Printer,
  QrCode,
  Copy,
  RefreshCw,
  Sparkles,
  GraduationCap
} from 'lucide-react';

// =============================================================================
// Sample certificate data (fallback when KV is empty)
// =============================================================================

const sampleCertificates: Certificate[] = [
  {
    id: 'cert-1',
    userId: 'default',
    moduleId: 'ecommerce',
    moduleTitle: 'Expert E-commerce Mastery',
    category: 'E-commerce',
    earnedAt: '2025-01-15',
    validUntil: '2027-01-15',
    credentialId: 'EC-2025-001847',
    skills: ['Shopify', 'Dropshipping', 'Analytics', 'CRO', 'Marketing'],
    issuer: 'YYC3 Academy',
    recipientName: 'Jean Dupont',
    score: 92,
  },
  {
    id: 'cert-2',
    userId: 'default',
    moduleId: 'seo',
    moduleTitle: 'SEO Growth Master',
    category: 'SEO',
    earnedAt: '2025-01-10',
    validUntil: '2027-01-10',
    credentialId: 'SEO-2025-001623',
    skills: ['Technical SEO', 'Content Strategy', 'Backlinks', 'Analytics'],
    issuer: 'YYC3 Academy',
    recipientName: 'Jean Dupont',
    score: 88,
  },
];

// =============================================================================
// Category color mapping
// =============================================================================

const categoryColors: Record<string, { gradient: string; accent: string; bg: string }> = {
  'E-commerce': { gradient: 'from-yellow-500 to-orange-500', accent: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  'SEO': { gradient: 'from-blue-500 to-cyan-400', accent: 'text-blue-400', bg: 'bg-blue-500/10' },
  'IA': { gradient: 'from-purple-500 to-pink-500', accent: 'text-purple-400', bg: 'bg-purple-500/10' },
  'Branding': { gradient: 'from-emerald-500 to-teal-400', accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'Copywriting': { gradient: 'from-rose-500 to-red-400', accent: 'text-rose-400', bg: 'bg-rose-500/10' },
  'Analytics': { gradient: 'from-indigo-500 to-blue-400', accent: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  'Ads': { gradient: 'from-amber-500 to-yellow-400', accent: 'text-amber-400', bg: 'bg-amber-500/10' },
};

const getColor = (category: string) => categoryColors[category] || categoryColors['SEO'];

// =============================================================================
// Canvas PDF Generation
// =============================================================================

const generateCertificatePDF = (cert: Certificate) => {
  const canvas = document.createElement('canvas');
  const W = 1200;
  const H = 850;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#020617');
  bgGrad.addColorStop(0.5, '#0F172A');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Decorative border
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Inner border
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // Corner decorations
  const corners = [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header: YYC3 ACADEMY
  ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
  ctx.font = 'bold 14px system-ui';
  ctx.textAlign = 'center';
  (ctx as any).letterSpacing = '8px';
  ctx.fillText('YYC3  ACADEMY', W / 2, 100);

  // Subtitle
  ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.font = '11px system-ui';
  ctx.fillText('CERTIFICATE  OF  PROFESSIONAL  ACHIEVEMENT', W / 2, 130);

  // Divider line
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 150, 155);
  ctx.lineTo(W / 2 + 150, 155);
  ctx.stroke();

  // "This is to certify that"
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.font = '12px system-ui';
  ctx.fillText('This is to certify that', W / 2, 200);

  // Recipient Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px system-ui';
  ctx.fillText(cert.recipientName, W / 2, 260);

  // "has successfully completed"
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.font = '12px system-ui';
  ctx.fillText('has successfully completed the professional module', W / 2, 310);

  // Module Title
  ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
  ctx.font = 'bold 28px system-ui';
  ctx.fillText(cert.moduleTitle, W / 2, 365);

  // Score
  ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
  ctx.font = 'bold 16px system-ui';
  ctx.fillText(`Score: ${cert.score}/100`, W / 2, 410);

  // Skills
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.font = '11px system-ui';
  ctx.fillText(`Skills: ${cert.skills.join('  •  ')}`, W / 2, 450);

  // Bottom info row
  const bottomY = H - 140;
  
  // Issue Date
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
  ctx.font = 'bold 9px system-ui';
  ctx.fillText('ISSUE DATE', 80, bottomY);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px system-ui';
  ctx.fillText(cert.earnedAt, 80, bottomY + 20);

  // Valid Until
  ctx.fillText(cert.validUntil, 80, bottomY + 45);
  ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
  ctx.font = 'bold 9px system-ui';
  ctx.fillText('VALID UNTIL', 80, bottomY + 35);

  // Credential ID
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
  ctx.font = 'bold 9px system-ui';
  ctx.fillText('CREDENTIAL ID', W - 80, bottomY);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px monospace';
  ctx.fillText(cert.credentialId, W - 80, bottomY + 20);

  // Issuer
  ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
  ctx.font = 'bold 9px system-ui';
  ctx.fillText('ISSUED BY', W - 80, bottomY + 35);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px system-ui';
  ctx.fillText(cert.issuer, W - 80, bottomY + 50);

  // Seal circle center
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2, bottomY + 20, 35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(W / 2, bottomY + 20, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.font = 'bold 8px system-ui';
  ctx.fillText('VERIFIED', W / 2, bottomY + 23);

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YYC3-Certificate-${cert.credentialId}.png`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('证书已下载为 PNG 文件');
  }, 'image/png');
};

// =============================================================================
// Component
// =============================================================================

export function CertificatesPage() {
  const { t, language } = useLanguage();
  const { userId } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'earned' | 'progress'>('earned');

  // Modules still in progress (mock for now)
  const inProgressModules = [
    { id: 'ia', title: 'IA Marketing Avancé', progress: 75, lessonsCompleted: 6, totalLessons: 8 },
    { id: 'copywriting', title: 'Copywriting Persuasif', progress: 40, lessonsCompleted: 3, totalLessons: 7 },
    { id: 'ads', title: 'Facebook & Google Ads', progress: 20, lessonsCompleted: 2, totalLessons: 10 },
  ];

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await YYC3API.getCertificates(userId || 'default');
        if (Array.isArray(data) && data.length > 0) {
          setCertificates(data);
          setSelectedId(data[0].id);
        } else {
          setCertificates(sampleCertificates);
          setSelectedId(sampleCertificates[0].id);
        }
      } catch (err) {
        console.error('Fetch certificates failed:', err);
        setCertificates(sampleCertificates);
        setSelectedId(sampleCertificates[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [userId]);

  const selectedCert = certificates.find(c => c.id === selectedId);

  const handleCopyCredentialId = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    toast.success('凭证 ID 已复制到剪贴板');
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {language === 'zh' ? '专业认证中心' : 'Centre de Certifications'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              {language === 'zh' ? '管理并分享你的专业认证资质' : 'Gérez et partagez vos certifications professionnelles'}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          <div className="bg-[#0F172A]/50 border border-white/5 rounded-2xl px-5 py-3 text-center">
            <p className="text-xl font-black text-white">{certificates.length}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              {language === 'zh' ? '已获证书' : 'Obtenus'}
            </p>
          </div>
          <div className="bg-[#0F172A]/50 border border-white/5 rounded-2xl px-5 py-3 text-center">
            <p className="text-xl font-black text-emerald-400">{inProgressModules.length}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              {language === 'zh' ? '进行中' : 'En cours'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {[
          { key: 'earned' as const, label: language === 'zh' ? '已获证书' : 'Obtenus', icon: Award },
          { key: 'progress' as const, label: language === 'zh' ? '学习进度' : 'En cours', icon: Target },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'earned' ? (
          <motion.div
            key="earned"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-8"
          >
            {/* Certificate List */}
            <div className="xl:col-span-4 space-y-3">
              {certificates.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <GraduationCap size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold">{language === 'zh' ? '暂无证书' : 'Aucun certificat'}</p>
                  <p className="text-xs mt-1">{language === 'zh' ? '完成模块后自动颁发' : 'Terminez un module pour obtenir un certificat'}</p>
                </div>
              ) : (
                certificates.map((cert) => {
                  const color = getColor(cert.category);
                  return (
                    <motion.div
                      key={cert.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedId(cert.id)}
                      className={`bg-[#0F172A]/50 backdrop-blur-md border rounded-2xl p-4 cursor-pointer transition-all ${
                        selectedId === cert.id
                          ? 'border-blue-500/40 bg-blue-500/5 shadow-lg shadow-blue-500/5'
                          : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                          <Award size={24} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-bold truncate">{cert.moduleTitle}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] ${color.accent} ${color.bg} px-2 py-0.5 rounded font-bold uppercase`}>
                              {cert.category}
                            </span>
                            <span className="text-[10px] text-slate-600">{cert.earnedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-400">{cert.score}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Certificate Preview + Actions */}
            <div className="xl:col-span-8">
              {selectedCert ? (
                <div className="bg-[#0F172A]/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Action Bar */}
                  <div className="p-4 sm:p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-black/30">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-500" />
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Official Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCredentialId(selectedCert.credentialId)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Copy size={14} />
                        <span className="hidden sm:inline">复制 ID</span>
                      </button>
                      <button
                        onClick={() => generateCertificatePDF(selectedCert)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        <Download size={14} />
                        {language === 'zh' ? '下载证书' : 'Télécharger'}
                      </button>
                    </div>
                  </div>

                  {/* Certificate Visual */}
                  <div className="p-6 sm:p-10 md:p-16 bg-[#050505] relative overflow-hidden">
                    {/* Background watermark */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex flex-wrap gap-16 p-8 rotate-12 scale-150">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <span key={i} className="text-3xl font-black tracking-widest text-white whitespace-nowrap">YYC3 ACADEMY VERIFIED</span>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={selectedCert.id}
                      className="w-full max-w-2xl mx-auto aspect-[1.414/1] bg-gradient-to-br from-[#0F172A] to-[#020617] border-[6px] border-double border-blue-500/20 rounded-lg p-6 sm:p-10 flex flex-col items-center justify-between relative shadow-2xl"
                    >
                      {/* Decorative corners */}
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-500/30" />
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-500/30" />
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-blue-500/30" />
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-blue-500/30" />

                      {/* Top section */}
                      <div className="text-center space-y-3 w-full">
                        <div className="text-blue-400 font-black text-lg sm:text-xl tracking-[0.3em] uppercase">
                          YYC3 Academy
                        </div>
                        <div className="text-slate-600 text-[8px] sm:text-[10px] tracking-[0.4em] uppercase">
                          Certificate of Professional Achievement
                        </div>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mx-auto" />
                      </div>

                      {/* Middle section */}
                      <div className="text-center space-y-4 flex-1 flex flex-col justify-center w-full py-4">
                        <p className="text-slate-500 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">This is to certify that</p>
                        <h2 className="text-white font-black text-2xl sm:text-4xl tracking-wider uppercase">
                          {selectedCert.recipientName}
                        </h2>
                        <p className="text-slate-500 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
                          has successfully completed the professional module
                        </p>
                        <h3 className="text-blue-400 font-black text-lg sm:text-2xl tracking-wider uppercase">
                          {selectedCert.moduleTitle}
                        </h3>
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <span className="text-emerald-400 font-bold text-sm">Score: {selectedCert.score}/100</span>
                          <Sparkles size={14} className="text-yellow-500" />
                        </div>
                      </div>

                      {/* Bottom section */}
                      <div className="grid grid-cols-3 w-full items-end gap-2">
                        <div className="text-left space-y-1">
                          <p className="text-[8px] sm:text-[9px] text-slate-600 uppercase tracking-widest font-bold">Issue Date</p>
                          <p className="text-[10px] sm:text-xs text-white font-mono">{selectedCert.earnedAt}</p>
                        </div>
                        <div className="flex justify-center">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-blue-500/20 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-1 border border-blue-500/10 rounded-full" />
                            <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500/30" />
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[8px] sm:text-[9px] text-slate-600 uppercase tracking-widest font-bold">Credential ID</p>
                          <p className="text-[10px] sm:text-xs text-white font-mono">{selectedCert.credentialId}</p>
                        </div>
                      </div>

                      {/* Seal */}
                      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 rotate-12 opacity-60 pointer-events-none">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-500/30 font-black text-[8px] sm:text-[9px] uppercase tracking-wider">Verified</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Certificate Metadata */}
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 bg-black/20">
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1">技能标签</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCert.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">{skill}</span>
                        ))}
                        {selectedCert.skills.length > 3 && (
                          <span className="text-[9px] text-slate-600 font-bold">+{selectedCert.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1">有效期至</p>
                      <p className="text-xs text-white font-mono">{selectedCert.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1">颁发机构</p>
                      <p className="text-xs text-white">{selectedCert.issuer}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-1">最终分数</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${selectedCert.score >= 90 ? 'bg-emerald-500' : selectedCert.score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{ width: `${selectedCert.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-white font-bold">{selectedCert.score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0F172A]/30 border border-white/5 rounded-3xl p-12 text-center">
                  <Award size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-500 font-bold">{language === 'zh' ? '选择一个证书查看详情' : 'Sélectionnez un certificat'}</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-sm text-slate-400 mb-6">
              {language === 'zh'
                ? '完成以下模块（观看 ≥90% 课时）即可自动获得认证证书：'
                : 'Terminez les modules suivants (≥90% de cours regardés) pour obtenir automatiquement votre certificat :'}
            </p>

            {inProgressModules.map((mod) => (
              <motion.div
                key={mod.id}
                whileHover={{ scale: 1.005 }}
                className="bg-[#0F172A]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <GraduationCap size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{mod.title}</h4>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                        {mod.lessonsCompleted} / {mod.totalLessons} {language === 'zh' ? '课时已完成' : 'leçons terminées'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${mod.progress >= 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {mod.progress}%
                    </span>
                    {mod.progress >= 90 ? (
                      <CheckCircle size={16} className="text-emerald-500" />
                    ) : (
                      <Clock size={16} className="text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${mod.progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                  />
                  {/* 90% threshold marker */}
                  <div className="absolute top-0 h-full w-px bg-emerald-500/40" style={{ left: '90%' }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-slate-600 font-bold">
                    {language === 'zh' ? '观看 ≥90% 自动颁发证书' : 'Certificat auto à ≥90%'}
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold">
                    {language === 'zh' ? `还需 ${Math.max(0, Math.ceil(mod.totalLessons * 0.9) - mod.lessonsCompleted)} 课时` : `${Math.max(0, Math.ceil(mod.totalLessons * 0.9) - mod.lessonsCompleted)} leçons restantes`}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
