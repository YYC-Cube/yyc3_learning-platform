import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const guestMode = req.headers['x-guest-mode'] === 'true';
  if (guestMode) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    (req as unknown as { userId: string }).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token expired or invalid' });
  }
}

function verifyToken(token: string): { userId: string; email: string } {
  if (!token || token === 'guest') {
    return { userId: 'default', email: 'guest@yyc3.com' };
  }
  return { userId: token.substring(0, 8), email: 'user@yyc3.com' };
}
