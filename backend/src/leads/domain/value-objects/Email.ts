export class Email {
  private readonly value: string | null

  constructor(value: string | null, validate: boolean = true) {
    if (value === null || value === undefined) {
      this.value = null
    } else {
      const trimmed = value.trim().toLowerCase()
      this.value = trimmed
    }
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string | null, validate: boolean = true): Email {
    return new Email(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Email is required and must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Email is required and must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Email cannot be empty')
    }
    
    if (this.value.length > 255) {
      throw new Error('Email cannot exceed 255 characters')
    }

    if (!this.isValidEmail(this.value)) {
      throw new Error('Invalid email format')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  getValue(): string | null {
    return this.value
  }

  getDomain(): string | null {
    if (this.value === null) return null
    return this.value.split('@')[1]
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
