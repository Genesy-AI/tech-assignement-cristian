import { Request, Response } from 'express'
import { LeadPrismaRepository } from '../../../infrastructure/prisma/LeadPrismaRepository'
import { GenerateMessagesUseCase } from '../../../application/usecases/GenerateMessages'

const leadRepo = new LeadPrismaRepository()

export const generateMessages = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { leadIds, template } = req.body
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return res.status(400).json({ error: 'leadIds must be a non-empty array' })
  }
  if (!template || typeof template !== 'string') {
    return res.status(400).json({ error: 'template must be a non-empty string' })
  }
  try {
    const uc = new GenerateMessagesUseCase(leadRepo)
    const result = await uc.execute(leadIds.map((n: number) => Number(n)), template)
    if ('error' in result) return res.status(404).json(result)
    res.json(result)
  } catch (error) {
    console.error('Error generating messages:', error)
    res.status(500).json({ error: 'Failed to generate messages' })
  }
}
