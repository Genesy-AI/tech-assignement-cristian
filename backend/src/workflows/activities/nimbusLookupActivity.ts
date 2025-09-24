import axios from 'axios'
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
    console.log(`[NimbusLookup] Querying phone for: ${email} (${jobTitle})`)
    
    const response = await axios.post(
      'https://api.genesy.ai/api/tmp/numbusLookup',
      {
        email,
        jobTitle
      },
      {
        params: {
          api: '000099998888'
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 3000 // 8 second timeout
      }
    )

    const { phoneNmbr } = response.data || {}

    let phone: string | null = phoneNmbr.toString()
    
    console.log(`[NimbusLookup] Result for ${email}: ${phone ? 'Phone found' : 'No phone found'}`)
    
    return {
      phone,
      provider: 'NimbusLookup',
      success: !!phone
    }
  } catch (error) {
    console.error(`[NimbusLookup] Error for ${email}:`, error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      phone: null,
      provider: 'NimbusLookup',
      success: false,
      error: errorMessage
    }
  }
}
