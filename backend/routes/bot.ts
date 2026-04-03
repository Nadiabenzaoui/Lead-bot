import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { botQueue } from '../bot/queue';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import Bull from 'bull';

const router = express.Router();

const botLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const startSchema = z.object({
  keywords: z.string().min(1, 'keywords required'),
  location: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  autoSend: z.boolean().default(false),
});

let currentJob: Bull.Job | null = null;

router.post('/start', botLimiter, async (req: Request, res: Response) => {
  const result = startSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  const { keywords, location, limit, autoSend } = result.data;

  try {
    currentJob = await botQueue.add('scrape-and-send', { keywords, location, limit, autoSend });
    await prisma.botJob.create({
      data: { status: 'running', startedAt: new Date(), config: req.body },
    });
    res.json({ message: 'Bot démarré', jobId: currentJob.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/stop', async (req: Request, res: Response) => {
  try {
    if (currentJob) {
      await currentJob.discard();
      currentJob = null;
    }
    await prisma.botJob.updateMany({
      where: { status: 'running' },
      data: { status: 'stopped', stoppedAt: new Date() },
    });
    res.json({ message: 'Bot arrêté' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status', async (req: Request, res: Response) => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      botQueue.getWaitingCount(),
      botQueue.getActiveCount(),
      botQueue.getCompletedCount(),
      botQueue.getFailedCount(),
    ]);
    const lastJob = await prisma.botJob.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json({ waiting, active, completed, failed, lastJob });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
