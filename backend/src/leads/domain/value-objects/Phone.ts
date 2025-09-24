export class Phone {
  private readonly value: string

  constructor(value: string, validate: boolean = true) {
    if (value === null || value === undefined) {
      this.value = ''
    } else {
      const trimmed = value.trim()
      this.value = trimmed
    }
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string, validate: boolean = true): Phone {
    return new Phone(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Phone must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Phone must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Phone cannot be empty')
    }
    
    if (this.value.length > 20) {
      throw new Error('Phone cannot exceed 20 characters')
    }

    // Basic phone validation - allows international formats
    if (!this.isValidPhone(this.value)) {
      throw new Error('Invalid phone format')
    }
  }

  private isValidPhone(phone: string): boolean {
    // Allow international phone formats with +, -, spaces, parentheses, and x for extensions
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.x]+$/
    return phoneRegex.test(phone) && phone.replace(/[\s\-\(\)\.x]/g, '').length >= 7
  }

  getValue(): string {
    return this.value
  }

  getCleanNumber(): string {
    return this.value.replace(/[\s\-\(\)\.x]/g, '')
  }

  equals(other: Phone): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
