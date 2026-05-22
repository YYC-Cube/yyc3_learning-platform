import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageContext';
import { 
  Play, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  Gift,
  Video,
  FileText,
  Download,
  ShieldCheck
} from 'lucide-react';

interface ModuleDetailsProps {
  moduleId: string;
  onBack: () => void;
  onLessonStart?: (moduleId: string, lessonId: string) => void;
  isMobile?: boolean;
}

export function ModuleDetails({ moduleId, onBack, onLessonStart, isMobile = false }: ModuleDetailsProps) {
  const { t, language } = useLanguage();
  
  // Mock data - en réalité cela viendrait d'une API
  const moduleData = {
    id: moduleId,
    title: t('ia_module'),
    subtitle: "Étape 1 – InstaMachine",
    price: 250,
    category: t('ia_module'),
    level: language === 'zh' ? '高级' : 'Confirmé',
    duration: "4h 30min",
    studentsCount: 1247,
    rating: 4.8,
    isPromoted: true,
    promotedBy: "Alex Digital",
    description: language === 'zh' 
      ? "掌握人工智能，打造高效营销活动。自动化您的 Instagram 内容并提升参与度。"
      : "Maîtrisez l'intelligence artificielle pour créer des campagnes marketing ultra-performantes. Automatisez vos contenus Instagram et boostez votre engagement.",
    videoThumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    lessons: [
      { id: '1', title: language === 'zh' ? "AI营销简介" : "Introduction à l'IA Marketing", duration: "15 min", type: "video", completed: false },
      { id: '2', title: language === 'zh' ? "InstaMachine 配置" : "Configuration d'InstaMachine", duration: "25 min", type: "video", completed: false },
      { id: '3', title: language === 'zh' ? "自动化模板创建" : "Création de templates automatisés", duration: "35 min", type: "video", completed: false },
      { id: '4', title: language === 'zh' ? "性能优化" : "Optimisation des performances", duration: "20 min", type: "video", completed: false },
      { id: '5', title: language === 'zh' ? "案例分析" : "Cas pratiques et études", duration: "30 min", type: "video", completed: false },
      { id: '6', title: language === 'zh' ? "现成模板" : "Templates prêts à l'emploi", duration: "-", type: "resource", completed: false },
      { id: '7', title: language === 'zh' ? "PDF配置指南" : "Guide de configuration PDF", duration: "-", type: "pdf", completed: false }
    ],
    timeline: [
      { step: 1, title: "InstaMachine", status: "current", description: language === 'zh' ? "Instagram 自动化" : "Automatisation Instagram" },
      { step: 2, title: "TikTok AI", status: "locked", description: language === 'zh' ? "TikTok 智能" : "Intelligence TikTok" },
      { step: 3, title: "YouTube Booster", status: "locked", description: language === 'zh' ? "YouTube 优化" : "Optimisation YouTube" }
    ]
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'resource':
        return <Download className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.type === 'video' && onLessonStart) {
      onLessonStart(moduleId, lesson.id);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-white font-montserrat uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 font-montserrat text-[10px] uppercase">
          {moduleData.category}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vidéo de présentation */}
          <div className="relative group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="aspect-video relative overflow-hidden">
              <ImageWithFallback
                src={moduleData.videoThumbnail}
                alt={moduleData.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-600 text-black shadow-2xl shadow-orange-500/20 transition-all duration-300 hover:scale-110"
                >
                  <Play className="w-10 h-10 fill-current ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-white text-4xl mb-4 font-bebas tracking-widest">{moduleData.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">{moduleData.description}</p>
              
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-800">
                <div className="text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{language === 'zh' ? '时长' : 'Durée'}</p>
                  <p className="text-white font-semibold">{moduleData.duration}</p>
                </div>
                <div className="text-center border-x border-gray-800">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{language === 'zh' ? '学员' : 'Étudiants'}</p>
                  <p className="text-white font-semibold">{moduleData.studentsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{language === 'zh' ? '评分' : 'Note'}</p>
                  <p className="text-orange-500 font-semibold flex items-center justify-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {moduleData.rating}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des leçons */}
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bebas tracking-widest uppercase">{t('lessons')}</h2>
            <div className="space-y-3">
              {moduleData.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-black border border-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 group-hover:text-orange-500 group-hover:border-orange-500/50 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-orange-500 transition-colors">{lesson.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-gray-500 text-xs flex items-center">
                          {getTypeIcon(lesson.type)}
                          <span className="ml-1 uppercase tracking-widest">{lesson.type}</span>
                        </span>
                        {lesson.duration !== '-' && (
                          <span className="text-gray-500 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                    <Play className="w-4 h-4 text-gray-400 group-hover:text-black" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar avec CTA */}
        <div className="space-y-8">
          {/* CTA d'achat */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sticky top-28 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 focus-gradient-bg opacity-20"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] uppercase font-bold tracking-widest border border-orange-500/20">
                  {moduleData.level}
                </span>
                <span className="text-gray-400 text-xs uppercase font-montserrat tracking-tighter">Accès à vie</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">{language === 'zh' ? '单个模块价格' : 'Prix par module'}</p>
                <p className="text-5xl text-white font-bebas tracking-widest">250€</p>
              </div>

              <Button 
                size="lg" 
                className="w-full focus-btn-primary font-montserrat font-bold uppercase tracking-widest py-8 rounded-xl text-lg"
              >
                {t('unlock')}
              </Button>
              
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center text-gray-400 text-xs">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                  {language === 'zh' ? '包含毕业证书' : 'Certificat d\'achèvement inclus'}
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  {language === 'zh' ? '加入专属社区' : 'Accès à la communauté privée'}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline des étapes */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white text-xl font-bebas tracking-widest uppercase mb-6">{language === 'zh' ? '路线图' : 'Parcours Focus'}</h3>
            <div className="space-y-6">
              {moduleData.timeline.map((step) => (
                <div key={step.step} className="flex items-start space-x-4">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    step.status === 'current' 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-gray-800 text-gray-600 border border-gray-700'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${step.status === 'current' ? 'text-white' : 'text-gray-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">{step.description}</p>
                  </div>
                  {step.status === 'current' && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
