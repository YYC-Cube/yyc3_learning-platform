import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BetaFeedbackModal } from './BetaFeedbackModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  module: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'IA 落地项目：自动化工作流',
    description: '使用 Make.com 和 OpenAI API 构建一个自动化的内容分发系统。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-02-15',
    module: '人工智能 (IA)'
  },
  {
    id: '2',
    title: 'SEO 关键词调研报告',
    description: '针对电子商务模块进行全行业的关键词竞争度分析。',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-02-20',
    module: '搜索引擎优化 (SEO)'
  },
  {
    id: '3',
    title: '品牌视觉规范设计',
    description: '完成 Focus 平台的高级版视觉标准手册（V.1.0）。',
    status: 'review',
    priority: 'high',
    dueDate: '2026-02-10',
    module: '品牌建设'
  },
  {
    id: '4',
    title: '社交媒体文案策划',
    description: '编写下周发布在微信公众号和 LinkedIn 的推广文案。',
    status: 'done',
    priority: 'low',
    dueDate: '2026-01-25',
    module: '文案写作'
  }
];

export function ProjectsPage({ isMobile = false }: { isMobile?: boolean }) {
  const { t, language } = useLanguage();
  const [tasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const columns = [
    { id: 'todo', title: language === 'zh' ? '待处理' : 'À faire', icon: Clock, color: 'text-gray-400' },
    { id: 'in-progress', title: language === 'zh' ? '进行中' : 'En cours', icon: AlertCircle, color: 'text-orange-500' },
    { id: 'review', title: language === 'zh' ? '审核中' : 'En révision', icon: Calendar, color: 'text-blue-500' },
    { id: 'done', title: language === 'zh' ? '已完成' : 'Terminé', icon: CheckCircle2, color: 'text-green-500' }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">P0</Badge>;
      case 'medium': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px]">P1</Badge>;
      default: return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">P2</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-widest text-white uppercase">{t('my_projects')}</h1>
          <p className="text-gray-500 text-sm mt-1">{language === 'zh' ? '管理你的实战作业与实战项目' : 'Gérez vos projets et exercices pratiques'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white/5 p-1 rounded-lg border border-white/5 flex items-center mr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-3 py-1.5 h-auto rounded-md ${viewMode === 'board' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
              onClick={() => setViewMode('board')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-3 py-1.5 h-auto rounded-md ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            className="focus-btn-primary font-montserrat text-xs uppercase tracking-wider py-5 px-6 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'zh' ? '新建任务' : 'Nouveau'}
          </Button>
          
          {/* VIP Beta Feedback Button */}
          <Button 
            onClick={() => setIsFeedbackOpen(true)}
            variant="ghost"
            className="border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 font-montserrat text-[10px] uppercase tracking-widest py-5 px-4 rounded-xl"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {language === 'zh' ? '测试反馈' : 'Beta Feedback'}
          </Button>
        </div>
      </div>

      <BetaFeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Kanban Board */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}>
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <column.icon className={`w-4 h-4 ${column.color}`} />
                <h3 className="text-white font-bebas tracking-wider uppercase">{column.title}</h3>
                <span className="text-[10px] bg-white/5 text-gray-500 px-1.5 py-0.5 rounded-md border border-white/5">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600 hover:text-gray-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 min-h-[200px] p-2 rounded-2xl bg-white/[0.02] border border-white/5">
              <AnimatePresence>
                {tasks.filter(t => t.status === column.id).map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="p-4 bg-gray-900 border border-white/5 rounded-xl space-y-3 cursor-pointer group hover:border-orange-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{task.module}</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <h4 className="text-white text-sm font-medium leading-tight group-hover:text-orange-500 transition-colors">{task.title}</h4>
                    <p className="text-gray-500 text-xs line-clamp-2">{task.description}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center text-gray-500 text-[10px]">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueDate}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-400/10 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-500">
                        F
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button 
                variant="ghost" 
                className="w-full py-6 border border-dashed border-white/10 text-gray-600 hover:text-gray-400 hover:border-white/20 rounded-xl text-xs"
              >
                <Plus className="w-3 h-3 mr-2" />
                {language === 'zh' ? '添加任务' : 'Ajouter'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
