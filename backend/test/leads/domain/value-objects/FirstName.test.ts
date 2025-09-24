import { describe, it, expect } from 'vitest'
import { FirstName } from '../../../../src/leads/domain/value-objects/FirstName'

describe('FirstName Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid first name', () => {
      const firstName = new FirstName('John')
      expect(firstName.getValue()).toBe('John')
    })

    it('should trim whitespace', () => {
      const firstName = new FirstName('  John  ')
      expect(firstName.getValue()).toBe('John')
    })

    it('should throw error for empty first name', () => {
      expect(() => new FirstName('')).toThrow('First name cannot be empty')
      expect(() => new FirstName('   ')).toThrow('First name cannot be empty')
    })

    it('should throw error for null/undefined first name', () => {
      expect(() => new FirstName(null as any)).toThrow('First name is required and must be a string')
      expect(() => new FirstName(undefined as any)).toThrow('First name is required and must be a string')
    })

    it('should throw error for too long first name', () => {
      const longName = 'A'.repeat(101)
      expect(() => new FirstName(longName)).toThrow('First name cannot exceed 100 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create first name without validation', () => {
      const firstName = new FirstName('', false)
      expect(firstName.getValue()).toBe('')
    })

    it('should allow manual validation', () => {
      const firstName = new FirstName('', false)
      expect(() => firstName.validate()).toThrow('First name cannot be empty')
    })
  })

  describe('static create method', () => {
    it('should create first name with validation by default', () => {
      const firstName = FirstName.create('John')
      expect(firstName.getValue()).toBe('John')
    })

    it('should create first name without validation when specified', () => {
      const firstName = FirstName.create('', false)
      expect(firstName.getValue()).toBe('')
    })
  })

  describe('equals method', () => {
    it('should return true for same first names', () => {
      const firstName1 = new FirstName('John')
      const firstName2 = new FirstName('John')
      expect(firstName1.equals(firstName2)).toBe(true)
    })

    it('should return false for different first names', () => {
      const firstName1 = new FirstName('John')
      const firstName2 = new FirstName('Jane')
      expect(firstName1.equals(firstName2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return first name as string', () => {
      const firstName = new FirstName('John')
      expect(firstName.toString()).toBe('John')
    })
  })

  describe('valid first names', () => {
    const validNames = [
      'John',
      'Jane',
      'Mary-Jane',
      'O\'Connor',
      'José',
      'François',
      '李',
      'Александр',
      'A'.repeat(100) // Maximum length
    ]

    validNames.forEach(name => {
      it(`should accept valid first name: ${name}`, () => {
        expect(() => new FirstName(name)).not.toThrow()
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
      it(`should reject invalid first name: ${name}`, () => {
        expect(() => new FirstName(name)).toThrow()
      })
    })
  })
})
