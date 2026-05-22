import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Globe, 
  Search, 
  Hash, 
  Users, 
  Sparkles,
  Zap,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  AtSign,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import { YYC3API, defaultAvatarAsset } from '../services/apiService';
import { CommentThread } from './CommentThread';
import { toast } from "sonner";
import type { Post } from '../types';

const initialPosts: Post[] = [
  {
    id: '1',
    user: '陈默',
    avatar: defaultAvatarAsset,
    content: '刚刚完成了"现代商业架构"模块，P0 级的实战演练真的受益匪浅。特别是在高并发处理上，Framer 给出的模型非常直观。🚀 #FocusSaaS #架构实战',
    time: '2小时前',
    likes: 24,
    comments: 8,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    role: '高级会员',
    tags: ['架构', '实战']
  },
  {
    id: '2',
    user: 'Sofia Laurent',
    avatar: defaultAvatarAsset,
    content: "L'approche de Focus sur la conception d'interfaces premium est révolutionnaire. Le mélange entre design et business logic est parfait. ✨",
    time: '5小时前',
    likes: 42,
    comments: 12,
    role: 'VIP导师',
    tags: ['Design', 'UI']
  }
];

const channels = [
  { id: 'general', name: '全频道大厅', icon: Globe, count: 1240 },
  { id: 'tech', name: '技术实战拆解', icon: Zap, count: 452 },
  { id: 'business', name: '商业增长洞察', icon: TrendingUp, count: 890 },
  { id: 'qa', name: '问答与求助', icon: MessageSquare, count: 156 }
];

export const Community: React.FC = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState('general');
  const [newPostContent, setNewPostContent] = useState('');

  const fetchPosts = async () => {
    try {
      const data = await YYC3API.getPosts();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(initialPosts);
      }
    } catch (err) {
      console.error('Fetch posts failed', err);
      setPosts(initialPosts);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = async (updatedPosts: Post[]) => {
    try {
      await YYC3API.savePosts(updatedPosts);
    } catch (err) {
      console.error('Save posts failed', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      user: 'Alex Digital',
      avatar: defaultAvatarAsset,
      content: newPostContent,
      time: '刚刚',
      likes: 0,
      comments: 0,
      role: '高级会员',
      tags: ['动态']
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    setNewPostContent('');
    toast.success('发布成功');
  };

  const handleLike = (id: string) => {
    setPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
      savePosts(updated);
      return updated;
    });
  };

  const handleCommentCountChange = (postId: string, newCount: number) => {
    setPosts(prev => {
      const updated = prev.map(p => p.id === postId ? { ...p, comments: newCount } : p);
      savePosts(updated);
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Left Sidebar - Channels */}
      <aside className="w-full lg:w-72 space-y-8">
        <div className="bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-4">讨论频道</h2>
          <div className="space-y-1">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  activeChannel === ch.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <ch.icon size={18} className={activeChannel === ch.id ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'} />
                  <span className="text-[13px] font-black uppercase tracking-tight">{ch.name}</span>
                </div>
                <span className="text-[10px] bg-[#020617] px-2 py-0.5 rounded-lg border border-white/5 font-bold">
                  {ch.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Sparkles size={16} className="text-white fill-current" />
               </div>
               <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">社群挑战赛</p>
            </div>
            <p className="text-xs text-white font-bold leading-relaxed mb-6">
              本周分享优质实战心得，赢取 <span className="text-blue-400">1v1 专家咨询</span> 机会。
            </p>
            <button className="w-full py-3.5 bg-white text-slate-950 text-[10px] font-black rounded-xl hover:bg-blue-50 transition-colors shadow-lg uppercase tracking-wider">
              立即参与
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Feed */}
      <div className="flex-1 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
              精英社区频道 <Users size={24} className="text-blue-500" />
            </h1>
            <p className="text-slate-500 mt-1 font-medium">连接全球顶尖学习者，实时同步业务增长洞察</p>
          </div>
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索话题、动态或成员..." 
              className="bg-[#0F172A]/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all w-full md:w-80 shadow-inner"
            />
          </div>
        </header>

        {/* Create Post */}
        <div className="bg-[#0F172A]/40 backdrop-blur-xl p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[100px] pointer-events-none" />
          <div className="flex gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shrink-0 p-0.5">
               <div className="w-full h-full rounded-[10px] md:rounded-[14px] bg-[#020617] flex items-center justify-center text-blue-400 font-black text-base md:text-xl">A</div>
            </div>
            <div className="flex-1">
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="分享你的实战心得、提问或最新业务进展..." 
                className="w-full bg-transparent border-none text-white focus:outline-none resize-none min-h-[80px] md:min-h-[120px] text-base md:text-lg font-medium placeholder:text-slate-600"
              />
              <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
                <div className="flex gap-4 md:gap-6 text-slate-500">
                  <button className="hover:text-blue-400 transition-colors hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Globe size={16} /> 所有人可见
                  </button>
                  <div className="flex gap-3 md:gap-4 items-center">
                    <button className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors"><ImageIcon size={18} /></button>
                    <button className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors"><Smile size={18} /></button>
                    <button className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors hidden md:block"><AtSign size={18} /></button>
                  </div>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPostContent.trim()}
                  className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 md:px-10 py-3 md:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Send size={14} /> <span className="hidden sm:inline">发布动态</span><span className="sm:hidden">发布</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8 pb-20">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0F172A]/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-blue-500/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg p-0.5 bg-white/5">
                        <ImageWithFallback src={post.avatar} alt={post.user} className="w-full h-full rounded-[14px] object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-[#020617] flex items-center justify-center">
                         <Zap size={10} className="text-white fill-current" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-black text-white group-hover:text-blue-400 transition-colors">{post.user}</p>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20 font-black uppercase tracking-tighter">
                          {post.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] mt-1">{post.time}</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                
                <p className="text-slate-300 text-[16px] leading-relaxed mb-8 font-medium">
                  {post.content}
                </p>

                {post.image && (
                  <div className="rounded-[2.5rem] overflow-hidden border border-white/5 mb-8 shadow-2xl relative group/img">
                    <ImageWithFallback src={post.image} alt="Post content" className="w-full h-auto group-hover/img:scale-[1.05] transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {post.tags && (
                   <div className="flex gap-2 mb-8">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black text-slate-500 hover:text-blue-400 cursor-pointer transition-colors px-3 py-1 bg-white/5 rounded-full border border-white/5">
                          #{tag}
                        </span>
                      ))}
                   </div>
                )}

                <div className="flex items-center gap-10 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2.5 text-xs font-black text-slate-500 hover:text-rose-400 transition-all active:scale-125"
                  >
                    <Heart size={20} className={post.likes > 24 ? "fill-rose-500 text-rose-500" : ""} /> 
                    <span className="tracking-widest">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-xs font-black text-slate-500 hover:text-blue-400 transition-colors">
                    <MessageSquare size={20} /> 
                    <span className="tracking-widest">{post.comments}</span>
                  </button>
                  
                  <div className="ml-auto hidden md:flex items-center gap-4">
                    <span className="text-[9px] text-slate-700 uppercase font-black tracking-[0.3em]">同步到:</span>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#07C160]/5 border border-[#07C160]/20 flex items-center justify-center text-[10px] text-[#07C160]/70 font-black hover:bg-[#07C160]/10 transition-colors cursor-pointer">We</div>
                      <div className="w-8 h-8 rounded-xl bg-[#FF2442]/5 border border-[#FF2442]/20 flex items-center justify-center text-[10px] text-[#FF2442]/70 font-black hover:bg-[#FF2442]/10 transition-colors cursor-pointer">XH</div>
                    </div>
                  </div>
                </div>

                {/* Comment Thread (Phase 2) */}
                <CommentThread
                  postId={post.id}
                  commentCount={post.comments}
                  onCommentCountChange={handleCommentCountChange}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
