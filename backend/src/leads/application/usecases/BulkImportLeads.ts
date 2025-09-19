import { LeadRepository } from '../../domain/LeadRepository'
import { CreateLeadInput } from '../../domain/Lead'

export class BulkImportLeadsUseCase {
  constructor(private readonly leadRepo: LeadRepository) {}

  async execute(leads: Array<CreateLeadInput & { companyName?: string | null }>) {
    const validLeads = leads.filter((lead) => {
      return (
        lead.firstName &&
        lead.lastName &&
        lead.email &&
        typeof lead.firstName === 'string' &&
        lead.firstName.trim() &&
        typeof lead.lastName === 'string' &&
        lead.lastName.trim() &&
        typeof lead.email === 'string' &&
        lead.email.trim()
      )
    })

    if (validLeads.length === 0) {
      return {
        success: false,
        importedCount: 0,
        duplicatesSkipped: 0,
        invalidLeads: leads.length,
        errors: [{ error: 'No valid leads found. firstName, lastName, and email are required.' }],
      }
    }

    const existingLeads = await Promise.all(
      validLeads.map((l) => this.leadRepo.findByFirstAndLast(l.firstName.trim(), l.lastName.trim()))
    )

    const existingSet = new Set(
      existingLeads.flat().map((lead) => `${lead.firstName.toLowerCase()}_${(lead.lastName || '').toLowerCase()}`)
    )

    const uniqueLeads = validLeads.filter((lead) => {
      const key = `${lead.firstName.toLowerCase()}_${lead.lastName.toLowerCase()}`
      return !existingSet.has(key)
    })

    let importedCount = 0
    const errors: Array<{ lead: any; error: string }> = []

    for (const lead of uniqueLeads) {
      try {
        await this.leadRepo.create({
          firstName: lead.firstName.trim(),
          lastName: lead.lastName.trim(),
          email: lead.email.trim(),
          jobTitle: lead.jobTitle ? lead.jobTitle.trim() : null,
          countryCode: lead.countryCode ? lead.countryCode.trim() : null,
          companyName: lead.companyName ? lead.companyName.trim() : null,
        })
        importedCount++
      } catch (error) {
        errors.push({
          lead,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return {
      success: true,
      importedCount,
      duplicatesSkipped: validLeads.length - uniqueLeads.length,
      invalidLeads: leads.length - validLeads.length,
      errors,
    }
  }
}
