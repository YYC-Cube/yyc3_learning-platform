import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MoreHorizontal, 
  Plus, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search,
  LayoutGrid,
  List,
  Lock
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { YYC3API } from '../services/apiService';
import { useLanguage } from './LanguageContext';
import { toast } from "sonner";
import type { Task, TaskPriority, TaskStatus } from '../types';
import type { LucideIcon } from 'lucide-react';

const ItemTypes = {
  CARD: 'card',
};

const initialTasks: Task[] = [
  { id: '1', title: '高并发系统压力测试 (3.0 核心版本)', priority: 'P0', status: 'in-progress', assignee: '张伟', dueDate: '今日 18:00', tags: ['内核', '测试'] },
  { id: '2', title: '交互动画回归测试 (motion/react)', priority: 'P1', status: 'todo', assignee: '李芳', dueDate: '明日', tags: ['UI/UX'] },
  { id: '3', title: '法语国际化文案核对', priority: 'P2', status: 'done', assignee: '王强', dueDate: '已完成', tags: ['国际化'] },
  { id: '4', title: 'VIP 成员权限 API 联调', priority: 'P0', status: 'todo', assignee: '张伟', dueDate: '2月1日', tags: ['API', '安全'] },
  { id: '5', title: '蓝图架构文档更新', priority: 'P1', status: 'in-progress', assignee: '陈美', dueDate: '周五', tags: ['文档'] },
];

interface KanbanCardProps {
  task: Task;
  moveCard: (id: string, status: TaskStatus) => void;
  getPriorityStyle: (p: TaskPriority) => string;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, moveCard, getPriorityStyle }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = React.useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all cursor-grab active:cursor-grabbing group shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {task.tags.map(tag => (
              <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
                {tag}
              </span>
            ))}
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-relaxed mb-6">
          {task.title}
        </h4>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg">
                {task.assignee.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1e293b]" />
            </div>
            <div>
              <p className="text-[10px] text-white font-bold leading-none">{task.assignee}</p>
              <p className="text-[9px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">负责人</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-blue-400 transition-colors">
              <Clock size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{task.dueDate}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  tasks: Task[];
  moveCard: (id: string, status: TaskStatus) => void;
  getPriorityStyle: (p: TaskPriority) => string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, label, icon: Icon, color, glow, tasks, moveCard, getPriorityStyle }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: string }) => moveCard(item.id, id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const dropRef = React.useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div 
      ref={dropRef} 
      className={`flex flex-col bg-[#0F172A]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-6 shadow-2xl relative overflow-hidden group/col transition-all ${isOver ? 'bg-blue-600/10 border-blue-500/30' : ''}`}
    >
      <div className={`absolute inset-0 ${glow} opacity-20 pointer-events-none group-hover/col:opacity-40 transition-opacity`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl bg-slate-800/50 ${color}`}>
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{label}</h3>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              {tasks.length} 项任务
            </span>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar relative z-10 pb-4 min-h-[100px]">
        <AnimatePresence>
          {tasks.map((task) => (
            <KanbanCard 
              key={task.id} 
              task={task} 
              moveCard={moveCard} 
              getPriorityStyle={getPriorityStyle} 
            />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-48 text-slate-600 border-2 border-dashed border-white/5 rounded-[2rem]"
          >
             <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-white/5">
                <Plus className="text-slate-700" size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">暂无挂起任务</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Kanban: React.FC = () => {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await YYC3API.getTasks();
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
      } else {
        setTasks(initialTasks);
      }
    } catch (err) {
      console.error('Fetch tasks failed', err);
      setTasks(initialTasks);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await YYC3API.saveTasks(newTasks);
    } catch (err) {
      console.error('Save tasks failed', err);
      toast.error('保存任务失败');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveCard = useCallback((id: string, status: TaskStatus) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(t => t.id === id ? { ...t, status } : t);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case 'P0': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'P1': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
      case 'P2': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
    }
  };

  const columns = [
    { id: 'todo' as const, label: t('todo'), icon: Clock, color: 'text-slate-400', glow: 'bg-slate-500/5' },
    { id: 'in-progress' as const, label: t('in_progress'), icon: AlertCircle, color: 'text-blue-400', glow: 'bg-blue-500/5' },
    { id: 'done' as const, label: t('done'), icon: CheckCircle2, color: 'text-emerald-400', glow: 'bg-emerald-500/5' },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-black tracking-widest uppercase">VIP Exclusive</span>
              <span className="text-[9px] bg-white/5 text-slate-500 px-2 py-0.5 rounded border border-white/10 font-bold uppercase tracking-tighter">Sandbox 3.4.1</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              {t('kanban_title')} <Lock size={20} className="text-blue-500" />
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-sm">{t('kanban_desc')}</p>
          </motion.div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索任务或负责人..." 
                  className="bg-slate-900/50 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all w-64 shadow-inner"
                />
             </div>
             
             <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-2xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <List size={18} />
                </button>
             </div>
             
             <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase text-[10px] tracking-widest">
              <Plus size={18} />
              创建任务
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('avg_handle_time'), value: '1.4h', trend: '-12%', icon: Clock, color: 'text-blue-400' },
            { label: t('p0_tasks'), value: tasks.filter(t => t.priority === 'P0').length.toString().padStart(2, '0'), trend: '+1', icon: AlertCircle, color: 'text-rose-400' },
            { label: t('team_saturation'), value: '82%', trend: 'Stable', icon: LayoutGrid, color: 'text-emerald-400' },
            { label: t('completion_rate'), value: '94.2%', trend: '+2.1%', icon: CheckCircle2, color: 'text-indigo-400' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 flex items-center gap-4 group hover:border-blue-500/20 transition-all"
            >
              <div className={`p-3 rounded-2xl bg-[#020617] ${stat.color} group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-white leading-none">{stat.value}</p>
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${stat.trend.startsWith('-') ? 'text-emerald-400' : stat.trend === 'Stable' ? 'text-slate-400' : 'text-rose-400'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
          {columns.map((col) => (
            <KanbanColumn 
              key={col.id} 
              id={col.id}
              label={col.label}
              icon={col.icon}
              color={col.color}
              glow={col.glow}
              tasks={tasks.filter(t => t.status === col.id)}
              moveCard={moveCard}
              getPriorityStyle={getPriorityStyle}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};