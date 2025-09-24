import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { VerifyEmailsUseCase } from '../../../application/usecases/VerifyEmails'
import { EmailVerificationService } from '../../../domain/services/EmailVerificationService'

const leadRepo = new LeadPrismaRepository()

export const verifyEmails = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { leadIds } = req.body as { leadIds?: number[] }
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return res.status(400).json({ error: 'leadIds must be a non-empty array' })
  }
  try {
    const verifier = new EmailVerificationService()
    const uc = new VerifyEmailsUseCase(leadRepo, verifier)
    const result = await uc.execute(leadIds.map((n: number) => Number(n)))
    if ('error' in result) return res.status(404).json(result)
    res.json(result)
  } catch (error) {
    console.error('Error verifying emails:', error)
    res.status(500).json({ error: 'Failed to verify emails' })
  }
}
