import { Email } from '../value-objects/Email'

export interface EmailVerificationResult {
  email: string
  isValid: boolean
  reason?: string
  verifiedAt: Date
}

export class EmailVerificationService {
  /**
   * Fast, synchronous email verification
   * No external API calls - just domain logic validation
   */
  verify(emailAddress: string): EmailVerificationResult {
    try {
      const email = new Email(emailAddress)
      const verification = email.getVerificationResult()
      
      return {
        email: email.address,
        isValid: verification.isValid,
        reason: verification.reason,
        verifiedAt: new Date()
      }
    } catch (error) {
      return {
        email: emailAddress,
        isValid: false,
        reason: error instanceof Error ? error.message : 'Invalid email format',
        verifiedAt: new Date()
      }
    }
  }

  /**
   * Verify multiple emails at once
   */
  verifyBatch(emailAddresses: string[]): EmailVerificationResult[] {
    return emailAddresses.map(email => this.verify(email))
  }
}
