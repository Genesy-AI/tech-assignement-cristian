import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params
  await leadRepo.delete(Number(id))
  res.json()
}
