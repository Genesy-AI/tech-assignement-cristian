import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { BulkImportLeadsUseCase } from '../../../application/usecases/BulkImportLeads'

const leadRepo = new LeadPrismaRepository()

export const bulkImportLeads = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { leads } = req.body
  if (!Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ error: 'leads must be a non-empty array' })
  }
  try {
    const uc = new BulkImportLeadsUseCase(leadRepo)
    const result = await uc.execute(leads)
    res.json(result)
  } catch (error) {
    console.error('Error importing leads:', error)
    res.status(500).json({ error: 'Failed to import leads' })
  }
}
