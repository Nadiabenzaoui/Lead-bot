import { Canal, StatutMessage } from '@prisma/client';
import { prisma } from './prisma';

export async function logMessage(params: {
  leadId: string;
  canal: Canal;
  statut: StatutMessage;
  content: string;
}): Promise<void> {
  await prisma.message.create({
    data: {
      leadId: params.leadId,
      canal: params.canal,
      statut: params.statut,
      content: params.content.slice(0, 200),
    },
  });
}
