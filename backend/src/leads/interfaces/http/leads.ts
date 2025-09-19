import { Router } from 'express'
import { LeadPrismaRepository } from '../../infrastructure/prisma/LeadPrismaRepository'
import { BulkImportLeadsUseCase } from '../../application/usecases/BulkImportLeads'
import { GenerateMessagesUseCase } from '../../application/usecases/GenerateMessages'
import { VerifyEmailsUseCase } from '../../application/usecases/VerifyEmails'
import { TemporalEmailVerificationService } from '../../infrastructure/temporal/TemporalEmailVerificationService'

const router = Router()
const leadRepo = new LeadPrismaRepository()

router.post('/leads', async (req, res) => {
  const { name, lastName, email } = req.body
  if (!name || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, and email are required' })
  }
  const lead = await leadRepo.create({ firstName: String(name), lastName: String(lastName), email: String(email) })
  res.json(lead)
})

router.get('/leads/:id', async (req, res) => {
  const { id } = req.params
  const lead = await leadRepo.findById(Number(id))
  res.json(lead)
})

router.get('/leads', async (_req, res) => {
  const leads = await leadRepo.findAll()
  res.json(leads)
})

router.patch('/leads/:id', async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body
  const lead = await leadRepo.update(Number(id), {
    firstName: String(name),
    email: String(email),
  })
  res.json(lead)
})

router.delete('/leads/:id', async (req, res) => {
  const { id } = req.params
  await leadRepo.delete(Number(id))
  res.json()
})

router.delete('/leads', async (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids must be a non-empty array' })
  }
  try {
    const deletedCount = await leadRepo.deleteMany(ids.map((n: number) => Number(n)))
    res.json({ deletedCount })
  } catch (error) {
    console.error('Error deleting leads:', error)
    res.status(500).json({ error: 'Failed to delete leads' })
  }
})

router.post('/leads/generate-messages', async (req, res) => {
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
})

router.post('/leads/bulk', async (req, res) => {
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
})

router.post('/leads/verify-emails', async (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required and must be valid JSON' })
  }
  const { leadIds } = req.body as { leadIds?: number[] }
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return res.status(400).json({ error: 'leadIds must be a non-empty array' })
  }
  try {
    const verifier = new TemporalEmailVerificationService()
    const uc = new VerifyEmailsUseCase(leadRepo, verifier)
    const result = await uc.execute(leadIds.map((n: number) => Number(n)))
    if ('error' in result) return res.status(404).json(result)
    res.json(result)
  } catch (error) {
    console.error('Error verifying emails:', error)
    res.status(500).json({ error: 'Failed to verify emails' })
  }
})

export default router
