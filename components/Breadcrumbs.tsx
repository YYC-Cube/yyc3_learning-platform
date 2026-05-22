import React from 'react';
import { ChevronRight, Home, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import type { BreadcrumbItem, PredictionPath } from '../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  predictions?: PredictionPath[];
  onPredictionClick?: (path: PredictionPath) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, predictions = [], onPredictionClick }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 w-full overflow-hidden">
      <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap py-2 px-1">
        <motion.button 
          whileHover={{ color: '#fff' }}
          className="flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Home size={12} className="text-blue-500" />
          <span className="hidden sm:inline">平台首页</span>
        </motion.button>
        
        {items.map((item, index) => (
          <div key={index} className="contents">
            <ChevronRight size={10} className="text-slate-700 flex-shrink-0" />
            <motion.div
              initial={item.isSearchKeyword ? { scale: 0.9, opacity: 0 } : {}}
              animate={item.isSearchKeyword ? { scale: 1, opacity: 1 } : {}}
              className="flex items-center gap-2 shrink-0"
            >
              {item.isSearchKeyword && (
                <span className="px-1.5 py-0.5 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] text-blue-400 lowercase whitespace-nowrap">
                  # 关联搜索
                </span>
              )}
              <motion.button
                whileHover={!item.active ? { color: '#fff' } : {}}
                onClick={item.onClick}
                disabled={item.active}
                className={`transition-colors whitespace-nowrap ${item.active ? 'text-blue-400 cursor-default' : 'hover:text-white'}`}
              >
                {item.label}
              </motion.button>
            </motion.div>
          </div>
        ))}
      </nav>

      {predictions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1"
        >
          <span className="flex items-center gap-1.5 text-[8px] font-black text-blue-500/60 uppercase tracking-tighter shrink-0">
            <Zap size={10} /> 智能多级路径预测:
          </span>
          <div className="flex gap-3">
            {predictions.map((path, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPredictionClick?.(path)}
                className="group flex flex-col items-start px-3 py-1.5 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                   <span className="text-[9px] text-white font-bold tracking-tight">{path.label}</span>
                   {path.depth && (
                     <span className="text-[7px] text-blue-400 font-black border border-blue-400/30 px-1 rounded-sm">L{path.depth}</span>
                   )}
                </div>
                {path.subLabel && (
                  <span className="text-[7px] text-slate-500 group-hover:text-blue-300 transition-colors uppercase font-medium">{path.subLabel}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};