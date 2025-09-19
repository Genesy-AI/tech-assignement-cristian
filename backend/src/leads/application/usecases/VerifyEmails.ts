import { LeadRepository } from '../../domain/LeadRepository'
import { EmailVerificationService } from '../../domain/services/EmailVerificationService'

export class VerifyEmailsUseCase {
  constructor(
    private readonly leadRepo: LeadRepository,
    private readonly emailVerifier: EmailVerificationService
  ) {}

  async execute(leadIds: number[]) {
    const leads = await this.leadRepo.findManyByIds(leadIds)
    if (leads.length === 0) {
      return { error: 'No leads found with the provided IDs' }
    }

    let verifiedCount = 0
    const results: Array<{ leadId: number; emailVerified: boolean; reason?: string }> = []
    const errors: Array<{ leadId: number; leadName: string; error: string }> = []

    for (const lead of leads) {
      try {
        const verification = this.emailVerifier.verify(lead.email)
        await this.leadRepo.update(lead.id!, { emailVerified: verification.isValid })
        results.push({ 
          leadId: lead.id!, 
          emailVerified: verification.isValid,
          reason: verification.reason 
        })
        if (verification.isValid) {
          verifiedCount += 1
        }
      } catch (error) {
        errors.push({
          leadId: lead.id!,
          leadName: `${lead.firstName} ${lead.lastName}`.trim(),
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { success: true, verifiedCount, results, errors }
  }
}
