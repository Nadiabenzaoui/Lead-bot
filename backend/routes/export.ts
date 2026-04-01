import express, { Request, Response } from 'express';
import ExportService from '../services/ExportService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { format = 'json', categorie, statut } = req.query as Record<string, string>;
    const filters: Record<string, string> = {};
    if (categorie) filters.categorie = categorie;
    if (statut) filters.statut = statut;

    if (format === 'csv') {
      const csv = await ExportService.toCSV(filters);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
      return res.send(csv);
    }

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="leads.pdf"');
      return ExportService.toPDF(filters, res);
    }

    const json = await ExportService.toJSON(filters);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.json"');
    res.send(json);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
