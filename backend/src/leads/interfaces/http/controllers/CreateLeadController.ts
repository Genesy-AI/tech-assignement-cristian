import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'

const leadRepo = new LeadPrismaRepository()

export const createLead = async (req: Request, res: Response) => {
  const { name, lastName, email, phone } = req.body
  if (!name || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, and email are required' })
  }
  const lead = await leadRepo.create({ 
    firstName: String(name), 
    lastName: String(lastName), 
    email: String(email),
    phone: phone ? String(phone) : null
  })
  res.json(lead)
}
