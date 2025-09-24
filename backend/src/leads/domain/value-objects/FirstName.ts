export class FirstName {
  private readonly value: string

  constructor(value: string, validate: boolean = true) {
    const trimmed = value.trim()
    this.value = trimmed
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string, validate: boolean = true): FirstName {
    return new FirstName(value, validate)
  }

  validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('First name is required and must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('First name cannot be empty')
    }
    
    if (this.value.length > 100) {
      throw new Error('First name cannot exceed 100 characters')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: FirstName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
