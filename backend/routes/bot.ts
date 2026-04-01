import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { botQueue } from '../bot/queue';
import Bull from 'bull';

const router = express.Router();
const prisma = new PrismaClient();

let currentJob: Bull.Job | null = null;

router.post('/start', async (req: Request, res: Response) => {
  try {
    const { keywords, location, limit = 20, autoSend = false } = req.body as {
      keywords: string;
      location?: string;
      limit?: number;
      autoSend?: boolean;
    };
    if (!keywords) return res.status(400).json({ error: 'keywords required' });

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
