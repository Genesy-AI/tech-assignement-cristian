import axios from 'axios'
import { getProviderConfig } from '../../config/env'
import type { PhoneEnrichmentInput, PhoneEnrichmentResult } from './types'

/**
 * Orion Connect Provider Activity
 * Provider with the best data in the market, but slow and fails sometimes
 * Requires: firstName, lastName and companyWebsite
 */
export async function orionConnectActivity(input: PhoneEnrichmentInput): Promise<PhoneEnrichmentResult> {
  const { lead } = input
  const fullName = `${lead.firstName} ${lead.lastName}`
  const companyWebsite = lead.companyWebsite
  
  if (!lead.firstName || !lead.lastName || !companyWebsite) {
    return {
      phone: null,
      provider: 'OrionConnect',
      success: false,
      error: 'First name, last name and company website are required for Orion Connect'
    }
  }

  try {
    const config = getProviderConfig()
    console.log(`[OrionConnect] Querying phone for: ${fullName} at ${companyWebsite}`)
    
    const response = await axios.post(
      config.orionConnect.baseUrl,
      {
        fullName,
        companyWebsite
      },
      {
        headers: {
          'x-auth-me': config.orionConnect.authKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    )

    const phone = response.data?.phone || null
    
    console.log(`[OrionConnect] Result for ${fullName}: ${phone ? 'Phone found' : 'No phone found'}`)
    
    return {
      phone,
      provider: 'OrionConnect',
      success: true
    }
  } catch (error) {
    console.error(`[OrionConnect] Error for ${fullName}:`, error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      phone: null,
      provider: 'OrionConnect',
      success: false,
      error: errorMessage
    }
  }
}
