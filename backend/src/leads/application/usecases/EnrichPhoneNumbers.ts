import { Connection, Client } from '@temporalio/client'
import { LeadRepository } from '../../domain/LeadRepository'
import { phoneEnrichmentWorkflow, PhoneEnrichmentWorkflowResult } from '../../../workflows/workflows'

export interface EnrichPhoneNumbersInput {
  leadIds: number[]
}

export interface EnrichPhoneNumbersResult {
  success: boolean
  processedCount: number
  results: PhoneEnrichmentWorkflowResult[]
  errors: Array<{
    leadId: number
    leadName: string
    error: string
  }>
}

export class EnrichPhoneNumbersUseCase {
  constructor(private readonly leadRepo: LeadRepository) {}

  async execute(input: EnrichPhoneNumbersInput): Promise<EnrichPhoneNumbersResult> {
    const { leadIds } = input
    
    if (leadIds.length === 0) {
      return {
        success: false,
        processedCount: 0,
        results: [],
        errors: [{ leadId: 0, leadName: 'N/A', error: 'No lead IDs provided' }]
      }
    }

    const leads = await this.leadRepo.findManyByIds(leadIds)
    if (leads.length === 0) {
      return {
        success: false,
        processedCount: 0,
        results: [],
        errors: [{ leadId: 0, leadName: 'N/A', error: 'No leads found with provided IDs' }]
      }
    }

    const connection = await Connection.connect({ address: 'localhost:7233' })
    const client = new Client({ connection, namespace: 'default' })

    const results: PhoneEnrichmentWorkflowResult[] = []
    const errors: Array<{ leadId: number; leadName: string; error: string }> = []
    let processedCount = 0

    try {
      // Process leads in parallel (with concurrency limit if needed)
      const enrichmentPromises = leads.map(async (lead) => {
        const leadName = `${lead.firstName} ${lead.lastName}`.trim()
        
        try {
          // Skip if lead already has a phone number
          if (lead.phone) {
            console.log(`[EnrichPhoneNumbers] Lead ${lead.id} already has phone: ${lead.phone}`)
            return {
              leadId: lead.id!,
              phone: lead.phone,
              provider: 'existing',
              success: true,
              attempts: []
            } as PhoneEnrichmentWorkflowResult
          }

          // Create idempotent workflow ID to prevent duplicate runs
          const workflowId = `enrich-phone-${lead.id}`
          
          console.log(`[EnrichPhoneNumbers] Starting workflow for lead ${lead.id}: ${leadName}`)

          const result = await client.workflow.execute(phoneEnrichmentWorkflow, {
            taskQueue: 'myQueue',
            workflowId,
            args: [{
              leadId: lead.id!,
              fullName: leadName,
              email: lead.email,
              companyWebsite: lead.companyName ? `${lead.companyName.toLowerCase().replace(/\s+/g, '')}.com` : undefined,
              jobTitle: lead.jobTitle || undefined
            }]
          })

          // Update lead with phone number if found
          if (result.success && result.phone) {
            await this.leadRepo.update(lead.id!, { phone: result.phone })
            console.log(`[EnrichPhoneNumbers] Updated lead ${lead.id} with phone: ${result.phone}`)
          }

          return result
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[EnrichPhoneNumbers] Error processing lead ${lead.id}:`, errorMessage)
          
          errors.push({
            leadId: lead.id!,
            leadName,
            error: errorMessage
          })
          
          return null
        }
      })

      const enrichmentResults = await Promise.all(enrichmentPromises)
      
      for (const result of enrichmentResults) {
        if (result) {
          results.push(result)
          processedCount++
        }
      }

    } finally {
      await connection.close()
    }

    return {
      success: true,
      processedCount,
      results,
      errors
    }
  }
}
