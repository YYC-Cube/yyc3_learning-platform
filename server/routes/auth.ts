import { Router, Request, Response } from 'express';

export const authRouter = Router();

authRouter.post('/signup', (req: Request, res: Response) => {
  res.json({ success: true, data: { user: { id: 'local-001', email: req.body.email } } });
});

authRouter.post('/signin', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: { id: 'local-001', email: req.body.email },
      accessToken: 'local-dev-token',
      refreshToken: 'local-refresh-token',
    },
  });
});

authRouter.get('/me', (_req: Request, res: Response) => {
  res.json({ success: true, data: { authUser: { id: 'local-001', email: 'dev@yyc3.com' } } });
});

authRouter.post('/refresh', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { accessToken: 'local-dev-token', refreshToken: 'local-refresh-token', expiresAt: Date.now() + 3600000 },
  });
});

authRouter.post('/reset-password', (_req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Password reset successful' } });
});
