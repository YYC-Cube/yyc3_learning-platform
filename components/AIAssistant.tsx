// =============================================================================
// YYC3-Learning-Platform — AI Assistant Widget (Phase 3, Optimized)
// =============================================================================
// Design ref: guidelines/AI.md (IntelligentAIWidget patterns adapted)
// Theme ref:  guidelines/Guidelines.md (radius 0.5rem, glass-panel, deep-sea blue)
// Features:   Draggable position · Minimize/Expand · Multi-view (Chat/Tools/Settings)
//             SSE streaming · Multi-provider · Context-aware · Offline fallback
//             Position persistence · Keyboard shortcuts · Accessibility
// =============================================================================

import {
  AlertTriangle,
  Bot,
  Check,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
  Keyboard,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  Send,
  Server,
  Settings,
  Sparkles,
  StopCircle,
  Trash2,
  User,
  Wifi,
  WifiOff,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAIChat } from '../hooks/useAIChat';
import { YYC3API } from '../services/apiService';
import type {
  AIMessageContext,
  AIProvider,
  AIProviderConfig,
} from '../types';

type LucideIcon = typeof Sparkles;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AIAssistantProps {
  userId?: string;
  currentContext?: AIMessageContext;
  isMobile?: boolean;
}

// ---------------------------------------------------------------------------
// Position persistence
// ---------------------------------------------------------------------------

const POS_STORAGE_KEY = 'yyc3_ai_widget_pos';

interface WidgetPosition { x: number; y: number }

function loadPosition(): WidgetPosition | null {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_e) { /* noop */ }
  return null;
}

function savePosition(pos: WidgetPosition): void {
  try { localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(pos)); } catch (_e) { /* noop */ }
}

function clampPosition(pos: WidgetPosition, width: number, height: number): WidgetPosition {
  const margin = 8;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  return {
    x: Math.max(margin, Math.min(pos.x, vw - width - margin)),
    y: Math.max(margin, Math.min(pos.y, vh - height - margin)),
  };
}

// ---------------------------------------------------------------------------
// Provider metadata
// ---------------------------------------------------------------------------

const PROVIDER_META: Record<
  AIProvider,
  { label: string; icon: LucideIcon; color: string }
> = {
  zhipu: { label: '智谱 Z.AI', icon: Sparkles, color: 'text-blue-400' },
  openai: { label: 'OpenAI', icon: Globe, color: 'text-green-400' },
  ollama: { label: 'Ollama 本地', icon: Cpu, color: 'text-orange-400' },
  custom: { label: '自定义', icon: Server, color: 'text-purple-400' },
};

// ---------------------------------------------------------------------------
// Quick prompts
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
  { label: '📖 解释概念', prompt: '请用简洁易懂的方式解释' },
  { label: '📝 总结要点', prompt: '请帮我总结当前课程的核心要点' },
  { label: '💡 实际案例', prompt: '请给我一个具体的实际应用案例' },
  { label: '🎯 学习建议', prompt: '根据我目前的学习进度，给我一些建议' },
];

// Quick tools for the Tools tab
const QUICK_TOOLS = [
  { id: 'summary', label: '知识点总结', icon: '📋', prompt: '请总结当前模块的全部知识点，生成可复习的清单' },
  { id: 'quiz', label: '生成测验', icon: '✅', prompt: '请根据当前课程内容生成5道选择题来检验我的学习成果' },
  { id: 'mindmap', label: '思维导图', icon: '🗺️', prompt: '请为当前课程内容生成一个文字版思维导图' },
  { id: 'glossary', label: '术语表', icon: '📖', prompt: '请列出当前课程中的核心术语并给出简明解释' },
  { id: 'practice', label: '实战练习', icon: '🔧', prompt: '请为我设计一个与当前课程内容相关的动手实践练习' },
  { id: 'compare', label: '概念对比', icon: '⚖️', prompt: '请对比当前课程中容易混淆的核心概念' },
];

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

type WidgetView = 'chat' | 'tools' | 'settings';

// ---------------------------------------------------------------------------
// Markdown-lite renderer
// ---------------------------------------------------------------------------

function renderContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-1.5 text-slate-300">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  const formatInline = (t: string): React.ReactNode => {
    const parts = t.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={i} className="bg-blue-500/15 text-blue-300 px-1 py-0.5 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>;
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch)
        return (
          <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-0.5">
            {linkMatch[1]}<ExternalLink size={9} />
          </a>
        );
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={`h-${i}`} className="text-white font-bold text-sm mt-2.5 mb-1">{line.slice(4)}</h4>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={`h-${i}`} className="text-white font-bold text-base mt-2.5 mb-1">{line.slice(3)}</h3>);
    } else if (/^[-*]\s/.test(line)) {
      listItems.push(line.replace(/^[-*]\s/, ''));
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      elements.push(
        <div key={`ol-${i}`} className="flex gap-2 my-0.5 text-slate-300">
          <span className="text-blue-400 font-bold text-xs shrink-0 mt-0.5">{line.match(/^\d+/)?.[0]}.</span>
          <span className="leading-relaxed">{formatInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>,
      );
    } else if (line.startsWith('⚠️') || line.startsWith('*（')) {
      flushList();
      elements.push(<p key={`w-${i}`} className="text-amber-400/80 text-xs mt-1.5 italic">{formatInline(line)}</p>);
    } else if (line.trim() === '') {
      flushList();
      elements.push(<div key={`br-${i}`} className="h-1.5" />);
    } else {
      flushList();
      elements.push(<p key={`p-${i}`} className="text-slate-300 leading-relaxed my-0.5">{formatInline(line)}</p>);
    }
  }
  flushList();
  return <div className="space-y-0.5 text-[13px]">{elements}</div>;
}

// ---------------------------------------------------------------------------
// Settings Panel
// ---------------------------------------------------------------------------

const SettingsPanel: React.FC<{
  userId?: string;
  activeProvider: AIProvider;
  onProviderChange: (p: AIProvider) => void;
  onClose: () => void;
  onConfigSaved: () => void;
}> = ({ userId, activeProvider, onProviderChange, onClose, onConfigSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const providers: AIProvider[] = ['zhipu', 'openai', 'ollama', 'custom'];

  const handleSave = async () => {
    setSaving(true);
    try {
      const providerCfg: Partial<AIProviderConfig> = {
        provider: activeProvider,
        model:
          activeProvider === 'zhipu' ? 'glm-4-flash' :
            activeProvider === 'openai' ? 'gpt-4o-mini' : 'llama3.2',
      };
      if (apiKey.trim()) providerCfg.apiKey = apiKey.trim();
      if (customBaseUrl.trim()) providerCfg.baseUrl = customBaseUrl.trim();

      await YYC3API.saveAIConfig(userId || 'default', {
        activeProvider,
        providers: { [activeProvider]: providerCfg as AIProviderConfig },
      });
      toast.success('AI 设置已保存');
      onConfigSaved();
      onClose();
    } catch (err) {
      console.error('Save AI config failed:', err);
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Provider selector */}
      <div className="px-4 py-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">
          AI 服务商
        </label>
        <div className="grid grid-cols-2 gap-2">
          {providers.map((p) => {
            const meta = PROVIDER_META[p];
            const Icon = meta.icon;
            const isActive = activeProvider === p;
            return (
              <button
                key={p}
                onClick={() => onProviderChange(p)}
                className={`relative flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left ${isActive
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                aria-pressed={isActive}
                aria-label={`选择 ${meta.label}`}
              >
                <Icon size={14} className={isActive ? meta.color : 'text-slate-500'} />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{meta.label}</p>
                  <p className="text-[9px] text-slate-600 truncate">
                    {p === 'ollama' ? '免费 · 本地' : p === 'zhipu' ? '有免费模型' : p === 'openai' ? 'GPT-4o' : '自定义端点'}
                  </p>
                </div>
                {isActive && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check size={8} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* API Key */}
        {activeProvider !== 'ollama' && (
          <div>
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">
              API Key
              {activeProvider === 'zhipu' && (
                <span className="text-blue-400 normal-case font-medium ml-1">（环境变量已配置可留空）</span>
              )}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={activeProvider === 'zhipu' ? '智谱 API Key（可选）' : 'sk-...'}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 font-mono pr-9"
                aria-label="API Key 输入"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                aria-label={showKey ? '隐藏密钥' : '显示密钥'}
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {activeProvider === 'zhipu' && (
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                <a href="https://open.bigmodel.cn" target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 underline">open.bigmodel.cn</a>
                {' '}注册 · GLM-4-Flash 免费
              </p>
            )}
          </div>
        )}

        {/* Custom base URL */}
        {(activeProvider === 'custom' || activeProvider === 'ollama') && (
          <div>
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 block">
              API 端点
            </label>
            <input
              type="text"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder={activeProvider === 'ollama' ? 'http://localhost:11434/v1/' : 'https://your-api.com/v1/'}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 font-mono"
              aria-label="API 端点地址"
            />
          </div>
        )}

        {/* Security info */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <AlertTriangle size={9} /> 安全说明
          </p>
          <p className="text-[9px] text-slate-500 leading-relaxed">
            API Key 存储在服务端 KV 中，不会在前端暴露。所有请求通过服务端代理转发。
          </p>
        </div>

        {/* Keyboard shortcuts */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <Keyboard size={9} /> 快捷键
          </p>
          <div className="space-y-0.5 text-[9px] text-slate-500">
            <p><kbd className="bg-white/5 px-1 rounded text-[8px] font-mono">Ctrl+/</kbd> 打开/关闭助手</p>
            <p><kbd className="bg-white/5 px-1 rounded text-[8px] font-mono">Esc</kbd> 关闭面板</p>
            <p><kbd className="bg-white/5 px-1 rounded text-[8px] font-mono">Enter</kbd> 发送消息</p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 py-3 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-[13px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          aria-label="保存 AI 设置"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tools Panel
// ---------------------------------------------------------------------------

const ToolsPanel: React.FC<{
  onToolClick: (prompt: string) => void;
  isLoading: boolean;
}> = ({ onToolClick, isLoading }) => (
  <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
    <div className="mb-3">
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">学习工具</p>
      <p className="text-[11px] text-slate-600">一键使用 AI 辅助学习功能</p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {QUICK_TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolClick(tool.prompt)}
          disabled={isLoading}
          className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all text-left group disabled:opacity-50"
          aria-label={tool.label}
        >
          <span className="text-base shrink-0 mt-0.5">{tool.icon}</span>
          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors font-medium leading-snug">
            {tool.label}
          </span>
        </button>
      ))}
    </div>

    <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-lg p-3">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">使用提示</p>
      <p className="text-[10px] text-slate-600 leading-relaxed">
        工具会根据当前学习上下文自动生成内容。在课程页面使用效果更佳。
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main AI Assistant Component
// ---------------------------------------------------------------------------

export const AIAssistant: React.FC<AIAssistantProps> = ({
  userId,
  currentContext,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeView, setActiveView] = useState<WidgetView>('chat');
  const [inputValue, setInputValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Draggable position (desktop only)
  const [position, setPosition] = useState<WidgetPosition>(() => {
    const saved = loadPosition();
    if (saved) return saved;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    return { x: vw - 440, y: vh - 650 };
  });
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    currentStreamText,
    isLoading,
    isStreaming,
    error,
    config,
    isAvailable,
    sendMessage,
    clearMessages,
    abort,
    reloadConfig,
    switchProvider,
    activeProvider,
    unreadCount,
    markAsRead,
    exportConversation,
  } = useAIChat({ userId, autoLoadConfig: true, persistMessages: true });

  const WIDGET_W = 400;
  const WIDGET_H = 580;

  // ── Keyboard shortcut: Ctrl+/ to toggle ─────────────────────────────────

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamText]);

  // ── Focus input when opening chat view ──────────────────────────────────

  useEffect(() => {
    if (isOpen && !isMinimized && activeView === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, activeView]);

  // ── Mark as read when chat is visible ───────────────────────────────────

  useEffect(() => {
    if (isOpen && !isMinimized && activeView === 'chat') markAsRead();
  }, [isOpen, isMinimized, activeView, markAsRead]);

  // ── Hide quick actions after first message ──────────────────────────────

  useEffect(() => {
    if (messages.length > 0) setShowQuickActions(false);
  }, [messages.length]);

  // ── Drag handlers (pointer events, desktop only) ────────────────────────

  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMobile, position]);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const newPos = clampPosition(
      { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y },
      WIDGET_W, WIDGET_H,
    );
    setPosition(newPos);
  }, [isDragging]);

  const onDragEnd = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    savePosition(position);
  }, [isDragging, position]);

  // ── Send handlers ───────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue;
    setInputValue('');
    setActiveView('chat');
    sendMessage(text, currentContext);
  }, [inputValue, isLoading, sendMessage, currentContext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToolClick = useCallback((prompt: string) => {
    setActiveView('chat');
    sendMessage(prompt, currentContext);
  }, [sendMessage, currentContext]);

  const handleExport = useCallback(() => {
    const text = exportConversation();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('对话已导出');
  }, [exportConversation]);

  const providerMeta = PROVIDER_META[activeProvider];
  const ProviderIcon = providerMeta.icon;

  // ── View tabs ───────────────────────────────────────────────────────────

  const viewTabs: Array<{ id: WidgetView; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }> = [
    { id: 'chat', label: '聊天', icon: MessageSquare },
    { id: 'tools', label: '工具', icon: Wrench },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <>
      {/* ── Floating Button (when closed) ──────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className={`fixed z-[100] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-600/25 flex items-center justify-center group ${isMobile
              ? 'bottom-20 right-4 w-12 h-12 rounded-2xl'
              : 'bottom-8 right-8 w-14 h-14 rounded-2xl'
              }`}
            aria-label="打开 AI 助手 (Ctrl+/)"
            role="button"
          >
            <Bot size={isMobile ? 22 : 26} className="group-hover:rotate-12 transition-transform" />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-[#020617] text-[9px] font-bold text-white flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {/* Pulse */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020617]">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Minimized Pill ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className={`fixed z-[100] flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel-strong shadow-2xl shadow-black/40 cursor-pointer hover:border-blue-500/20 transition-colors ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8'
              }`}
            aria-label="展开 AI 助手"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold">蓝旋</span>
            {isStreaming && <Loader2 size={12} className="text-blue-400 animate-spin" />}
            {unreadCount > 0 && (
              <span className="min-w-[16px] h-[16px] rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <Maximize2 size={12} className="text-slate-500" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Main Widget ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={isMobile ? undefined : { left: position.x, top: position.y, width: WIDGET_W }}
            className={`fixed z-[100] glass-panel-strong rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden ${isMobile ? 'inset-2 bottom-16' : ''
              }`}
            role="dialog"
            aria-label="AI 学习助手「蓝旋」"
            aria-modal="true"
          >
            {/* ── Drag Handle + Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0a1628]/60 select-none">
              {/* Drag grip (desktop only) */}
              {!isMobile && (
                <div
                  className="cursor-grab active:cursor-grabbing p-1 -ml-1 mr-1 text-slate-600 hover:text-slate-400 transition-colors touch-none"
                  onPointerDown={onDragStart}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragEnd}
                  aria-label="拖拽移动"
                >
                  <GripVertical size={14} />
                </div>
              )}

              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-[13px] flex items-center gap-1.5">
                    蓝旋
                    <span className="text-[7px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-px rounded-full font-black uppercase tracking-wider">
                      AI
                    </span>
                  </h3>
                  <div className="flex items-center gap-1">
                    <ProviderIcon size={9} className={providerMeta.color} />
                    <span className="text-[9px] text-slate-500 truncate">{providerMeta.label}</span>
                    {isAvailable ? (
                      <Wifi size={8} className="text-emerald-500 shrink-0" />
                    ) : (
                      <WifiOff size={8} className="text-amber-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button onClick={handleExport} className="p-1.5 text-slate-600 hover:text-blue-400 transition-colors rounded-md hover:bg-white/5" aria-label="导出对话" title="导出对话">
                    <Download size={13} />
                  </button>
                )}
                <button
                  onClick={() => { clearMessages(); setShowQuickActions(true); }}
                  className="p-1.5 text-slate-600 hover:text-amber-400 transition-colors rounded-md hover:bg-white/5"
                  aria-label="清空对话" title="清空对话"
                >
                  <Trash2 size={13} />
                </button>
                <button onClick={() => setIsMinimized(true)} className="p-1.5 text-slate-600 hover:text-white transition-colors rounded-md hover:bg-white/5" aria-label="最小化" title="最小化">
                  <Minimize2 size={13} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-600 hover:text-white transition-colors rounded-md hover:bg-white/5" aria-label="关闭 (Esc)" title="关闭">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── View Tabs ────────────────────────────────────────────── */}
            <div className="flex border-b border-white/5 bg-[#0a1628]/40">
              {viewTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold transition-all border-b-2 ${isActive
                      ? 'text-blue-400 border-blue-500'
                      : 'text-slate-600 border-transparent hover:text-slate-400'
                      }`}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ── Chat View ────────────────────────────────────────────── */}
            {activeView === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar" style={{ minHeight: 0 }}>
                  {/* Welcome */}
                  {messages.length === 0 && !currentStreamText && (
                    <div className="flex flex-col items-center justify-center text-center px-3 py-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/10 flex items-center justify-center mb-3 shadow-xl shadow-blue-600/5">
                        <Sparkles size={24} className="text-blue-400" />
                      </div>
                      <h4 className="text-white font-bold text-sm mb-0.5">你好，我是蓝旋</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed max-w-[260px] mb-4">
                        YYC3 AI 学习助手 · 解答疑问 · 总结知识 · 学习建议
                      </p>

                      {showQuickActions && (
                        <div className="w-full grid grid-cols-2 gap-1.5">
                          {QUICK_ACTIONS.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(action.prompt, currentContext)}
                              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-blue-500/20 rounded-lg px-2.5 py-2 text-left transition-all"
                            >
                              <span className="text-[11px] text-slate-400 hover:text-white transition-colors">
                                {action.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {!isAvailable && (
                        <div className="mt-3 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2 w-full">
                          <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                            <WifiOff size={9} /> 离线模式
                          </p>
                          <p className="text-[9px] text-slate-500 leading-relaxed">
                            未检测到 AI 服务。切换到「设置」标签配置 API Key。
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center ${msg.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/15'
                        : 'bg-indigo-600/15 border border-indigo-500/10'
                        }`}>
                        {msg.role === 'user'
                          ? <User size={12} className="text-blue-400" />
                          : <Bot size={12} className="text-indigo-400" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${msg.role === 'user'
                        ? 'bg-blue-600/15 border border-blue-500/10 rounded-tr-md'
                        : 'bg-white/[0.03] border border-white/5 rounded-tl-md'
                        }`}>
                        {renderContent(msg.content)}
                        <p className="text-[8px] text-slate-700 mt-1.5 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Streaming */}
                  {currentStreamText && (
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center bg-indigo-600/15 border border-indigo-500/10">
                        <Bot size={12} className="text-indigo-400" />
                      </div>
                      <div className="max-w-[80%] rounded-2xl rounded-tl-md px-3.5 py-2.5 bg-white/[0.03] border border-white/5">
                        {renderContent(currentStreamText)}
                        <span className="inline-block w-1 h-3.5 bg-blue-400 rounded-full animate-pulse ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Loading dots */}
                  {isLoading && !currentStreamText && (
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center bg-indigo-600/15 border border-indigo-500/10">
                        <Bot size={12} className="text-indigo-400" />
                      </div>
                      <div className="rounded-2xl rounded-tl-md px-3.5 py-2.5 bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-1">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Context bar */}
                {currentContext?.moduleTitle && (
                  <div className="px-4 py-1 border-t border-white/5 bg-blue-500/5 flex items-center gap-1.5">
                    <Zap size={9} className="text-blue-400 shrink-0" />
                    <span className="text-[9px] text-blue-400/70 truncate">
                      {currentContext.moduleTitle}
                      {currentContext.lessonTitle && ` › ${currentContext.lessonTitle}`}
                    </span>
                  </div>
                )}

                {/* Input */}
                <div className="px-3 py-2.5 border-t border-white/5 bg-[#0a1628]/50">
                  {error && (
                    <div className="mb-1.5 bg-red-500/10 border border-red-500/20 rounded-md px-2.5 py-1.5 flex items-center gap-1.5">
                      <AlertTriangle size={10} className="text-red-400 shrink-0" />
                      <p className="text-[9px] text-red-400 flex-1 truncate">{error}</p>
                    </div>
                  )}
                  <div className="flex items-end gap-1.5">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入问题..."
                      rows={1}
                      className="flex-1 bg-white/[0.03] border border-white/5 focus:border-blue-500/30 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-slate-600 focus:outline-none resize-none max-h-20 transition-colors"
                      style={{ minHeight: 36 }}
                      aria-label="输入消息"
                    />
                    {isStreaming ? (
                      <button onClick={abort} className="shrink-0 w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors" aria-label="停止生成">
                        <StopCircle size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20 disabled:shadow-none"
                        aria-label="发送消息"
                      >
                        <Send size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Tools View ───────────────────────────────────────────── */}
            {activeView === 'tools' && (
              <ToolsPanel onToolClick={handleToolClick} isLoading={isLoading} />
            )}

            {/* ── Settings View ────────────────────────────────────────── */}
            {activeView === 'settings' && (
              <SettingsPanel
                userId={userId}
                activeProvider={activeProvider}
                onProviderChange={switchProvider}
                onClose={() => setActiveView('chat')}
                onConfigSaved={reloadConfig}
              />
            )}

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-white/5 text-center">
              <p className="text-[8px] text-slate-700 font-mono">
                蓝旋 · YYC3 AI · {providerMeta.label} · Ctrl+/ 切换
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
