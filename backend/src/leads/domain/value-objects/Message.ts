export class Message {
  private readonly value: string

  constructor(value: string, validate: boolean = true) {
    const trimmed = value.trim()
    this.value = trimmed
    
    if (validate) {
      this.validate()
    }
  }

  static create(value: string, validate: boolean = true): Message {
    return new Message(value, validate)
  }

  validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('Message must be a string')
    }
    
    if (this.value.length === 0) {
      throw new Error('Message cannot be empty')
    }
    
    if (this.value.length > 2000) {
      throw new Error('Message cannot exceed 2000 characters')
    }
  }

  getValue(): string {
    return this.value
  }

  getLength(): number {
    return this.value.length
  }

  equals(other: Message): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
