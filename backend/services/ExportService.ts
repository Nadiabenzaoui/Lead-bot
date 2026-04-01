import { PrismaClient, Prisma } from '@prisma/client';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

const prisma = new PrismaClient();

class ExportService {
  async getLeads(filters: Prisma.LeadWhereInput = {}) {
    return prisma.lead.findMany({
      where: filters,
      include: { messages: true },
      orderBy: { score: 'desc' },
    });
  }

  async toCSV(filters: Prisma.LeadWhereInput): Promise<string> {
    const leads = await this.getLeads(filters);
    const fields = [
      'id',
      'nom',
      'email',
      'entreprise',
      'secteur',
      'score',
      'categorie',
      'statut',
      'source',
      'titre',
      'taille',
      'createdAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(leads);
  }

  async toJSON(filters: Prisma.LeadWhereInput): Promise<string> {
    const leads = await this.getLeads(filters);
    return JSON.stringify(leads, null, 2);
  }

  async toPDF(filters: Prisma.LeadWhereInput, res: Response): Promise<void> {
    const leads = await this.getLeads(filters);
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(res);
    doc.fontSize(18).text('Export Leads — Lead Bot', { align: 'center' });
    doc.moveDown();

    for (const lead of leads) {
      doc
        .fontSize(11)
        .text(`${lead.nom} — ${lead.email || 'N/A'} — Score: ${lead.score}/10 (${lead.categorie})`);
      doc
        .fontSize(9)
        .fillColor('gray')
        .text(`${lead.entreprise || ''} | ${lead.secteur || ''} | ${lead.statut}`);
      doc.fillColor('black').moveDown(0.5);
    }

    doc.end();
  }
}

export default new ExportService();
