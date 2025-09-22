import axios from 'axios'

export interface PhoneEnrichmentInput {
  leadId: number
  fullName: string
  email: string
  companyWebsite?: string
  jobTitle?: string
}

export interface PhoneEnrichmentResult {
  phone: string | null
  provider: string
  success: boolean
  error?: string
}

/**
 * Orion Connect Provider Activity
 * Provider with the best data in the market, but slow and fails sometimes
 */
export async function orionConnectActivity(input: PhoneEnrichmentInput): Promise<PhoneEnrichmentResult> {
  const { fullName, companyWebsite } = input
  
  if (!companyWebsite) {
    return {
      phone: null,
      provider: 'OrionConnect',
      success: false,
      error: 'Company website is required for Orion Connect'
    }
  }

  try {
    console.log(`[OrionConnect] Querying phone for: ${fullName} at ${companyWebsite}`)
    
    const response = await axios.post(
      'https://api.genesy.ai/api/tmp/orionConnect',
      {
        fullName,
        companyWebsite
      },
      {
        headers: {
          'x-auth-me': 'mySecretKey123',
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
