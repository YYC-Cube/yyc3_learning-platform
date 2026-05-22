// =============================================================================
// YYC3-Learning-Platform — Comment Thread Component (Phase 2)
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  CornerDownRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { YYC3API, defaultAvatarAsset } from '../services/apiService';
import { toast } from 'sonner';
import type { PostComment } from '../types';

interface CommentThreadProps {
  postId: string;
  commentCount: number;
  onCommentCountChange: (postId: string, newCount: number) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ postId, commentCount, onCommentCountChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!isExpanded) return;
    setLoading(true);
    try {
      const data = await YYC3API.getPostComments(postId);
      setComments(data);
    } catch (err) {
      console.error('Fetch comments failed:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, isExpanded]);

  useEffect(() => {
    if (isExpanded) fetchComments();
  }, [isExpanded, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const comment: Omit<PostComment, 'id' | 'createdAt' | 'likes'> = {
        postId,
        userId: 'current-user',
        userName: '我',
        userAvatar: defaultAvatarAsset,
        userRole: '高级会员',
        content: newComment.trim(),
      };
      const result = await YYC3API.addPostComment(postId, comment);
      setComments(prev => [...prev, result]);
      setNewComment('');
      onCommentCountChange(postId, commentCount + 1);
      toast.success('评论已发布');
    } catch (err) {
      console.error('Submit comment failed:', err);
      toast.error('评论发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const comment: Omit<PostComment, 'id' | 'createdAt' | 'likes'> = {
        postId,
        userId: 'current-user',
        userName: '我',
        userAvatar: defaultAvatarAsset,
        userRole: '高级会员',
        content: replyContent.trim(),
        parentId,
      };
      const result = await YYC3API.addPostComment(postId, comment);
      // Add reply to parent comment locally
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), result] };
        }
        return c;
      }));
      setReplyContent('');
      setReplyingTo(null);
      onCommentCountChange(postId, commentCount + 1);
      toast.success('回复已发布');
    } catch (err) {
      console.error('Submit reply failed:', err);
      toast.error('回复发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diffMin = Math.floor((now - then) / 60000);
    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}小时前`;
    return `${Math.floor(diffHr / 24)}天前`;
  };

  const renderComment = (comment: PostComment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? 'ml-10 pl-4 border-l border-white/5' : ''}`}
    >
      <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
        <ImageWithFallback src={comment.userAvatar || defaultAvatarAsset} alt={comment.userName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white">{comment.userName}</span>
          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">{comment.userRole}</span>
          <span className="text-[9px] text-slate-600">{comment.createdAt ? timeAgo(comment.createdAt) : ''}</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-rose-400 transition-colors">
            <Heart size={12} /> {comment.likes || 0}
          </button>
          {!isReply && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setReplyContent('');
              }}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-blue-400 transition-colors"
            >
              <CornerDownRight size={12} /> 回复
            </button>
          )}
        </div>

        {/* Reply input */}
        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex gap-2"
            >
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply(comment.id);
                  }
                }}
                placeholder={`回复 ${comment.userName}...`}
                className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30"
                autoFocus
              />
              <button
                onClick={() => handleSubmitReply(comment.id)}
                disabled={!replyContent.trim() || submitting}
                className="px-3 py-2 bg-blue-600 rounded-lg text-xs text-white font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                <Send size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors mb-4"
      >
        <MessageSquare size={14} />
        {commentCount} 条评论
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* New comment input */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <ImageWithFallback src={defaultAvatarAsset} alt="Me" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  placeholder="写下你的评论..."
                  className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-all"
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2.5 bg-blue-600 rounded-xl text-sm text-white font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Comments list */}
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm text-slate-600 py-4">暂无评论，来发表第一条吧！</p>
            ) : (
              <div className="space-y-5">
                {comments.map(comment => renderComment(comment))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
