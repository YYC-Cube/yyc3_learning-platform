import ecommerceImage from 'figma:asset/ef1de2d394b8cd8dc9cb9cf5276c1f07a6bf014c.png';
import adsImage from 'figma:asset/933eaa9cda2c28e15aeb5e2d30a0f55930b237e8.png';
import seoImage from 'figma:asset/25601bea57de09978e36384f75be3733c9a3a805.png';
import iaImage from 'figma:asset/57e98f4ab891889527270818600f25c01460be01.png';
import brandingImage from 'figma:asset/1da7e84aa520c154edbe511fb00866cd1c7d508a.png';
// Import defaultAvatarAsset directly to avoid circular dependency with apiService
const defaultAvatarAsset = '/yyc3-dist/yanyu_cloud_64x64.png';

export const detailedModules = [
  {
    id: 'ecommerce',
    title: '跨境电商实战精通',
    subtitle: '创建并优化您的全球在线商店',
    category: 'ecom',
    level: '高级' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 15,
    duration: '8h 30min',
    thumbnail: ecommerceImage,
    description: '学习如何创建、管理和优化高性能的电子商务商店。从设计到销售，掌握电子商务的各个方面。',
    keyPoints: [
      'Shopify/WooCommerce 完整配置',
      '高级转化率优化策略',
      '全自动销售流程',
      '全链路性能分析',
      '全球化扩张与增长'
    ],
    lessons: [
      { id: '1', title: '电子商务概论', duration: '25min', isCompleted: false },
      { id: '2', title: '平台选型与架构', duration: '35min', isCompleted: false },
      { id: '3', title: '商店设计与 UX 优化', duration: '45min', isCompleted: false },
      { id: '4', title: '高转化产品目录设计', duration: '40min', isCompleted: false },
      { id: '5', title: '全球定价策略', duration: '30min', isCompleted: false },
      { id: '6', title: '营销漏斗与转化隧道', duration: '50min', isCompleted: false },
      { id: '7', title: '全球支付与安全合规', duration: '35min', isCompleted: false },
      { id: '8', title: '跨境物流与供应链管理', duration: '40min', isCompleted: false },
      { id: '9', title: '电商数字营销实战', duration: '55min', isCompleted: false },
      { id: '10', title: '存量用户运营与留存', duration: '45min', isCompleted: false },
      { id: '11', title: '核心数据指标 (KPI) 分析', duration: '40min', isCompleted: false },
      { id: '12', title: '高级自动化运营', duration: '50min', isCompleted: false },
      { id: '13', title: '国际化规模扩张 (Scaling)', duration: '45min', isCompleted: false },
      { id: '14', title: '多渠道与分销模式', duration: '40min', isCompleted: false },
      { id: '15', title: '结业项目与官方认证', duration: '60min', isCompleted: false }
    ],
    instructor: {
      name: 'Marie Dubois',
      title: '电子商务战略专家',
      avatar: defaultAvatarAsset,
      experience: '8 年跨境电商实战经验'
    }
  },
  {
    id: 'ads',
    title: '高级数字广告投放',
    subtitle: 'Facebook, Google & TikTok 广告大师课',
    category: 'ads',
    level: '专家' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 12,
    duration: '7h 15min',
    thumbnail: adsImage,
    description: '掌握所有主流平台的广告投放。学习如何创建产生卓越 ROI 的高性能营销活动。',
    keyPoints: [
      'Facebook & Instagram 高级投放',
      'Google 搜索与展示营销',
      'TikTok 广告趋势与实操',
      '全链路转化优化',
      '归因模型与数据追踪'
    ],
    lessons: [
      { id: '1', title: '数字广告生态系统解析', duration: '35min', isCompleted: false },
      { id: '2', title: 'Facebook Ads：高级设置', duration: '45min', isCompleted: false },
      { id: '3', title: '受众定向与精细化运营', duration: '50min', isCompleted: false },
      { id: '4', title: '高转化创意素材制作', duration: '40min', isCompleted: false },
      { id: '5', title: 'Google Ads：搜索与展示', duration: '55min', isCompleted: false },
      { id: '6', title: '购物广告与 PMax 表现', duration: '45min', isCompleted: false },
      { id: '7', title: 'TikTok Ads 与社交电商', duration: '40min', isCompleted: false },
      { id: '8', title: '全归因与像素追踪技术', duration: '35min', isCompleted: false },
      { id: '9', title: '广告活动实时优化技巧', duration: '45min', isCompleted: false },
      { id: '10', title: '扩缩容与预算管理', duration: '40min', isCompleted: false },
      { id: '11', title: '数据分析与专业报表', duration: '35min', isCompleted: false },
      { id: '12', title: '官方认证与实战考核', duration: '50min', isCompleted: false }
    ],
    instructor: {
      name: 'Thomas Bernard',
      title: '效果营销专家',
      avatar: defaultAvatarAsset,
      experience: '10 年数字营销经验'
    }
  },
  {
    id: 'seo',
    title: '2026 技术性 SEO',
    subtitle: '利用最新技术统治 Google 排名',
    category: 'seo',
    level: '专家' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 14,
    duration: '9h 45min',
    thumbnail: seoImage,
    description: '全面的技术性 SEO 培训，旨在统治搜索结果。涵盖高级白帽技术和内容策略。',
    keyPoints: [
      '技术性 SEO 与核心 Web 指标',
      '高级关键词挖掘与分析',
      '战略性外链建设',
      '本地化与国际化 SEO',
      'AI 与 SEO 的未来趋势'
    ],
    lessons: [
      { id: '1', title: '2026 SEO 基础演进', duration: '40min', isCompleted: false },
      { id: '2', title: '深层关键词研究与聚类', duration: '50min', isCompleted: false },
      { id: '3', title: '技术性 SEO 与抓取优化', duration: '55min', isCompleted: false },
      { id: '4', title: '核心 Web 指标与 UX 交互', duration: '45min', isCompleted: false },
      { id: '5', title: '网站架构与信息语义化', duration: '40min', isCompleted: false },
      { id: '6', title: '内容策略与语义搜索', duration: '50min', isCompleted: false },
      { id: '7', title: '白帽外链建设实战', duration: '55min', isCompleted: false },
      { id: '8', title: '本地 SEO 与 Google 商家优化', duration: '40min', isCompleted: false },
      { id: '9', title: '国际化 SEO 与多语种布局', duration: '45min', isCompleted: false },
      { id: '10', title: '电商专项 SEO 优化', duration: '50min', isCompleted: false },
      { id: '11', title: '流量监控与异常诊断', duration: '40min', isCompleted: false },
      { id: '12', title: 'AI 驱动的 SEO 新范式', duration: '45min', isCompleted: false },
      { id: '13', title: '全站 SEO 审计实操', duration: '50min', isCompleted: false },
      { id: '14', title: '专家认证与项目答辩', duration: '60min', isCompleted: false }
    ],
    instructor: {
      name: 'Sophie Laurent',
      title: '技术性 SEO 专家',
      avatar: defaultAvatarAsset,
      experience: '12 年搜索优化经验'
    }
  },
  {
    id: 'ia',
    title: '高级 AI 营销实战',
    subtitle: '掌握人工智能驱动的营销革命',
    category: 'ia',
    level: '高级' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 16,
    duration: '10h 20min',
    thumbnail: iaImage,
    description: '探索如何利用 AI 彻底改变您的营销。从 ChatGPT 到图像生成工具，掌握正在改变数字营销的所有技术。',
    keyPoints: [
      '基于 AI 的营销自动化',
      'ChatGPT 与高级提示词工程',
      '自动化内容生成流',
      '预测性分析与大规模个性化',
      '视觉与视频 AI 生产力工具'
    ],
    lessons: [
      { id: '1', title: 'AI 营销导论', duration: '30min', isCompleted: false },
      { id: '2', title: 'ChatGPT 在营销中的应用', duration: '45min', isCompleted: false },
      { id: '3', title: '提示词工程与指令集设计', duration: '50min', isCompleted: false },
      { id: '4', title: '工业级自动化内容产出', duration: '40min', isCompleted: false },
      { id: '5', title: 'AI 赋能的高转化文案', duration: '45min', isCompleted: false },
      { id: '6', title: 'MidJourney 视觉图像生成', duration: '55min', isCompleted: false },
      { id: '7', title: 'AI 视频创作与剪辑', duration: '50min', isCompleted: false },
      { id: '8', title: '社交媒体自动化运营', duration: '40min', isCompleted: false },
      { id: '9', title: '自动化邮件营销 (EDM)', duration: '45min', isCompleted: false },
      { id: '10', title: 'AI 客服与智能聊天机器人', duration: '40min', isCompleted: false },
      { id: '11', title: '预测性数据建模分析', duration: '50min', isCompleted: false },
      { id: '12', title: '千人千面的个性化推荐', duration: '45min', isCompleted: false },
      { id: '13', title: 'SEO 与 AI 的未来融合', duration: '40min', isCompleted: false },
      { id: '14', title: 'AI 伦理、合规与边界', duration: '35min', isCompleted: false },
      { id: '15', title: '主流 AI 营销工具全解析', duration: '50min', isCompleted: false },
      { id: '16', title: '结业项目：完整 AI 营销方案', duration: '60min', isCompleted: false }
    ],
    instructor: {
      name: 'Alexandre Martin',
      title: 'AI 营销战略专家',
      avatar: defaultAvatarAsset,
      experience: '6 年 AI 营销实战经验'
    }
  }
];

export const updatedMockModules = [
  {
    id: '1',
    title: '高级 AI 营销实操',
    subtitle: '第一步 – 社交媒体爆款机器',
    category: 'ia',
    level: '高级' as const,
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
    title: '2026 技术性 SEO',
    subtitle: '30 天内统治 Google 排名',
    category: 'seo',
    level: '专家' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 12,
    duration: '6h 15min',
    thumbnail: seoImage
  },
  {
    id: '3',
    title: '跨境电商自动化',
    subtitle: 'Shopify & 顶级运营实战',
    category: 'ecom',
    level: '初级' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 10,
    duration: '5h 45min',
    thumbnail: ecommerceImage
  },
  {
    id: '4',
    title: '情感化文案策划',
    subtitle: '用触达心灵的文字进行销售',
    category: 'copywriting',
    level: '高级' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 7,
    duration: '3h 20min',
    thumbnail: brandingImage
  },
  {
    id: '5',
    title: '品牌战略建设',
    subtitle: '创建您独特的品牌价值体系',
    category: 'branding',
    level: '初级' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 6,
    duration: '4h 10min',
    thumbnail: brandingImage
  },
  {
    id: '6',
    title: '全链路数据分析',
    subtitle: 'Google Analytics 4 深度精通',
    category: 'analytics',
    level: '专家' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 9,
    duration: '5h 30min',
    thumbnail: seoImage
  },
  {
    id: '7',
    title: '高级数字广告投放',
    subtitle: 'Facebook, Google & TikTok 全攻略',
    category: 'ads',
    level: '专家' as const,
    status: 'unlocked' as const,
    price: 250,
    lessonsCount: 12,
    duration: '7h 15min',
    thumbnail: adsImage
  }
];