import { Router, Request, Response } from 'express';

export const userRouter = Router();

userRouter.get('/profile', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: 'default', firstName: '言语', lastName: '', email: 'yanyu@yyc3.com',
      avatar: '', bio: '专注于 SaaS 产品架构与增长策略', location: '中国，上海',
      role: 'user', membershipTier: 'platinum', completionPercentage: 68,
      unlockedModules: 5, totalModules: 12, streakDays: 12,
      certificatesCount: 5, joinedAt: '2025-09-15', lastActiveAt: new Date().toISOString(),
    },
  });
});

userRouter.put('/profile', (req: Request, res: Response) => {
  res.json({ success: true, data: { ...req.body, lastActiveAt: new Date().toISOString() } });
});

userRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({ success: true, data: { theme: 'dark', language: 'zh', notifications: true } });
});

userRouter.put('/settings', (req: Request, res: Response) => {
  res.json({ success: true, data: req.body });
});

userRouter.get('/progress', (_req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

userRouter.get('/progress/:moduleId', (_req: Request, res: Response) => {
  res.json({ success: true, data: null });
});

userRouter.put('/progress/:moduleId', (req: Request, res: Response) => {
  res.json({ success: true, data: req.body });
});

userRouter.get('/achievements', (_req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

userRouter.post('/avatar', (req: Request, res: Response) => {
  res.json({ success: true, data: { avatarUrl: '', profile: req.body } });
});
