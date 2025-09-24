import { describe, it, expect, vi } from 'vitest'
import { MockActivityEnvironment } from '@temporalio/testing'
import { savePhoneActivity, SavePhoneInput } from '../../../src/workflows/activities/savePhoneActivity'
import { LeadPrismaRepository } from '../../../src/leads/infrastructure/prisma/LeadPrismaRepository'
import { Lead } from '../../../src/leads/domain/Lead'

// Mock the LeadPrismaRepository
vi.mock('../../../src/leads/infrastructure/prisma/LeadPrismaRepository')

describe('savePhoneActivity', () => {
  const mockInput: SavePhoneInput = {
    leadId: 1,
    phone: '+1234567890'
  }

  const mockLead = Lead.fromPersistenceLenient({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: null,
    jobTitle: null,
    countryCode: null,
    companyName: null,
    companyWebsite: null,
    message: null,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  it('should save phone when lead exists', async () => {
    const env = new MockActivityEnvironment()
    
    const mockRepo = {
      findById: vi.fn().mockResolvedValue(mockLead),
      updatePhone: vi.fn().mockResolvedValue(undefined)
    }

    vi.mocked(LeadPrismaRepository).mockImplementation(() => mockRepo as any)

    const result = await env.run(savePhoneActivity, mockInput)

    expect(result).toEqual({
      success: true
    })
    expect(mockRepo.findById).toHaveBeenCalledWith(1)
    expect(mockRepo.updatePhone).toHaveBeenCalledWith(1, '+1234567890')
  })
})