import type { PhoneEnrichmentInput, PhoneEnrichmentResult } from './types'

/**
 * Astra Dialer Provider Activity
 * Fastest provider but with worst data quality
 */
export async function astraDialerActivity(input: PhoneEnrichmentInput): Promise<PhoneEnrichmentResult> {
  const { lead } = input
  const fullName = `${lead.firstName} ${lead.lastName}`
  
  console.log(`[AstraDialer] Activity called for: ${fullName}`)
  

  return {
    phone: null,
    provider: 'AstraDialer',
    success: false,
    error: 'Astra Dialer not yet implemented'
  }
}
