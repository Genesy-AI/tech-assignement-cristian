import type { Lead } from '../../leads'

export interface PhoneEnrichmentInput {
  lead: Lead
}

export interface PhoneEnrichmentResult {
  phone: string | null
  provider: string
  success: boolean
  error?: string
}
