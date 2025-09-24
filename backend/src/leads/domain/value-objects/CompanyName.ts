export class CompanyName {
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

  static create(value: string, validate: boolean = true): CompanyName {
    return new CompanyName(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Company name must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Company name must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Company name cannot be empty')
    }
    
    if (this.value.length > 200) {
      throw new Error('Company name cannot exceed 200 characters')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: CompanyName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
