export class JobTitle {
  private readonly value: string

  constructor(value: string, validate: boolean = true) {
    const trimmed = value.trim()
    this.value = trimmed
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string, validate: boolean = true): JobTitle {
    return new JobTitle(value, validate)
  }

  validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('Job title must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Job title cannot be empty')
    }
    
    if (this.value.length > 200) {
      throw new Error('Job title cannot exceed 200 characters')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: JobTitle): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
