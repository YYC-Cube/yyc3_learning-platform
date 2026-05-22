import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { X, Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import { YYC3API } from '../services/apiService';
import type { BetaFeedbackModalProps } from '../types';

export function BetaFeedbackModal({ isOpen, onClose }: BetaFeedbackModalProps) {
  const { language } = useLanguage();
  const { userId } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await YYC3API.submitFeedback({
        type: 'beta_feedback',
        message,
        rating,
        userId: userId || 'default',
      });
      toast.success(language === 'zh' ? '感谢您的宝贵反馈！' : 'Merci pour votre retour précieux !');
      onClose();
      setMessage('');
      setRating(0);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error(language === 'zh' ? '反馈提交失败，请重试' : 'Erreur lors de l\'envoi du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 border border-white/10 p-8 rounded-3xl z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-500 text-[10px] uppercase font-bold tracking-widest mb-3">
                  <Star className="w-3 h-3 fill-blue-500" />
                  <span>VIP Beta</span>
                </div>
                <h2 className="text-2xl text-white font-bebas tracking-widest uppercase">
                  {language === 'zh' ? '灰度测试反馈' : 'Feedback Bêta VIP'}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold tracking-tighter">
                  {language === 'zh' ? '您对项目看板的体验如何？' : 'Votre expérience avec le Kanban ?'}
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-colors ${rating >= star ? 'text-blue-500' : 'text-gray-700 hover:text-gray-500'}`}
                    >
                      <Star className={`w-6 h-6 ${rating >= star ? 'fill-blue-500' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold tracking-tighter">
                  {language === 'zh' ? '改进建议' : 'Suggestions d\'amélioration'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'zh' ? '请输入您的想法...' : 'Dites-nous ce que vous en pensez...'}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-blue-500/50 min-h-[120px] resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-montserrat font-bold uppercase tracking-widest py-6 rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '发送反馈' : 'Envoyer le feedback'}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}