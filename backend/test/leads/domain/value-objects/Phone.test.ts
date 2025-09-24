import { describe, it, expect } from 'vitest'
import { Phone } from '../../../../src/leads/domain/value-objects/Phone'

describe('Phone Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid phone', () => {
      const phone = new Phone('+1234567890')
      expect(phone.getValue()).toBe('+1234567890')
    })

    it('should trim whitespace', () => {
      const phone = new Phone('  +1234567890  ')
      expect(phone.getValue()).toBe('+1234567890')
    })

    it('should throw error for empty phone', () => {
      expect(() => new Phone('')).toThrow('Phone cannot be empty')
      expect(() => new Phone('   ')).toThrow('Phone cannot be empty')
    })

    it('should throw error for null/undefined phone', () => {
      expect(() => new Phone(null as any)).toThrow('Phone cannot be empty')
      expect(() => new Phone(undefined as any)).toThrow('Phone cannot be empty')
    })

    it('should throw error for too long phone', () => {
      const longPhone = '1'.repeat(25)
      expect(() => new Phone(longPhone)).toThrow('Phone cannot exceed 20 characters')
    })

    it('should throw error for invalid format', () => {
      expect(() => new Phone('abc')).toThrow('Invalid phone format')
      expect(() => new Phone('123')).toThrow('Invalid phone format') // Too short
      expect(() => new Phone('invalid-phone')).toThrow('Invalid phone format')
    })
  })

  describe('constructor without validation', () => {
    it('should create phone without validation', () => {
      const phone = new Phone('invalid-phone', false)
      expect(phone.getValue()).toBe('invalid-phone')
    })

    it('should allow manual validation', () => {
      const phone = new Phone('invalid-phone', false)
      expect(() => phone.validate()).toThrow('Invalid phone format')
    })
  })

  describe('static create method', () => {
    it('should create phone with validation by default', () => {
      const phone = Phone.create('+1234567890')
      expect(phone.getValue()).toBe('+1234567890')
    })

    it('should create phone without validation when specified', () => {
      const phone = Phone.create('invalid-phone', false)
      expect(phone.getValue()).toBe('invalid-phone')
    })
  })

  describe('getCleanNumber method', () => {
    it('should return clean number without formatting', () => {
      const phone = new Phone('+1-280-754-0462')
      expect(phone.getCleanNumber()).toBe('+12807540462')
    })

    it('should handle extension', () => {
      const phone = new Phone('+1-280-754-0462x2154')
      expect(phone.getCleanNumber()).toBe('+128075404622154')
    })

    it('should handle spaces and parentheses', () => {
      const phone = new Phone('+1 (280) 754-0462')
      expect(phone.getCleanNumber()).toBe('+12807540462')
    })
  })

  describe('equals method', () => {
    it('should return true for same phones', () => {
      const phone1 = new Phone('+1234567890')
      const phone2 = new Phone('+1234567890')
      expect(phone1.equals(phone2)).toBe(true)
    })

    it('should return false for different phones', () => {
      const phone1 = new Phone('+1234567890')
      const phone2 = new Phone('+1234567891')
      expect(phone1.equals(phone2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return phone as string', () => {
      const phone = new Phone('+1234567890')
      expect(phone.toString()).toBe('+1234567890')
    })
  })

  describe('valid phone formats', () => {
    const validPhones = [
      '+1234567890',
      '+1-280-754-0462',
      '+1-280-754-0462x2154',
      '+1 (280) 754-0462',
      '+1.280.754.0462',
      '1234567890',
      '(123) 456-7890',
      '123-456-7890',
      '+44 20 7946 0958',
      '+33 1 42 86 83 26',
      '+49 30 12345678'
    ]

    validPhones.forEach(phoneStr => {
      it(`should accept valid phone: ${phoneStr}`, () => {
        expect(() => new Phone(phoneStr)).not.toThrow()
      })
    })

    const invalidPhones = [
      'abc',
      '123',
      '12345',
      'invalid-phone',
      '123-abc-7890',
      '+123-abc-7890',
      '123@456-7890',
      '123#456-7890'
    ]

    invalidPhones.forEach(phoneStr => {
      it(`should reject invalid phone: ${phoneStr}`, () => {
        expect(() => new Phone(phoneStr)).toThrow()
      })
    })
  })
})
