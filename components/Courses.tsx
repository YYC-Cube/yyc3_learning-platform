import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, Star, Users, ArrowRight } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { ImageWithFallback } from './figma/ImageWithFallback';

const courses = [
  {
    id: 1,
    title: '现代商业系统架构设计',
    category: '技术管理',
    image: 'https://images.unsplash.com/photo-1687603917313-ccae1a289a9d?w=800',
    duration: '12 课时',
    rating: 4.9,
    students: '1.2k',
    description: '深入探讨支持高并发与全球化部署的企业级架构方案。'
  },
  {
    id: 2,
    title: '交互设计的艺术：Framer 进阶',
    category: '设计思维',
    image: 'https://images.unsplash.com/photo-1632935894305-f4567891251e?w=800',
    duration: '8 课时',
    rating: 4.8,
    students: '850',
    description: '利用 Framer Motion 打造具有生命力的数字化产品体验。'
  },
  {
    id: 3,
    title: '数字化转型的商业逻辑',
    category: '商业战略',
    image: 'https://images.unsplash.com/photo-1760528165608-d2ec372f0276?w=800',
    duration: '15 课时',
    rating: 5.0,
    students: '2.1k',
    description: '解构顶级咨询公司的数字化增长方法论与实操案例。'
  }
];

export const Courses: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">核心课程模块</h1>
          <p className="text-slate-400 mt-1">专为追求极致性能与用户体验的商业领袖打造。</p>
        </div>
        <div className="flex gap-3 bg-slate-900/50 p-1 rounded-full border border-white/5">
          {['全部', '技术', '设计', '战略'].map(tab => (
            <button 
              key={tab}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                tab === '全部' 
                  ? 'bg-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="group relative bg-[#0F172A] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full hover:border-blue-500/40 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_50px_rgba(37,99,235,0.15)]"
          >
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90" />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-blue-600/20 backdrop-blur-xl text-[10px] text-blue-400 font-bold rounded-full border border-blue-500/30 uppercase tracking-[0.2em]">
                  {course.category}
                </span>
              </div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/10 backdrop-blur-[2px]"
              >
                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Play size={28} className="fill-current ml-1" />
                </div>
              </motion.div>
            </div>

            <div className="p-8 flex flex-col flex-1 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                <Star size={20} className="fill-current" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                {course.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                {course.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center">
                  <Clock size={14} className="text-blue-400 mb-1.5" />
                  <span className="text-xs text-white font-bold">{course.duration}</span>
                </div>
                <div className="flex flex-col items-center border-x border-white/10">
                  <Star size={14} className="text-amber-400 mb-1.5 fill-current" />
                  <span className="text-xs text-white font-bold">{course.rating}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users size={14} className="text-indigo-400 mb-1.5" />
                  <span className="text-xs text-white font-bold">{course.students}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <PremiumButton className="w-full mr-4" />
                <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
