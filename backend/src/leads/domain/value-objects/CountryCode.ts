export class CountryCode {
  private readonly value: string | null

  constructor(value: string | null, validate: boolean = true) {
    if (value === null || value === undefined) {
      this.value = null
    } else {
      const trimmed = value.trim().toUpperCase()
      this.value = trimmed
    }
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string | null, validate: boolean = true): CountryCode {
    return new CountryCode(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Country code must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Country code must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Country code cannot be empty')
    }
    
    if (!this.isValidCountryCode(this.value)) {
      throw new Error('Invalid country code format (must be 2 uppercase letters)')
    }
  }

  private isValidCountryCode(countryCode: string): boolean {
    // Valid ISO 3166-1 alpha-2 country codes are exactly 2 uppercase letters
    const countryCodeRegex = /^[A-Z]{2}$/
    return countryCodeRegex.test(countryCode)
  }

  getValue(): string | null {
    return this.value
  }

  equals(other: CountryCode): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
