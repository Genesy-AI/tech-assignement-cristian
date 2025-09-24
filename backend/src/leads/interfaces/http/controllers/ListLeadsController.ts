import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const listLeads = async (_req: Request, res: Response) => {
  const leads = await leadRepo.findAll()
  res.json(leads.map(lead => lead.toPersistence()))
}
