export type LeadsEnrichPhoneInput = {
  leadIds: number[]
}

export interface PhoneEnrichmentAttempt {
  provider: string
  success: boolean
  phone: string | null
  error?: string
}

export interface PhoneEnrichmentResult {
  leadId: number
  phone: string | null
  provider: string | null
  success: boolean
  attempts: PhoneEnrichmentAttempt[]
}

export type LeadsEnrichPhoneOutput = {
  success: boolean
  processedCount: number
  results: PhoneEnrichmentResult[]
  errors: Array<{
    leadId: number
    leadName: string
    error: string
  }>
}
