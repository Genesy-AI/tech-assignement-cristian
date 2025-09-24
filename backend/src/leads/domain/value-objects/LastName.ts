export class LastName {
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

  static create(value: string | null, validate: boolean = true): LastName {
    return new LastName(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Last name is required and must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Last name is required and must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Last name cannot be empty')
    }
    
    if (this.value.length > 100) {
      throw new Error('Last name cannot exceed 100 characters')
    }
  }

  getValue(): string | null {
    return this.value
  }

  equals(other: LastName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
