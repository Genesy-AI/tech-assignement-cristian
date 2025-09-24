import { LeadRepository } from '../../domain/LeadRepository'
import { Lead } from '../../domain/Lead'

export class BulkImportLeadsUseCase {
  constructor(private readonly leadRepo: LeadRepository) {}

  async execute(leads: Array<{
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    jobTitle?: string | null
    countryCode?: string | null
    companyName?: string | null
    companyWebsite?: string | null
  }>) {
    const validLeads: Lead[] = []
    const invalidLeads: Array<{ lead: any; error: string }> = []

    // Validate and create domain objects
    for (const leadData of leads) {
      try {
        const lead = Lead.create({
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          jobTitle: leadData.jobTitle,
          countryCode: leadData.countryCode,
          companyName: leadData.companyName,
          companyWebsite: leadData.companyWebsite,
        })
        validLeads.push(lead)
      } catch (error) {
        invalidLeads.push({
          lead: leadData,
          error: error instanceof Error ? error.message : 'Unknown validation error',
        })
      }
    }

    if (validLeads.length === 0) {
      return {
        success: false,
        importedCount: 0,
        duplicatesSkipped: 0,
        invalidLeads: leads.length,
        errors: [{ error: 'No valid leads found. firstName, lastName, and email are required.' }],
      }
    }

    // Check for duplicates
    const existingLeads = await Promise.all(
      validLeads.map((lead) => this.leadRepo.findByFirstAndLast(lead.firstName.getValue(), lead.lastName.getValue()))
    )

    const existingSet = new Set(
      existingLeads.flat().map((lead) => `${lead.firstName.getValue().toLowerCase()}_${lead.lastName.getValue().toLowerCase()}`)
    )

    const uniqueLeads = validLeads.filter((lead) => {
      const key = `${lead.firstName.getValue().toLowerCase()}_${lead.lastName.getValue().toLowerCase()}`
      return !existingSet.has(key)
    })

    let importedCount = 0
    const errors: Array<{ lead: any; error: string }> = []

    for (const lead of uniqueLeads) {
      try {
        await this.leadRepo.create(lead)
        importedCount++
      } catch (error) {
        errors.push({
          lead: lead.toPersistence(),
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return {
      success: true,
      importedCount,
      duplicatesSkipped: validLeads.length - uniqueLeads.length,
      invalidLeads: leads.length - validLeads.length,
      errors: [...errors, ...invalidLeads],
    }
  }
}
