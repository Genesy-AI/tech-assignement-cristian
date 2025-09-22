import { proxyActivities, sleep } from '@temporalio/workflow'
import type * as activities from './activities'

const { verifyEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 second',
})

// Phone enrichment activities with retry policies and timeouts
const { orionConnectActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2.0,
    maximumInterval: '10 seconds',
    maximumAttempts: 3,
  },
})

export async function verifyEmailWorkflow(email: string): Promise<boolean> {
  return await verifyEmail(email)
}

export interface PhoneEnrichmentWorkflowInput {
  leadId: number
  fullName: string
  email: string
  companyWebsite?: string
  jobTitle?: string
}

export interface PhoneEnrichmentWorkflowResult {
  leadId: number
  phone: string | null
  provider: string | null
  success: boolean
  attempts: Array<{
    provider: string
    success: boolean
    phone: string | null
    error?: string
  }>
}

/**
 * Phone Enrichment Workflow - Waterfall approach
 * Tries providers in sequence until a phone number is found
 */
export async function phoneEnrichmentWorkflow(
  input: PhoneEnrichmentWorkflowInput
): Promise<PhoneEnrichmentWorkflowResult> {
  const { leadId, fullName, email, companyWebsite, jobTitle } = input
  const attempts: PhoneEnrichmentWorkflowResult['attempts'] = []

  console.log(`[Workflow] Starting phone enrichment for lead ${leadId}: ${fullName}`)

  // Provider 1: Orion Connect (requires fullName and companyWebsite)
  if (companyWebsite) {
    console.log(`[Workflow] Trying Orion Connect for lead ${leadId}`)
    
    const orionResult = await orionConnectActivity({
      leadId,
      fullName,
      email,
      companyWebsite,
      jobTitle
    })

    attempts.push({
      provider: 'OrionConnect',
      success: orionResult.success,
      phone: orionResult.phone,
      error: orionResult.error
    })

    if (orionResult.success && orionResult.phone) {
      console.log(`[Workflow] Phone found via Orion Connect for lead ${leadId}`)
      return {
        leadId,
        phone: orionResult.phone,
        provider: 'OrionConnect',
        success: true,
        attempts
      }
    }

    // Small delay between provider attempts
    await sleep('500ms')
  } else {
    console.log(`[Workflow] Skipping Orion Connect for lead ${leadId} - no company website`)
    attempts.push({
      provider: 'OrionConnect',
      success: false,
      phone: null,
      error: 'Company website required'
    })
  }

  // TODO: Add other providers here (Astra Dialer, Nimbus Lookup)

  console.log(`[Workflow] No phone found for lead ${leadId} after trying all providers`)
  
  return {
    leadId,
    phone: null,
    provider: null,
    success: false,
    attempts
  }
}
