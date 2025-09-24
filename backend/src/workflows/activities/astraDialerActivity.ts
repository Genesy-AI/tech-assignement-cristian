import axios from 'axios'
import { getProviderConfig } from '../../config/env'
import type { PhoneEnrichmentInput, PhoneEnrichmentResult } from './types'

/**
 * Astra Dialer Provider Activity
 * Fastest provider but with worst data quality
 */
export async function astraDialerActivity(input: PhoneEnrichmentInput): Promise<PhoneEnrichmentResult> {
  const { lead } = input
  const email = lead.email
  
  if (!email) {
    return {
      phone: null,
      provider: 'AstraDialer',
      success: false,
      error: 'Email is required for Astra Dialer'
    }
  }

  try {
    const config = getProviderConfig()
    console.log(`[AstraDialer] Querying phone for: ${email}`)
    
    const response = await axios.post(
      config.astraDialer.baseUrl,
      {
        email
      },
      {
        headers: {
          'apiKey': config.astraDialer.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 3000
      }
    )

    const { phoneNmbr } = response.data || {}
    const phone = phoneNmbr || null
    
    console.log(`[AstraDialer] Result for ${email}: ${phone ? 'Phone found' : 'No phone found'}`)
    
    return {
      phone,
      provider: 'AstraDialer',
      success: !!phone
    }
  } catch (error) {
    console.error(`[AstraDialer] Error for ${email}:`, error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      phone: null,
      provider: 'AstraDialer',
      success: false,
      error: errorMessage
    }
  }
}
