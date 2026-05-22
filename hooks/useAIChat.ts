// =============================================================================
// YYC3-Learning-Platform — useAIChat Hook (Phase 3, Optimized)
// =============================================================================
// Adapted from BigModel-Z.ai SDK's useChatStream hook.
// Features: SSE streaming, multi-provider, offline fallback,
//           message persistence, retry with backoff, health checks.
// =============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { YYC3API } from '../services/apiService';
import type {
  AIChatMessage,
  AIMessageContext,
  AIConfigResponse,
  AIProvider,
} from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_MESSAGES = 'yyc3_ai_messages';
const STORAGE_KEY_PROVIDER = 'yyc3_ai_provider';
const MAX_PERSISTED_MESSAGES = 50;
const MAX_CONTEXT_MESSAGES = 20;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 1000;

// ---------------------------------------------------------------------------
// Hook Options & Return
// ---------------------------------------------------------------------------

interface UseAIChatOptions {
  userId?: string;
  autoLoadConfig?: boolean;
  persistMessages?: boolean;
}

interface UseAIChatReturn {
  messages: AIChatMessage[];
  currentStreamText: string;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  config: AIConfigResponse | null;
  isAvailable: boolean;
  sendMessage: (content: string, context?: AIMessageContext) => Promise<void>;
  clearMessages: () => void;
  abort: () => void;
  reloadConfig: () => Promise<void>;
  switchProvider: (provider: AIProvider) => void;
  activeProvider: AIProvider;
  /** Number of messages since last read (for unread badge) */
  unreadCount: number;
  /** Mark all messages as read */
  markAsRead: () => void;
  /** Export conversation as text */
  exportConversation: () => string;
}

// ---------------------------------------------------------------------------
// Offline fallback (no API key)
// ---------------------------------------------------------------------------

const OFFLINE_SUGGESTIONS: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['你好', '你是谁', '自我介绍', 'hello', 'hi'],
    answer:
      '你好！我是「蓝旋」，YYC3 学习平台的 AI 学习助手。目前处于离线模式——在 **AI 设置** 中配置 API Key 即可解锁完整对话能力。\n\n智谱 Z.AI 的 **GLM-4-Flash** 模型完全免费，推荐优先体验！',
  },
  {
    keywords: ['课程', '学什么', '推荐', '入门'],
    answer:
      '### 推荐学习路径\n\n1. **IA 营销自动化** — 学习用 AI 工具提升营销效率\n2. **SEO 搜索优化** — 掌握搜索引擎优化核心技术\n3. **电商增长黑客** — 数据驱动的电商运营策略\n\n每个模块都有理论讲解 + 实战案例，建议从"IA 营销自动化"开始。',
  },
  {
    keywords: ['api', 'key', '配置', '设置', '如何使用'],
    answer:
      '### 配置 AI 助手\n\n1. 点击聊天窗口右上角的 ⚙️ 按钮\n2. 选择 AI 服务商（推荐智谱 Z.AI）\n3. 填入 API Key（[智谱开放平台](https://open.bigmodel.cn) 注册即可获取）\n4. 选择模型（**GLM-4-Flash** 免费，推荐新用户使用）\n\n也支持 OpenAI 和本地 Ollama 模型。',
  },
];

function getOfflineResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const s of OFFLINE_SUGGESTIONS) {
    if (s.keywords.some((kw) => lower.includes(kw))) return s.answer;
  }
  return '我目前处于离线模式，无法回答复杂问题。\n\n请在 **AI 设置** 中配置 API Key 来解锁完整功能（智谱 GLM-4-Flash 免费）。\n\n你也可以：\n- 📚 查阅课程资料中的详细讲解\n- 💬 在社区向其他学员提问\n- 📋 使用学习看板追踪进度';
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadPersistedMessages(): AIChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [];
    const msgs = JSON.parse(raw) as AIChatMessage[];
    return Array.isArray(msgs) ? msgs.slice(-MAX_PERSISTED_MESSAGES) : [];
  } catch (_e) {
    return [];
  }
}

function persistMessages(messages: AIChatMessage[]): void {
  try {
    const toSave = messages.slice(-MAX_PERSISTED_MESSAGES);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(toSave));
  } catch (_e) {
    // quota exceeded or private mode — silently fail
  }
}

function loadPersistedProvider(): AIProvider {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROVIDER);
    if (raw && ['zhipu', 'openai', 'ollama', 'custom'].includes(raw)) {
      return raw as AIProvider;
    }
  } catch (_e) {
    // noop
  }
  return 'zhipu';
}

function persistProvider(provider: AIProvider): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
  } catch (_e) {
    // noop
  }
}

// ---------------------------------------------------------------------------
// Unique ID helper
// ---------------------------------------------------------------------------

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { userId, autoLoadConfig = true, persistMessages: shouldPersist = true } = options;

  const [messages, setMessages] = useState<AIChatMessage[]>(() =>
    shouldPersist ? loadPersistedMessages() : [],
  );
  const [currentStreamText, setCurrentStreamText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AIConfigResponse | null>(null);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(loadPersistedProvider);
  const [unreadCount, setUnreadCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  // Derived
  const isAvailable = Boolean(
    config?.hasEnvKey || config?.providers?.some((p) => p.status === 'connected'),
  );

  // ── Persist messages when they change ───────────────────────────────────

  useEffect(() => {
    if (shouldPersist) persistMessages(messages);
  }, [messages, shouldPersist]);

  // ── Load config on mount ────────────────────────────────────────────────

  const reloadConfig = useCallback(async () => {
    try {
      const data = await YYC3API.getAIConfig(userId);
      setConfig(data);
      if (data.activeProvider) {
        setActiveProvider(data.activeProvider);
        persistProvider(data.activeProvider);
      }
    } catch (err) {
      console.error('[useAIChat] Config load failed:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (autoLoadConfig) reloadConfig();
  }, [autoLoadConfig, reloadConfig]);

  // ── Switch provider ─────────────────────────────────────────────────────

  const switchProvider = useCallback((provider: AIProvider) => {
    setActiveProvider(provider);
    persistProvider(provider);
  }, []);

  // ── Mark as read ────────────────────────────────────────────────────────

  const markAsRead = useCallback(() => setUnreadCount(0), []);

  // ── Export conversation ─────────────────────────────────────────────────

  const exportConversation = useCallback((): string => {
    return messages
      .map((m) => {
        const role = m.role === 'user' ? '我' : '蓝旋';
        const time = new Date(m.timestamp).toLocaleString('zh-CN');
        return `[${time}] ${role}:\n${m.content}`;
      })
      .join('\n\n---\n\n');
  }, [messages]);

  // ── Send message (with retry) ───────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string, context?: AIMessageContext) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      retryCountRef.current = 0;

      const userMsg: AIChatMessage = {
        id: makeId('usr'),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        context,
      };

      setMessages((prev) => [...prev, userMsg]);

      // ── Offline fallback ────────────────────────────────────────────
      if (!isAvailable) {
        const offlineMsg: AIChatMessage = {
          id: makeId('off'),
          role: 'assistant',
          content: getOfflineResponse(content),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, offlineMsg]);
        setUnreadCount((c) => c + 1);
        return;
      }

      // ── Streaming request with retry ────────────────────────────────
      const attemptStream = async (): Promise<void> => {
        setIsLoading(true);
        setIsStreaming(true);
        setCurrentStreamText('');

        const abortController = new AbortController();
        abortRef.current = abortController;

        try {
          const historyMessages = [...messages, userMsg]
            .filter((m) => m.role !== 'system')
            .slice(-MAX_CONTEXT_MESSAGES)
            .map((m) => ({ role: m.role, content: m.content }));

          const response = await YYC3API.sendAIChatStream({
            messages: historyMessages,
            userId,
            provider: activeProvider,
            stream: true,
            context,
          });

          // JSON response (non-streaming or error)
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const json = await response.json();
            const aiContent = json?.data?.content || json?.error || '抱歉，AI 暂时无法回应。';
            const assistantMsg: AIChatMessage = {
              id: makeId('ai'),
              role: 'assistant',
              content: aiContent,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setUnreadCount((c) => c + 1);
            return;
          }

          // ── SSE stream parsing ──────────────────────────────────────
          const reader = response.body?.getReader();
          if (!reader) throw new Error('Response body is not readable');

          const decoder = new TextDecoder();
          let buffer = '';
          let fullText = '';

          while (true) {
            if (abortController.signal.aborted) {
              reader.cancel();
              break;
            }

            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const chunk = JSON.parse(data);
                  if (chunk.error) {
                    setError(String(chunk.error));
                    continue;
                  }
                  const delta = chunk.choices?.[0]?.delta?.content;
                  if (delta) {
                    fullText += delta;
                    setCurrentStreamText(fullText);
                  }
                } catch (_e) {
                  // skip unparseable
                }
              }
            }
          }

          if (fullText) {
            const assistantMsg: AIChatMessage = {
              id: makeId('ai'),
              role: 'assistant',
              content: fullText,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setUnreadCount((c) => c + 1);
          }
          setCurrentStreamText('');
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;

          // ── Retry logic ───────────────────────────────────────────
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            const delay = RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
            console.warn(`[useAIChat] Retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`);
            await new Promise((r) => setTimeout(r, delay));
            return attemptStream();
          }

          const errMsg = `AI 请求失败: ${(err as Error).message}`;
          console.error('[useAIChat]', errMsg);
          setError(errMsg);
          setMessages((prev) => [
            ...prev,
            {
              id: makeId('err'),
              role: 'assistant',
              content: `⚠️ ${errMsg}\n\n请检查网络连接或 API Key 配置。`,
              timestamp: Date.now(),
            },
          ]);
          setUnreadCount((c) => c + 1);
        } finally {
          setIsLoading(false);
          setIsStreaming(false);
          abortRef.current = null;
        }
      };

      await attemptStream();
    },
    [messages, userId, activeProvider, isAvailable, isLoading],
  );

  // ── Clear messages ──────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamText('');
    setError(null);
    setUnreadCount(0);
    if (shouldPersist) {
      try { localStorage.removeItem(STORAGE_KEY_MESSAGES); } catch (_e) { /* noop */ }
    }
  }, [shouldPersist]);

  // ── Abort stream ────────────────────────────────────────────────────────

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setIsLoading(false);
    if (currentStreamText) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId('abt'),
          role: 'assistant',
          content: currentStreamText + '\n\n*（已中断）*',
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
    }
  }, [currentStreamText]);

  return {
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
  };
}