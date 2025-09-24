export class Message {
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

  static create(value: string | null, validate: boolean = true): Message {
    return new Message(value, validate)
  }

  validate(): void {
    if (this.value === null || this.value === undefined) {
      throw new Error('Message must be a string')
    }
    
    if (typeof this.value !== 'string') {
      throw new Error('Message must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Message cannot be empty')
    }
    
    if (this.value.length > 2000) {
      throw new Error('Message cannot exceed 2000 characters')
    }
  }

  getValue(): string | null {
    return this.value
  }

  getLength(): number {
    return this.value?.length || 0
  }

  equals(other: Message): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value || ''
  }
}
