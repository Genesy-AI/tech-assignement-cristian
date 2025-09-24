import { describe, it, expect } from 'vitest'
import { LastName } from '../../../../src/leads/domain/value-objects/LastName'

describe('LastName Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid last name', () => {
      const lastName = new LastName('Smith')
      expect(lastName.getValue()).toBe('Smith')
    })

    it('should trim whitespace', () => {
      const lastName = new LastName('  Smith  ')
      expect(lastName.getValue()).toBe('Smith')
    })

    it('should throw error for empty last name', () => {
      expect(() => new LastName('')).toThrow('Last name cannot be empty')
      expect(() => new LastName('   ')).toThrow('Last name cannot be empty')
    })

    it('should throw error for null/undefined last name', () => {
      expect(() => new LastName(null as any)).toThrow('Last name cannot be empty')
      expect(() => new LastName(undefined as any)).toThrow('Last name cannot be empty')
    })

    it('should throw error for too long last name', () => {
      const longName = 'A'.repeat(101)
      expect(() => new LastName(longName)).toThrow('Last name cannot exceed 100 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create last name without validation', () => {
      const lastName = new LastName('', false)
      expect(lastName.getValue()).toBe('')
    })

    it('should allow manual validation', () => {
      const lastName = new LastName('', false)
      expect(() => lastName.validate()).toThrow('Last name cannot be empty')
    })
  })

  describe('static create method', () => {
    it('should create last name with validation by default', () => {
      const lastName = LastName.create('Smith')
      expect(lastName.getValue()).toBe('Smith')
    })

    it('should create last name without validation when specified', () => {
      const lastName = LastName.create('', false)
      expect(lastName.getValue()).toBe('')
    })
  })

  describe('equals method', () => {
    it('should return true for same last names', () => {
      const lastName1 = new LastName('Smith')
      const lastName2 = new LastName('Smith')
      expect(lastName1.equals(lastName2)).toBe(true)
    })

    it('should return false for different last names', () => {
      const lastName1 = new LastName('Smith')
      const lastName2 = new LastName('Johnson')
      expect(lastName1.equals(lastName2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return last name as string', () => {
      const lastName = new LastName('Smith')
      expect(lastName.toString()).toBe('Smith')
    })
  })

  describe('valid last names', () => {
    const validNames = [
      'Smith',
      'Johnson',
      'O\'Connor',
      'van der Berg',
      'García',
      'Müller',
      '王',
      'Иванов',
      'A'.repeat(100) // Maximum length
    ]

    validNames.forEach(name => {
      it(`should accept valid last name: ${name}`, () => {
        expect(() => new LastName(name)).not.toThrow()
      })
    })

    const invalidNames = [
      '',
      '   ',
      'A'.repeat(101), // Too long
      null as any,
      undefined as any
    ]

    invalidNames.forEach(name => {
      it(`should reject invalid last name: ${name}`, () => {
        expect(() => new LastName(name)).toThrow()
      })
    })
  })
})
