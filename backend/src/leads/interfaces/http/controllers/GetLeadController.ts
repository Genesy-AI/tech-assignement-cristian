import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const getLead = async (req: Request, res: Response) => {
  const { id } = req.params
  const lead = await leadRepo.findById(Number(id))
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  res.json(lead.toPersistence())
}
