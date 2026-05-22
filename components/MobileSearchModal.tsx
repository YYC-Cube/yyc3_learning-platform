import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const recentSearches = ['高并发架构', 'AI 营销', 'SEO 优化', '电商运营'];
const trendingTopics = ['DDD 实战', '全链路自动化', 'SaaS 增长黑客', 'Redis 缓存策略'];

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input with a small delay to allow animation
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    onSearch(searchTerm.trim());
    onClose();
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    handleSubmit(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#020617]/95 backdrop-blur-2xl flex flex-col"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(query);
                }}
                placeholder="搜索课程、话题..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <X size={22} />
            </button>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Recent Searches */}
            <div>
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Clock size={12} /> 最近搜索
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-xs text-slate-300 font-bold hover:bg-blue-600/10 hover:border-blue-500/20 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Clock size={12} className="text-slate-600" />
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div>
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Sparkles size={12} className="text-blue-500" /> 热门趋势
              </h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, i) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickSearch(topic)}
                    className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-blue-600/5 hover:border-blue-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-800 group-hover:text-blue-500/40 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-slate-300 font-bold group-hover:text-white transition-colors">
                        {topic}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
