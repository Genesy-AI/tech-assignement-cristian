import { LeadRepository } from '../../leads/domain/LeadRepository'
import { LeadPrismaRepository } from '../../leads/infrastructure/prisma/LeadPrismaRepository'

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
    await leadRepo.update(leadId, { phone })
    
    return {
      success: true
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[SavePhoneActivity] Error updating lead ${leadId}:`, errorMessage)
    
    return {
      success: false,
      error: errorMessage
    }
  }
}
