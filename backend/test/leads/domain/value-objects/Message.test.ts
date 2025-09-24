import { describe, it, expect } from 'vitest'
import { Message } from '../../../../src/leads/domain/value-objects/Message'

describe('Message Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid message', () => {
      const message = new Message('Hello, this is a test message')
      expect(message.getValue()).toBe('Hello, this is a test message')
    })

    it('should trim whitespace', () => {
      const message = new Message('  Hello, this is a test message  ')
      expect(message.getValue()).toBe('Hello, this is a test message')
    })

    it('should throw error for empty message', () => {
      expect(() => new Message('')).toThrow('Message cannot be empty')
      expect(() => new Message('   ')).toThrow('Message cannot be empty')
    })

    it('should throw error for null/undefined message', () => {
      expect(() => new Message(null as any)).toThrow('Message cannot be empty')
      expect(() => new Message(undefined as any)).toThrow('Message cannot be empty')
    })

    it('should throw error for too long message', () => {
      const longMessage = 'A'.repeat(2001)
      expect(() => new Message(longMessage)).toThrow('Message cannot exceed 2000 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create message without validation', () => {
      const message = new Message('', false)
      expect(message.getValue()).toBe('')
    })

    it('should allow manual validation', () => {
      const message = new Message('', false)
      expect(() => message.validate()).toThrow('Message cannot be empty')
    })
  })

  describe('static create method', () => {
    it('should create message with validation by default', () => {
      const message = Message.create('Hello, this is a test message')
      expect(message.getValue()).toBe('Hello, this is a test message')
    })

    it('should create message without validation when specified', () => {
      const message = Message.create('', false)
      expect(message.getValue()).toBe('')
    })
  })

  describe('getLength method', () => {
    it('should return correct message length', () => {
      const message = new Message('Hello')
      expect(message.getLength()).toBe(5)
    })

    it('should return 0 for empty message', () => {
      const message = new Message('', false)
      expect(message.getLength()).toBe(0)
    })
  })

  describe('equals method', () => {
    it('should return true for same messages', () => {
      const message1 = new Message('Hello')
      const message2 = new Message('Hello')
      expect(message1.equals(message2)).toBe(true)
    })

    it('should return false for different messages', () => {
      const message1 = new Message('Hello')
      const message2 = new Message('World')
      expect(message1.equals(message2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return message as string', () => {
      const message = new Message('Hello')
      expect(message.toString()).toBe('Hello')
    })
  })

  describe('valid messages', () => {
    const validMessages = [
      'Hello',
      'This is a longer message with more content',
      'A'.repeat(2000) // Maximum length
    ]

    validMessages.forEach(message => {
      it(`should accept valid message: ${message.substring(0, 20)}...`, () => {
        expect(() => new Message(message)).not.toThrow()
      })
    })

    const invalidMessages = [
      '',
      '   ',
      'A'.repeat(2001), // Too long
      null as any,
      undefined as any
    ]

    invalidMessages.forEach(message => {
      it(`should reject invalid message: ${message}`, () => {
        expect(() => new Message(message)).toThrow()
      })
    })
  })
})
