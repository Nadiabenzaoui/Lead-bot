import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [totalLeads, totalMessages, byCategorie, byCanal, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.message.count(),
      prisma.lead.groupBy({ by: ['categorie'], _count: true }),
      prisma.message.groupBy({ by: ['canal'], _count: true }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { nom: true, score: true, categorie: true, createdAt: true },
      }),
    ]);

    const opened = await prisma.message.count({ where: { opened: true } });
    const clicked = await prisma.message.count({ where: { clicked: true } });
    const replied = await prisma.message.count({ where: { replied: true } });

    res.json({
      totalLeads,
      totalMessages,
      openRate: totalMessages > 0 ? Math.round((opened / totalMessages) * 100) : 0,
      clickRate: totalMessages > 0 ? Math.round((clicked / totalMessages) * 100) : 0,
      replyRate: totalMessages > 0 ? Math.round((replied / totalMessages) * 100) : 0,
      byCategorie,
      byCanal,
      recentLeads,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
