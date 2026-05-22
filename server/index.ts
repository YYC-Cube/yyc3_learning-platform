import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { healthRouter } from './routes/health';
import { authMiddleware } from './middleware/auth';

function createCrudRouter(): Router {
  const router = Router();
  router.get('/', (_req: Request, res: Response) => res.json({ success: true, data: [] }));
  router.post('/', (req: Request, res: Response) => res.json({ success: true, data: req.body }));
  router.put('/', (req: Request, res: Response) => res.json({ success: true, data: req.body }));
  router.delete('/', (_req: Request, res: Response) => res.json({ success: true, data: { message: 'Deleted' } }));
  router.get('/:id', (_req: Request, res: Response) => res.json({ success: true, data: null }));
  router.put('/:id', (req: Request, res: Response) => res.json({ success: true, data: req.body }));
  router.post('/:id', (req: Request, res: Response) => res.json({ success: true, data: req.body }));
  return router;
}

const courseRouter = createCrudRouter();
const taskRouter = createCrudRouter();
const postRouter = createCrudRouter();
const statsRouter = createCrudRouter();
const adminRouter = createCrudRouter();
const aiRouter = createCrudRouter();
const activityRouter = createCrudRouter();
const feedbackRouter = createCrudRouter();
const salesRouter = createCrudRouter();
const roadmapRouter = createCrudRouter();
const certificateRouter = createCrudRouter();
const videoRouter = createCrudRouter();
const commentRouter = createCrudRouter();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/health', healthRouter);
app.use('/api/signup', authRouter);
app.use('/api/signin', authRouter);
app.use('/api/auth', authRouter);

app.use('/api', authMiddleware);

app.use('/api/user', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/posts', postRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/activity', activityRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/sales', salesRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/video-progress', videoRouter);
app.use('/api/posts/:postId/comments', commentRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`[YYC³ API Server] Running on http://localhost:${PORT}`);
  console.log(`[YYC³ API Server] Health: http://localhost:${PORT}/api/health`);
});

export default app;
