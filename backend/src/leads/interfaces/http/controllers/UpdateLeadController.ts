import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, phone } = req.body
  const lead = await leadRepo.update(Number(id), {
    firstName: String(name),
    email: String(email),
    phone: phone ? String(phone) : null,
  })
  res.json(lead)
}
