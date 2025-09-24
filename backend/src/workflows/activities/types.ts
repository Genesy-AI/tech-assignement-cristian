export interface WorkflowLeadData {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  jobTitle?: string | null
  countryCode?: string | null
  companyName?: string | null
  companyWebsite?: string | null
  message?: string | null
  emailVerified?: boolean | null
  createdAt?: Date
  updatedAt?: Date
}

export interface PhoneEnrichmentInput {
  lead: WorkflowLeadData
}

export interface PhoneEnrichmentResult {
  phone: string | null
  provider: string
  success: boolean
  error?: string
}
