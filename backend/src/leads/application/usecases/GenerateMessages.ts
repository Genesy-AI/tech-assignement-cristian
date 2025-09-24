import { LeadRepository } from '../../domain/LeadRepository'
import { generateMessageFromTemplate } from '../../domain/services/MessageTemplateService'

export class GenerateMessagesUseCase {
  constructor(private readonly leadRepo: LeadRepository) {}

  async execute(leadIds: number[], template: string) {
    const leads = await this.leadRepo.findManyByIds(leadIds)
    if (leads.length === 0) {
      return { error: 'No leads found with the provided IDs' }
    }

    let generatedCount = 0
    const errors: Array<{ leadId: number; leadName: string; error: string }> = []

    for (const lead of leads) {
      try {
        const message = generateMessageFromTemplate(template, lead)
        const updatedLead = lead.updateMessage(message)
        await this.leadRepo.update(lead.id!, updatedLead)
        generatedCount++
      } catch (error) {
        errors.push({
          leadId: lead.id!,
          leadName: `${lead.firstName.getValue()} ${lead.lastName.getValue()}`.trim(),
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { success: true, generatedCount, errors }
  }
}
