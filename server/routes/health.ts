import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { status: 'ok', version: '3.0.0', timestamp: new Date().toISOString() },
  });
});
