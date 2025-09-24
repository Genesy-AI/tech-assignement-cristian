import { describe, it, expect, vi } from 'vitest'
import { MockActivityEnvironment } from '@temporalio/testing'
import { orionConnectActivity } from '../../../src/workflows/activities/orionConnectActivity'
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
    orionConnect: {
      baseUrl: 'https://api.orionconnect.com/phone',
      authKey: 'test-auth-key'
    }
  }))
}))

describe('orionConnectActivity', () => {
  const mockInput: PhoneEnrichmentInput = {
    lead: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      companyWebsite: 'https://example.com'
    }
  }

  it('should return phone when API call succeeds', async () => {
    const env = new MockActivityEnvironment()
    
    // Mock axios response
    const axios = await import('axios')
    vi.mocked(axios.default.post).mockResolvedValue({
      data: {
        phone: '+1234567890'
      }
    })

    const result = await env.run(orionConnectActivity, mockInput)

    expect(result).toEqual({
      phone: '+1234567890',
      provider: 'OrionConnect',
      success: true
    })
  })
})