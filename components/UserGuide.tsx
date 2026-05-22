import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';
import { 
  BookOpen, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Users, 
  MessageSquare,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export function UserGuide() {
  const { language, t } = useLanguage();

  const steps = [
    {
      title: language === 'zh' ? '1. 探索课程' : '1. Explorer les modules',
      description: language === 'zh' ? '在仪表盘浏览不同类别的商业培训课程。' : 'Naviguez à travers les différentes catégories de formation.',
      icon: BookOpen
    },
    {
      title: language === 'zh' ? '2. 解锁内容' : '2. Débloquer le contenu',
      description: language === 'zh' ? '点击“解锁 - 250€”按钮，通过安全支付获取永久访问权限。' : 'Cliquez sur "Débloquer" pour obtenir un accès à vie via un paiement sécurisé.',
      icon: CreditCard
    },
    {
      title: language === 'zh' ? '3. 互动学习' : '3. Apprentissage interactif',
      description: language === 'zh' ? '观看高清视频课程，并在社区频道与讲师及同学交流。' : 'Regardez les leçons et échangez avec la communauté Focus.',
      icon: MessageSquare
    },
    {
      title: language === 'zh' ? '4. 获取证书' : '4. Obtenir votre certificat',
      description: language === 'zh' ? '完成所有课时后，在“我的证书”页面下载官方认证。' : 'Téléchargez votre certificat officiel une fois le module terminé.',
      icon: Award
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 font-inter">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-500 text-[10px] uppercase font-bold tracking-widest">
          <HelpCircle className="w-3 h-3" />
          <span>{language === 'zh' ? '系统操作指南' : 'Guide d\'utilisation'}</span>
        </div>
        <h1 className="text-4xl md:text-6xl text-white font-bebas tracking-widest uppercase">
          {language === 'zh' ? '快速上手 FOCUS' : 'Démarrer avec Focus'}
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          {language === 'zh' 
            ? '欢迎来到您的商业加速中心。本文档将指导您完成从浏览到认证的完整流程。' 
            : 'Bienvenue dans votre centre d\'accélération business. Suivez ce guide pour maîtriser la plateforme.'}
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-900 border-white/5 h-full hover:border-orange-500/30 transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                  <step.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-2xl text-white font-bebas tracking-widest uppercase border-l-4 border-orange-500 pl-4">
          {language === 'zh' ? '核心功能说明' : 'Fonctionnalités clés'}
        </h2>
        
        <div className="space-y-4">
          {[
            {
              label: language === 'zh' ? '多端适配' : 'Compatibilité multi-supports',
              desc: language === 'zh' ? 'Focus 深度适配折叠屏、平板及移动设备，确保在任何屏幕上都具备极致视觉表现。' : 'Focus est optimisé pour les écrans pliables, tablettes et mobiles.',
              icon: Smartphone
            },
            {
              label: language === 'zh' ? '双语一键切换' : 'Interface Bilingue',
              desc: language === 'zh' ? '点击顶部导航栏的语言图标，可在中法双语之间无缝切换。' : 'Basculez entre le Chinois et le Français en un clic.',
              icon: Users
            },
            {
              label: language === 'zh' ? '项目管理看板' : 'Tableau de bord de projet',
              desc: language === 'zh' ? '使用看板系统追踪您的学习任务，支持 P0-P2 优先级管理。' : 'Gérez vos projets avec le système Kanban intégré (P0-P2).',
              icon: CheckCircle2
            }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <item.icon className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{item.label}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-orange-500 rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-orange-500/20">
        <ShieldCheck className="w-16 h-16 text-black mx-auto" />
        <h2 className="text-black text-3xl font-bebas tracking-widest uppercase">
          {language === 'zh' ? '准备好开启你的 Focus 旅程了吗？' : 'Prêt à commencer votre aventure Focus ?'}
        </h2>
        <Button className="bg-black text-white hover:bg-gray-900 px-12 py-8 rounded-2xl font-montserrat font-bold uppercase tracking-widest">
           {language === 'zh' ? '进入学习大厅' : 'Accéder au Hub'}
           <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
