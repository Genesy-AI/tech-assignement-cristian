import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const getLead = async (req: Request, res: Response) => {
  const { id } = req.params
  const lead = await leadRepo.findById(Number(id))
  res.json(lead)
}
