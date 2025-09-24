export class CompanyWebsite {
  private readonly value: string

  constructor(value: string, validate: boolean = true) {
    const trimmed = value.trim()
    this.value = this.normalizeUrl(trimmed)
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string, validate: boolean = true): CompanyWebsite {
    return new CompanyWebsite(value, validate)
  }

  validate(): void {
    if (!this.value || typeof this.value !== 'string') {
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
    try {
      // Add protocol if missing
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
      new URL(urlWithProtocol)
      return true
    } catch {
      return false
    }
  }

  private normalizeUrl(url: string): string {
    // Remove protocol for storage, add it back when needed
    return url.replace(/^https?:\/\//, '')
  }

  getValue(): string {
    return this.value
  }

  getFullUrl(): string {
    return this.value.startsWith('http') ? this.value : `https://${this.value}`
  }

  equals(other: CompanyWebsite): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
