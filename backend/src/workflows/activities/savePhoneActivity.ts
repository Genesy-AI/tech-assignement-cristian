import { LeadRepository } from '../../leads/domain/LeadRepository'
import { LeadPrismaRepository } from '../../leads/infrastructure/prisma/LeadPrismaRepository'
import { Lead } from '../../leads/domain/Lead'

export interface SavePhoneInput {
  leadId: number
  phone: string
}

export interface SavePhoneResult {
  success: boolean
  error?: string
}


export async function savePhoneActivity(input: SavePhoneInput): Promise<SavePhoneResult> {
  const { leadId, phone } = input
  
  try {
    const leadRepo: LeadRepository = new LeadPrismaRepository()
    
    // Get the existing lead to verify it exists
    const existingLead = await leadRepo.findById(leadId)
    if (!existingLead) {
      return {
        success: false,
        error: 'Lead not found'
      }
    }

    // Update only the phone field using the specific method
    await leadRepo.updatePhone(leadId, phone)
    
    return {
      success: true
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      success: false,
      error: errorMessage
    }
  }
}
