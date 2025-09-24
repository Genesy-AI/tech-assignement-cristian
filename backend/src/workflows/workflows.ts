import { proxyActivities } from '@temporalio/workflow'
import type * as activities from './activities'
import type { WorkflowLeadData } from './activities/types'

// Phone enrichment activities with specific retry policies
const { orionConnectActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2.0,
    maximumInterval: '10 seconds',
    maximumAttempts: 3,
  },
})

const { nimbusLookupActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '20 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2.0,
    maximumInterval: '8 seconds',
    maximumAttempts: 3,
  },
})

const { astraDialerActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '15 seconds',
  retry: {
    initialInterval: '500ms',
    backoffCoefficient: 1.5,
    maximumInterval: '5 seconds',
    maximumAttempts: 5,
  },
})

const { savePhoneActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2.0,
    maximumInterval: '5 seconds',
    maximumAttempts: 3,
  },
})

export interface PhoneEnrichmentWorkflowInput {
  lead: WorkflowLeadData
}

export interface PhoneEnrichmentWorkflowResult {
  phone: string | null
  provider: string | null
}

/**
 * Phone Enrichment Orchestrator Workflow
 * Coordinates multiple provider activities in waterfall approach
 */
export async function phoneEnrichmentWorkflow(
  input: PhoneEnrichmentWorkflowInput
): Promise<PhoneEnrichmentWorkflowResult> {
  const { lead } = input

  const providers = [
    { name: 'OrionConnect', activity: orionConnectActivity },
    { name: 'NimbusLookup', activity: nimbusLookupActivity },
    { name: 'AstraDialer', activity: astraDialerActivity }
  ]

  console.log(`[Orchestrator] Starting phone enrichment for lead ${lead.id}: ${lead.firstName} ${lead.lastName}`)

  for (const provider of providers) {
    const result = await provider.activity({ lead })

    if (result.success && result.phone) {
      const saveResult = await savePhoneActivity({
        leadId: lead.id!,
        phone: result.phone
      })

      if (saveResult.success) {
        console.log(`[Orchestrator] Successfully saved phone ${result.phone} for lead ${lead.id} using ${provider.name}`)
        return {
          phone: result.phone,
          provider: provider.name
        }
      } else {
        console.error(`[Orchestrator] Failed to save phone for lead ${lead.id}: ${saveResult.error}`)
      }
    }
  }

  return {
    phone: null,
    provider: null
  }
}
