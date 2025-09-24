export class FirstName {
  private readonly value: string | null

  constructor(value: string | null, validate: boolean = true) {
    if (value === null || value === undefined) {
      this.value = null
    } else {
      const trimmed = value.trim()
      this.value = trimmed
    }
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string | null, validate: boolean = true): FirstName {
    return new FirstName(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('First name is required and must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('First name is required and must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('First name cannot be empty')
    }
    
    if (this.value.length > 100) {
      throw new Error('First name cannot exceed 100 characters')
    }
  }

  getValue(): string | null {
    return this.value
  }

  equals(other: FirstName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
