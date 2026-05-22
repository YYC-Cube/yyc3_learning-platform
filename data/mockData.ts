import ecommerceImage from 'figma:asset/ef1de2d394b8cd8dc9cb9cf5276c1f07a6bf014c.png';
import adsImage from 'figma:asset/933eaa9cda2c28e15aeb5e2d30a0f55930b237e8.png';
import seoImage from 'figma:asset/25601bea57de09978e36384f75be3733c9a3a805.png';
import iaImage from 'figma:asset/57e98f4ab891889527270818600f25c01460be01.png';
import brandingImage from 'figma:asset/1da7e84aa520c154edbe511fb00866cd1c7d508a.png';
import { defaultAvatarAsset } from '../services/apiService';

export const mockUser = {
  firstName: "Alexandre",
  lastName: "Martin",
  avatar: defaultAvatarAsset,
  completionPercentage: 35,
  unlockedModules: 8,
  totalModules: 32,
  role: 'admin' as const
};

export const mockModules = [
  {
    id: '1',
    title: 'IA Marketing Avancé',
    subtitle: 'Étape 1 – InstaMachine',
    category: 'ia',
    level: 'Confirmé' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 8,
    duration: '4h 30min',
    thumbnail: iaImage,
    isPromoted: true,
    promotedBy: 'Alex Digital'
  },
  {
    id: '2',
    title: 'SEO Technique 2025',
    subtitle: 'Dominez Google en 30 jours',
    category: 'seo',
    level: 'Expert' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 12,
    duration: '6h 15min',
    thumbnail: seoImage
  },
  {
    id: '3',
    title: 'E-commerce Automation',
    subtitle: 'Shopify & Dropshipping Pro',
    category: 'ecom',
    level: 'Débutant' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 10,
    duration: '5h 45min',
    thumbnail: ecommerceImage
  },
  {
    id: '4',
    title: 'Copywriting Émotionnel',
    subtitle: 'Vendez avec les mots qui touchent',
    category: 'copywriting',
    level: 'Confirmé' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 7,
    duration: '3h 20min',
    thumbnail: brandingImage
  },
  {
    id: '5',
    title: 'Branding Personnel',
    subtitle: 'Créez votre marque personnelle',
    category: 'branding',
    level: 'Débutant' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 6,
    duration: '4h 10min',
    thumbnail: brandingImage
  },
  {
    id: '6',
    title: 'Analytics Avancées',
    subtitle: 'Google Analytics 4 Mastery',
    category: 'analytics',
    level: 'Expert' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 9,
    duration: '5h 30min',
    thumbnail: seoImage
  },
  {
    id: '7',
    title: 'Publicité Digitale Avancée',
    subtitle: 'Facebook, Google & TikTok Ads',
    category: 'ads',
    level: 'Expert' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 12,
    duration: '7h 15min',
    thumbnail: adsImage
  }
];