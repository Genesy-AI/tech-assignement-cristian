import { describe, it, expect, vi } from 'vitest'
import { MockActivityEnvironment } from '@temporalio/testing'
import { astraDialerActivity } from '../../../src/workflows/activities/astraDialerActivity'
import type { PhoneEnrichmentInput } from '../../../src/workflows/activities/types'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}))

// Mock the config
vi.mock('../../../src/config/env', () => ({
  getProviderConfig: vi.fn(() => ({
    astraDialer: {
      baseUrl: 'https://api.astradialer.com/phone',
      apiKey: 'test-api-key'
    }
  }))
}))

describe('astraDialerActivity', () => {
  const mockInput: PhoneEnrichmentInput = {
    lead: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }
  }

  it('should return phone when API call succeeds', async () => {
    const env = new MockActivityEnvironment()
    
    // Mock axios response
    const axios = await import('axios')
    vi.mocked(axios.default.post).mockResolvedValue({
      data: {
        phoneNmbr: '+1234567890'
      }
    })

    const result = await env.run(astraDialerActivity, mockInput)

    expect(result).toEqual({
      phone: '+1234567890',
      provider: 'AstraDialer',
      success: true
    })
  })
})