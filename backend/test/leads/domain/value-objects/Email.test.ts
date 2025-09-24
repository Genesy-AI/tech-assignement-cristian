import { describe, it, expect } from 'vitest'
import { Email } from '../../../../src/leads/domain/value-objects/Email'

describe('Email Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid email', () => {
      const email = new Email('user@example.com')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should normalize email to lowercase', () => {
      const email = new Email('USER@EXAMPLE.COM')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should trim whitespace', () => {
      const email = new Email('  user@example.com  ')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow('Email cannot be empty')
      expect(() => new Email('   ')).toThrow('Email cannot be empty')
    })

    it('should throw error for null/undefined email', () => {
      expect(() => new Email(null as any)).toThrow('Email is required and must be a string')
      expect(() => new Email(undefined as any)).toThrow('Email is required and must be a string')
    })

    it('should throw error for invalid format', () => {
      expect(() => new Email('invalid')).toThrow('Invalid email format')
      expect(() => new Email('invalid@')).toThrow('Invalid email format')
      expect(() => new Email('@example.com')).toThrow('Invalid email format')
      expect(() => new Email('user@')).toThrow('Invalid email format')
    })

    it('should throw error for too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(() => new Email(longEmail)).toThrow('Email cannot exceed 255 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create email without validation', () => {
      const email = new Email('invalid-email', false)
      expect(email.getValue()).toBe('invalid-email')
    })

    it('should allow manual validation', () => {
      const email = new Email('invalid-email', false)
      expect(() => email.validate()).toThrow('Invalid email format')
    })
  })

  describe('static create method', () => {
    it('should create email with validation by default', () => {
      const email = Email.create('user@example.com')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should create email without validation when specified', () => {
      const email = Email.create('invalid-email', false)
      expect(email.getValue()).toBe('invalid-email')
    })
  })

  describe('getters', () => {
    it('should return correct domain', () => {
      const email = new Email('user@example.com')
      expect(email.getDomain()).toBe('example.com')
    })
  })

  describe('equals method', () => {
    it('should return true for same emails', () => {
      const email1 = new Email('user@example.com')
      const email2 = new Email('user@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for same emails with different casing', () => {
      const email1 = new Email('USER@EXAMPLE.COM')
      const email2 = new Email('user@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = new Email('user1@example.com')
      const email2 = new Email('user2@example.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return email address as string', () => {
      const email = new Email('user@example.com')
      expect(email.toString()).toBe('user@example.com')
    })
  })

})
