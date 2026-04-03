import express, { Request, Response } from 'express';
import { Categorie } from '@prisma/client';
import { prisma } from '../lib/prisma';
import LeadScorer from '../services/LeadScorer';

const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
  try {
    const { leadId, leadData } = req.body;

    let lead = leadData;
    if (leadId && !leadData) {
      lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
    }

    const scored = LeadScorer.score(lead);

    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { score: scored.score, categorie: scored.categorie as Categorie },
      });
    }

    res.json(scored);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
