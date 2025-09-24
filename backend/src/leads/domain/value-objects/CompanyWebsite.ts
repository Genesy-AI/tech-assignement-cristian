export class CompanyWebsite {
  private readonly value: string | null

  constructor(value: string | null, validate: boolean = true) {
    if (value === null || value === undefined) {
      this.value = null
    } else {
      const trimmed = value.trim()
      this.value = this.normalizeUrl(trimmed)
    }
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string | null, validate: boolean = true): CompanyWebsite {
    return new CompanyWebsite(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Company website must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Company website must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Company website cannot be empty')
    }
    
    if (this.value.length > 500) {
      throw new Error('Company website cannot exceed 500 characters')
    }

    if (!this.isValidUrl(this.value)) {
      throw new Error('Invalid website URL format')
    }
  }

  private isValidUrl(url: string): boolean {
    // Simple domain validation: must have at least one dot and end with a valid TLD
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
    return domainRegex.test(url)
  }

  private normalizeUrl(url: string): string {
    // Remove protocol for storage, add it back when needed
    return url.replace(/^https?:\/\//, '')
  }

  getValue(): string | null {
    return this.value
  }

  getFullUrl(): string | null {
    if (this.value === null) return null
    return this.value.startsWith('http') ? this.value : `https://${this.value}`
  }

  equals(other: CompanyWebsite): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
