export const CATEGORY_TITLES = {
  dashboard: 'Dashboard',
  live: 'Live & Sessions',
  discussion: 'Canaux de Discussion',
  ecom: 'Modules E-commerce',
  seo: 'Modules SEO',
  ia: 'Modules Intelligence Artificielle',
  branding: 'Modules Branding',
  copywriting: 'Modules Copywriting',
  analytics: 'Modules Analytics',
  ads: 'Modules Publicité',
  services: 'Services',
  certificates: 'Certificats'
} as const;

export type CategoryKey = keyof typeof CATEGORY_TITLES;