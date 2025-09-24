import { describe, it, expect, vi } from 'vitest'
import { MockActivityEnvironment } from '@temporalio/testing'
import { orionConnectActivity } from '../../src/workflows/activities/orionConnectActivity'
import type { WorkflowLeadData } from '../../src/workflows/activities/types'

describe('Phone Enrichment Activities', () => {
  const mockLead: WorkflowLeadData = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    companyWebsite: 'https://example.com'
  }

  it('should test orionConnectActivity with MockActivityEnvironment', async () => {
    const env = new MockActivityEnvironment()
    
    // Mock axios for the activity
    vi.mock('axios', () => ({
      default: {
        post: vi.fn().mockResolvedValue({
          data: {
            phone: '+1234567890'
          }
        })
      }
    }))

    const result = await env.run(orionConnectActivity, { lead: mockLead })

    expect(result).toEqual({
      phone: '+1234567890',
      provider: 'OrionConnect',
      success: true
    })
  })
})