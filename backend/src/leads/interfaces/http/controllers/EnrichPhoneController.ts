import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { EnrichPhoneNumbersUseCase } from '../../../application/usecases/EnrichPhoneNumbers'

const leadRepo = new LeadPrismaRepository()

export const enrichPhone = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { leadIds } = req.body
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return res.status(400).json({ error: 'leadIds must be a non-empty array' })
  }
  try {
    const uc = new EnrichPhoneNumbersUseCase(leadRepo)
    const result = await uc.execute({ leadIds: leadIds.map((n: number) => Number(n)) })
    res.json(result)
  } catch (error) {
    console.error('Error enriching phone numbers:', error)
    res.status(500).json({ error: 'Failed to enrich phone numbers' })
  }
}
