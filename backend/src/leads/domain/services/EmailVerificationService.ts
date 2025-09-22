export interface EmailVerificationResult {
  email: string
  isValid: boolean
  reason?: string
  verifiedAt: Date
}

export class EmailVerificationService {
  verify(email: string): EmailVerificationResult {
    try {
      // Basic email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const isValid = emailRegex.test(email.trim())
      
      return {
        email: email.trim().toLowerCase(),
        isValid,
        reason: isValid ? undefined : 'Invalid email format',
        verifiedAt: new Date()
      }
    } catch (error) {
      return {
        email: email,
        isValid: false,
        reason: error instanceof Error ? error.message : 'Invalid email format',
        verifiedAt: new Date()
      }
    }
  }
}
