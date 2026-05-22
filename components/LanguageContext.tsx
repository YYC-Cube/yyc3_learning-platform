import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Language, TranslationDictionary, LanguageContextValue } from '../types';

const translations: TranslationDictionary = {
  zh: {
    dashboard: '概览仪表盘',
    modules: '核心课程模块',
    services: 'VIP 专享服务',
    live: '大咖直播间',
    discussion: '精英社区频道',
    certificates: '我的专业证书',
    unlock: '立即解锁权限',
    start_lesson: '进入沉浸式学习',
    search: '搜索感兴趣的话题...',
    admin: '管理后台',
    logout: '退出当前系统',
    back: '返回上级',
    all_modules: '全部实战课程',
    categories: '内容分类',
    progress: '系统学习进度',
    lessons: '课程章节',
    active_live: '🔴 正在实时直播',
    session_subtitle: '与 YYC3 专家导师进行实时业务拆解',
    view_live: '立即进入直播间',
    special_offer: '限时专属优惠',
    members: '在线成员',
    send: '发送分享',
    type_message: '分享你的真知灼见...',
    channels: '讨论频道',
    ia_module: '人工智能 (AI) 增长',
    seo_module: '搜索引擎 (SEO) 获客',
    ecommerce_module: '跨境电商实战',
    copywriting_module: '高转化文案策划',
    branding_module: '品牌战略建设',
    analytics_module: '全链路数据分析',
    ads_module: '精准广告投放',
    settings: '系统偏好设置',
    notifications: '实时消息通知',
    profile: '个人账户中心',
    community: '全球精英社区',
    project_mgmt: '敏捷项目管理',
    my_projects: '我的专属项目',
    tasks: '待处理任务',
    upcoming_lives: '即将开启的直播',
    welcome: '欢迎回来',
    unlocked_desc: '已解锁模块',
    pro_member: '高级尊享会员',
    kanban_title: '项目运营看板',
    kanban_desc: 'VIP 专属封闭测试阶段 - 实时并发处理流监控',
    avg_handle_time: '平均处理时效',
    p0_tasks: 'P0 待办任务',
    team_saturation: '团队饱和度',
    completion_rate: '周完成率',
    todo: '待处理',
    in_progress: '进行中',
    done: '已完成'
  },
  fr: {
    dashboard: 'Tableau de bord',
    modules: 'Modules Core',
    services: 'Services VIP',
    live: 'Live Masterclass',
    discussion: 'Canal Communauté',
    certificates: 'Mes Certificats',
    unlock: 'Débloquer l\'accès',
    start_lesson: 'Démarrer la leçon',
    search: 'Rechercher...',
    admin: 'Administration',
    logout: 'Déconnexion',
    back: 'Retour',
    all_modules: 'Tous les modules',
    categories: 'Catégories',
    progress: 'Progression',
    lessons: 'Leçons',
    active_live: '🔴 Live en direct',
    session_subtitle: 'Session stratégique avec l\'équipe YYC3',
    view_live: 'Voir le live',
    special_offer: 'Offre spéciale',
    members: 'Membres',
    send: 'Envoyer',
    type_message: 'Écrire un message...',
    channels: 'Canaux de discussion',
    ia_module: 'IA & Croissance',
    seo_module: 'SEO & Acquisition',
    ecommerce_module: 'E-commerce Pro',
    copywriting_module: 'Copywriting Stratégique',
    branding_module: 'Construction de Marque',
    analytics_module: 'Analyse de Données',
    ads_module: 'Publicité Digitale',
    settings: 'Paramètres',
    notifications: 'Notifications',
    profile: 'Profil',
    community: 'Communauté',
    project_mgmt: 'Gestion de Projet',
    my_projects: 'Mes Projets',
    tasks: 'Tâches',
    upcoming_lives: 'Lives à venir'
  }
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};