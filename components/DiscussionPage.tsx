import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useLanguage } from './LanguageContext';
import { 
  MessageCircle, 
  Users, 
  Hash, 
  TrendingUp, 
  Lock,
  Send,
  Image as ImageIcon,
  Smile,
  PlusCircle,
  Search,
  Pin,
  Languages,
  ArrowRight
} from 'lucide-react';

interface DiscussionPageProps {
  isMobile?: boolean;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isLocked: boolean;
  isPremium?: boolean;
  lastActivity: string;
  unreadCount?: number;
  category: 'general' | 'module' | 'project';
}

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isPinned?: boolean;
}

export function DiscussionPage({ isMobile = false }: DiscussionPageProps) {
  const { t, language } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const channels: Channel[] = [
    {
      id: '1',
      name: language === 'zh' ? '综合讨论' : 'Général',
      description: language === 'zh' ? '所有成员的常规讨论区' : 'Discussion générale pour tous les membres',
      memberCount: 342,
      isLocked: false,
      lastActivity: language === 'zh' ? '5分钟前' : 'Il y a 5 min',
      unreadCount: 12,
      category: 'general'
    },
    {
      id: '2',
      name: t('ecommerce_module'),
      description: language === 'zh' ? '分享您的电子商务策略' : 'Partagez vos stratégies e-commerce',
      memberCount: 156,
      isLocked: false,
      lastActivity: language === 'zh' ? '15分钟前' : 'Il y a 15 min',
      unreadCount: 3,
      category: 'module'
    },
    {
      id: '3',
      name: t('seo_module'),
      description: language === 'zh' ? 'SEO 优化与营销策略' : 'Optimisation et stratégies SEO',
      memberCount: 203,
      isLocked: false,
      lastActivity: language === 'zh' ? '1小时前' : 'Il y a 1h',
      category: 'module'
    },
    {
      id: '4',
      name: t('ia_module'),
      description: language === 'zh' ? '人工智能与自动化讨论' : 'Intelligence artificielle et automatisation',
      memberCount: 89,
      isLocked: false,
      lastActivity: language === 'zh' ? '2小时前' : 'Il y a 2h',
      unreadCount: 5,
      category: 'module'
    },
    {
      id: '5',
      name: t('my_projects'),
      description: language === 'zh' ? '为您的项目寻找合作伙伴' : 'Trouvez des partenaires pour vos projets',
      memberCount: 127,
      isLocked: false,
      lastActivity: language === 'zh' ? '3小时前' : 'Il y a 3h',
      category: 'project'
    },
    {
      id: '6',
      name: 'VIP Mastermind',
      description: language === 'zh' ? '高级会员专属讨论' : 'Discussions exclusives pour membres premium',
      memberCount: 45,
      isLocked: true,
      isPremium: true,
      lastActivity: language === 'zh' ? '30分钟前' : 'Il y a 30 min',
      category: 'general'
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      author: 'Sophie Martin',
      avatar: 'SM',
      content: language === 'zh' ? '大家好！我刚学完电子商务模块。有人有优化转化率的建议吗？' : 'Bonjour à tous ! Je viens de terminer le module E-commerce. Quelqu\'un a des conseils pour optimiser mes conversions ?',
      timestamp: language === 'zh' ? '5分钟前' : 'Il y a 5 min',
      isPinned: true
    },
    {
      id: '2',
      author: 'Thomas Dubois',
      avatar: 'TD',
      content: language === 'zh' ? '你好 Sophie！我通过优化产品详情页将转化率提升了30%。如果你需要，我可以分享我的模板。' : 'Salut Sophie ! J\'ai augmenté mes conversions de 30% en optimisant mes fiches produits. Je te partage mon template si tu veux.',
      timestamp: language === 'zh' ? '3分钟前' : 'Il y a 3 min'
    },
    {
      id: '3',
      author: 'Marie Laurent',
      avatar: 'ML',
      content: language === 'zh' ? '太棒了 Thomas！我也对你的模板感兴趣 🙌' : 'Super initiative Thomas ! Je suis aussi intéressée par ton template 🙌',
      timestamp: language === 'zh' ? '2分钟前' : 'Il y a 2 min'
    }
  ];

  const selectedChannelData = channels.find(c => c.id === selectedChannel);
  
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className="space-y-6 relative z-10 font-inter">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <MessageCircle className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className={`text-white font-bebas tracking-widest ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
            {t('discussion').toUpperCase()}
          </h1>
          <p className="text-gray-400 font-inter text-sm uppercase tracking-tighter">
            {language === 'zh' ? '与 Focus 社区成员交流' : 'Échangez avec la communauté Focus'}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Users, label: language === 'zh' ? '活跃成员' : 'Membres actifs', value: '342', color: 'text-orange-500' },
          { icon: MessageCircle, label: language === 'zh' ? '今日消息' : 'Messages aujourd\'hui', value: '1,247', color: 'text-cyan-400' },
          { icon: TrendingUp, label: language === 'zh' ? '增长率' : 'Croissance', value: '+23%', color: 'text-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center space-x-4">
            <stat.icon className={`w-10 h-10 ${stat.color}`} />
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
              <p className="text-white text-2xl font-bold font-bebas tracking-wider">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-12'} gap-8`}>
        {/* Channels List */}
        <div className={`${isMobile ? 'col-span-1' : 'col-span-4'}`}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden sticky top-28">
            <div className="p-6 border-b border-gray-800 space-y-4">
              <h2 className="text-white text-xl font-bebas tracking-widest uppercase">{t('channels')}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black border-gray-800 text-white rounded-xl focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto p-2 space-y-1">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => !channel.isLocked && setSelectedChannel(channel.id)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-200 group
                    ${selectedChannel === channel.id 
                      ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/10' 
                      : 'hover:bg-gray-800/50 text-gray-400'
                    }
                    ${channel.isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`mt-1 shrink-0 ${selectedChannel === channel.id ? 'text-black' : 'text-gray-500 group-hover:text-orange-500'}`}>
                        {channel.isLocked ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate font-bold ${selectedChannel === channel.id ? 'text-black' : 'text-white group-hover:text-orange-500'}`}>
                            {channel.name}
                          </p>
                          {channel.isPremium && (
                            <Badge className={`${selectedChannel === channel.id ? 'bg-black text-white' : 'bg-orange-500 text-black'} text-[8px] font-bold px-1.5 py-0`}>
                              VIP
                            </Badge>
                          )}
                        </div>
                        <p className={`text-[10px] truncate mt-0.5 ${selectedChannel === channel.id ? 'text-black/70' : 'text-gray-500'}`}>
                          {channel.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`text-[9px] flex items-center uppercase tracking-tighter ${selectedChannel === channel.id ? 'text-black/60' : 'text-gray-600'}`}>
                            <Users className="w-3 h-3 mr-1" />
                            {channel.memberCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <Button 
                variant="outline" 
                className="w-full border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-montserrat uppercase tracking-widest text-[10px]"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {language === 'zh' ? '创建频道' : 'Créer un canal'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${isMobile ? 'col-span-1' : 'col-span-8'}`}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl h-[700px] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 focus-gradient-bg opacity-10 pointer-events-none"></div>
            
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0 bg-gray-900/80 backdrop-blur-md relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-gray-800 flex items-center justify-center">
                  <Hash className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bebas tracking-widest">{selectedChannelData?.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 uppercase tracking-widest mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {selectedChannelData?.memberCount} {t('members')}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
              <AnimatePresence mode="popLayout">
                {mockMessages.map((message, idx) => (
                  <motion.div 
                    key={message.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-start space-x-4 group ${message.isPinned ? 'relative' : ''}`}
                  >
                    {message.isPinned && (
                      <div className="absolute -top-4 left-16 flex items-center space-x-1 text-orange-500 text-[9px] uppercase tracking-widest font-bold">
                        <Pin className="w-2.5 h-2.5" />
                        <span>{language === 'zh' ? '置顶消息' : 'Message épinglé'}</span>
                      </div>
                    )}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 font-bold text-black text-lg shadow-lg shadow-orange-500/10"
                    >
                      {message.avatar}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-3 mb-1">
                        <p className="text-white font-bold">{message.author}</p>
                        <span className="text-gray-600 text-[10px] uppercase tracking-tighter">{message.timestamp}</span>
                      </div>
                      <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 text-gray-300 text-sm leading-relaxed inline-block max-w-2xl group-hover:border-gray-700 transition-colors relative">
                        {message.content}
                        
                        {/* Translation Hint */}
                        <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-7 px-2 bg-gray-800 border border-white/5 text-[10px] text-orange-500 rounded-lg flex items-center space-x-1 shadow-xl"
                          >
                            <Languages className="w-3 h-3" />
                            <span>{language === 'zh' ? '翻译为法语' : 'Traduire en Chinois'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md relative z-10">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder={t('type_message')}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-black border-gray-800 text-white rounded-2xl py-6 pl-6 pr-24 focus:border-orange-500 transition-all shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-orange-500 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-orange-500 transition-colors">
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  size="lg"
                  className="w-14 h-14 rounded-2xl focus-btn-primary shrink-0"
                  disabled={!messageText.trim()}
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

