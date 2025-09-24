import { Connection, Client } from '@temporalio/client'
import { LeadRepository } from '../../domain/LeadRepository'
import { phoneEnrichmentWorkflow, PhoneEnrichmentWorkflowResult } from '../../../workflows'

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
    
    const leads = await this.leadRepo.findManyByIds(leadIds)
    const connection = await Connection.connect({ address: 'localhost:7233' })
    const client = new Client({ connection, namespace: 'default' })

    const results: PhoneEnrichmentWorkflowResult[] = []
    const errors: Array<{ leadId: number; leadName: string; error: string }> = []
    let processedCount = 0

    try {
      const enrichmentPromises = leads.map(async (lead) => {
        const leadName = `${lead.firstName.getValue()} ${lead.lastName.getValue()}`.trim()
        
        try {
          if (lead.phone) {
            return {
              leadId: lead.id!,
              phone: lead.phone.getValue(),
              provider: 'existing',
              success: true,
              attempts: []
            } as PhoneEnrichmentWorkflowResult
          }

          // Create idempotent workflow ID to prevent duplicate runs
          const workflowId = `enrich-phone-${lead.id}`
          // Create compatibility object for workflow
          const leadData = lead.toPersistence()
          const workflowLead = {
            id: leadData.id,
            firstName: leadData.firstName,
            lastName: leadData.lastName,
            email: leadData.email,
            phone: leadData.phone,
            jobTitle: leadData.jobTitle,
            countryCode: leadData.countryCode,
            companyName: leadData.companyName,
            companyWebsite: leadData.companyWebsite,
            message: leadData.message,
            emailVerified: leadData.emailVerified,
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt
          } as any

          const result = await client.workflow.execute(phoneEnrichmentWorkflow, {
            taskQueue: 'myQueue',
            workflowId,
            args: [{
              lead: workflowLead
            }]
          })

          return {
            leadId: lead.id!,
            phone: result.phone,
            provider: result.provider,
            success: !!result.phone,
            attempts: []
          } as PhoneEnrichmentWorkflowResult
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
