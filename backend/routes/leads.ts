import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { botQueue } from '../bot/queue';

const router = express.Router();
const prisma = new PrismaClient();

// GET /leads — list with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categorie, statut, secteur, search, page = '1', limit = '20' } = req.query as Record<string, string>;
    const where: Record<string, any> = {};
    if (categorie) where.categorie = categorie;
    if (statut) where.statut = statut;
    if (secteur) where.secteur = { contains: secteur, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { entreprise: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { messages: { orderBy: { sentAt: 'desc' }, take: 1 } },
        orderBy: { score: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({ leads, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /leads/search — trigger scrape via bot queue
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { keywords, location, limit = 20 } = req.body;
    if (!keywords) return res.status(400).json({ error: 'keywords required' });

    const job = await botQueue.add('scrape-and-send', { keywords, location, limit, autoSend: false });

    res.json({ message: 'Recherche lancée', jobId: job.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /leads/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(lead);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /leads/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
