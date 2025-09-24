import axios from 'axios'
import { getProviderConfig } from '../../config/env'
import type { PhoneEnrichmentInput, PhoneEnrichmentResult } from './types'

/**
 * Nimbus Lookup Provider Activity
 * New provider in the market
 */
export async function nimbusLookupActivity(input: PhoneEnrichmentInput): Promise<PhoneEnrichmentResult> {
  const { lead } = input
  const email = lead.email
  const jobTitle = lead.jobTitle
  
  if (!email || !jobTitle) {
    return {
      phone: null,
      provider: 'NimbusLookup',
      success: false,
      error: 'Email and job title are required for Nimbus Lookup'
    }
  }

  try {
    const config = getProviderConfig()
    
    const response = await axios.post(
      config.nimbusLookup.baseUrl,
      {
        email,
        jobTitle
      },
      {
        params: {
          api: config.nimbusLookup.apiKey
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 3000 // 8 second timeout
      }
    )

    const { phoneNmbr } = response.data || {}

    let phone: string | null = phoneNmbr ? phoneNmbr.toString() : null
    
    return {
      phone,
      provider: 'NimbusLookup',
      success: !!phone
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      phone: null,
      provider: 'NimbusLookup',
      success: false,
      error: errorMessage
    }
  }
}
