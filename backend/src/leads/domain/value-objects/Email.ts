export class Email {
  private readonly value: string

  constructor(email: string) {
    this.value = this.validate(email)
  }

  private validate(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string')
    }

    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      throw new Error('Email cannot be empty')
    }

    // Basic email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Email format is invalid')
    }

    // Additional validations
    if (trimmedEmail.length > 254) {
      throw new Error('Email is too long (maximum 254 characters)')
    }

    const [localPart, domain] = trimmedEmail.split('@')
    
    if (localPart.length > 64) {
      throw new Error('Email local part is too long (maximum 64 characters)')
    }

    if (domain.length > 253) {
      throw new Error('Email domain is too long (maximum 253 characters)')
    }

    // Check for consecutive dots
    if (trimmedEmail.includes('..')) {
      throw new Error('Email cannot contain consecutive dots')
    }

    // Check for dots at the beginning or end of local part
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      throw new Error('Email local part cannot start or end with a dot')
    }

    return trimmedEmail.toLowerCase()
  }

  get address(): string {
    return this.value
  }

  get domain(): string {
    return this.value.split('@')[1]
  }

  get localPart(): string {
    return this.value.split('@')[0]
  }

  /**
   * Basic email verification - checks format and common issues
   * This is fast and synchronous, no external API calls needed
   */
  isValid(): boolean {
    try {
      // For now, just check if it's a valid email format
      // We can add more business rules later if needed
      return true // Valid email format already checked in constructor
    } catch {
      return false
    }
  }

  /**
   * Get verification status with reason
   * For now, just return true if email format is valid (already validated in constructor)
   */
  getVerificationResult(): { isValid: boolean; reason?: string } {
    return { isValid: true }
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
