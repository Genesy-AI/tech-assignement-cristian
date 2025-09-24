import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { Lead } from '../../../domain/Lead'

const leadRepo = new LeadPrismaRepository()

export const createLead = async (req: Request, res: Response) => {
  const { name, lastName, email, phone, countryCode, jobTitle, companyName, companyWebsite } = req.body
  
  try {
    const lead = Lead.create({
      firstName: String(name),
      lastName: String(lastName),
      email: String(email),
      phone: phone ? String(phone) : null,
      countryCode: countryCode ? String(countryCode) : null,
      jobTitle: jobTitle ? String(jobTitle) : null,
      companyName: companyName ? String(companyName) : null,
      companyWebsite: companyWebsite ? String(companyWebsite) : null,
    })
    
    const createdLead = await leadRepo.create(lead)
    res.json(createdLead.toPersistence())
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Invalid lead data' 
    })
  }
}
