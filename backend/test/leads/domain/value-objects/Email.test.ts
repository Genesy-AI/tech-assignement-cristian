import { describe, it, expect } from 'vitest'
import { Email } from '../../../../src/leads/domain/value-objects/Email'

describe('Email Value Object', () => {
  describe('constructor validation', () => {
    it('should create valid email', () => {
      const email = new Email('user@example.com')
      expect(email.address).toBe('user@example.com')
    })

    it('should normalize email to lowercase', () => {
      const email = new Email('USER@EXAMPLE.COM')
      expect(email.address).toBe('user@example.com')
    })

    it('should trim whitespace', () => {
      const email = new Email('  user@example.com  ')
      expect(email.address).toBe('user@example.com')
    })

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow('Email is required and must be a string')
      expect(() => new Email('   ')).toThrow('Email cannot be empty')
    })

    it('should throw error for null/undefined email', () => {
      expect(() => new Email(null as any)).toThrow('Email is required and must be a string')
      expect(() => new Email(undefined as any)).toThrow('Email is required and must be a string')
    })

    it('should throw error for invalid format', () => {
      expect(() => new Email('invalid')).toThrow('Email format is invalid')
      expect(() => new Email('invalid@')).toThrow('Email format is invalid')
      expect(() => new Email('@example.com')).toThrow('Email format is invalid')
      expect(() => new Email('user@')).toThrow('Email format is invalid')
    })

    it('should throw error for consecutive dots', () => {
      expect(() => new Email('user..name@example.com')).toThrow('Email cannot contain consecutive dots')
    })

    it('should throw error for dots at start/end of local part', () => {
      expect(() => new Email('.user@example.com')).toThrow('Email local part cannot start or end with a dot')
      expect(() => new Email('user.@example.com')).toThrow('Email local part cannot start or end with a dot')
    })

    it('should throw error for too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(() => new Email(longEmail)).toThrow('Email is too long')
    })
  })

  describe('getters', () => {
    it('should return correct domain', () => {
      const email = new Email('user@example.com')
      expect(email.domain).toBe('example.com')
    })

    it('should return correct local part', () => {
      const email = new Email('user.name@example.com')
      expect(email.localPart).toBe('user.name')
    })
  })

  describe('isValid method', () => {
    it('should return true for valid business emails', () => {
      const email = new Email('john.doe@company.com')
      expect(email.isValid()).toBe(true)
    })
  })

  describe('getVerificationResult method', () => {
    it('should return valid result for all properly formatted emails', () => {
      const email = new Email('john@company.co.uk')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should return valid for test emails (basic format validation only)', () => {
      const email = new Email('test123@company.com')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
    })

    it('should return valid for fake emails (basic format validation only)', () => {
      const email = new Email('fake.user@company.com')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
    })

    it('should return valid for noreply emails (basic format validation only)', () => {
      const email = new Email('noreply@company.com')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
    })

    it('should return valid for example domains (basic format validation only)', () => {
      const email = new Email('user@example.com')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
    })

    it('should return valid for localhost (basic format validation only)', () => {
      const email = new Email('user@localhost.dev')
      const result = email.getVerificationResult()
      expect(result.isValid).toBe(true)
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

  describe('real-world email formats', () => {
    const validEmails = [
      'user@domain.com',
      'user.name@domain.com',
      'user+tag@domain.com',
      'user123@domain.co.uk',
      'user_name@sub.domain.org',
      'a@b.co',
    ]

    validEmails.forEach(emailStr => {
      it(`should accept valid email: ${emailStr}`, () => {
        expect(() => new Email(emailStr)).not.toThrow()
      })
    })

    const invalidEmails = [
      'plainaddress',
      '@missingdomain.com',
      'missing@.com',
      'missing@domain',
      'spaces @domain.com',
      'user@domain .com',
      'user@@domain.com',
      'user@domain..com',
    ]

    invalidEmails.forEach(emailStr => {
      it(`should reject invalid email: ${emailStr}`, () => {
        expect(() => new Email(emailStr)).toThrow()
      })
    })
  })
})
