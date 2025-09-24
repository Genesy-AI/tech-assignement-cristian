import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { Lead } from '../../../domain/Lead'

const leadRepo = new LeadPrismaRepository()

export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, lastName, email, phone, countryCode, jobTitle, companyName, companyWebsite } = req.body
  
  try {
    const existingLead = await leadRepo.findById(Number(id))
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    const updatedLead = Lead.create({
      firstName: String(name),
      lastName: lastName ? String(lastName) : existingLead.lastName.getValue()!,
      email: String(email),
      phone: phone ? String(phone) : null,
      countryCode: countryCode ? String(countryCode) : null,
      jobTitle: jobTitle ? String(jobTitle) : null,
      companyName: companyName ? String(companyName) : null,
      companyWebsite: companyWebsite ? String(companyWebsite) : null,
    })

    const result = await leadRepo.update(Number(id), updatedLead)
    res.json(result.toPersistence())
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Invalid lead data' 
    })
  }
}
