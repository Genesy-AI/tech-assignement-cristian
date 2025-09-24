import { describe, it, expect } from 'vitest'
import { CountryCode } from '../../../../src/leads/domain/value-objects/CountryCode'

describe('CountryCode Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid country code', () => {
      const countryCode = new CountryCode('US')
      expect(countryCode.getValue()).toBe('US')
    })

    it('should normalize to uppercase', () => {
      const countryCode = new CountryCode('us')
      expect(countryCode.getValue()).toBe('US')
    })

    it('should trim whitespace', () => {
      const countryCode = new CountryCode('  US  ')
      expect(countryCode.getValue()).toBe('US')
    })

    it('should throw error for empty country code', () => {
      expect(() => new CountryCode('')).toThrow('Country code cannot be empty')
      expect(() => new CountryCode('   ')).toThrow('Country code cannot be empty')
    })

    it('should throw error for null/undefined country code', () => {
      expect(() => new CountryCode(null as any)).toThrow('Country code cannot be empty')
      expect(() => new CountryCode(undefined as any)).toThrow('Country code cannot be empty')
    })

    it('should throw error for invalid format', () => {
      expect(() => new CountryCode('USA')).toThrow('Invalid country code format (must be 2 uppercase letters)')
      expect(() => new CountryCode('U')).toThrow('Invalid country code format (must be 2 uppercase letters)')
      expect(() => new CountryCode('123')).toThrow('Invalid country code format (must be 2 uppercase letters)')
    })
  })

  describe('constructor without validation', () => {
    it('should create country code without validation', () => {
      const countryCode = new CountryCode('INVALID', false)
      expect(countryCode.getValue()).toBe('INVALID')
    })

    it('should allow manual validation', () => {
      const countryCode = new CountryCode('INVALID', false)
      expect(() => countryCode.validate()).toThrow('Invalid country code format (must be 2 uppercase letters)')
    })
  })

  describe('static create method', () => {
    it('should create country code with validation by default', () => {
      const countryCode = CountryCode.create('US')
      expect(countryCode.getValue()).toBe('US')
    })

    it('should create country code without validation when specified', () => {
      const countryCode = CountryCode.create('INVALID', false)
      expect(countryCode.getValue()).toBe('INVALID')
    })
  })

  describe('equals method', () => {
    it('should return true for same country codes', () => {
      const countryCode1 = new CountryCode('US')
      const countryCode2 = new CountryCode('US')
      expect(countryCode1.equals(countryCode2)).toBe(true)
    })

    it('should return false for different country codes', () => {
      const countryCode1 = new CountryCode('US')
      const countryCode2 = new CountryCode('CA')
      expect(countryCode1.equals(countryCode2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return country code as string', () => {
      const countryCode = new CountryCode('US')
      expect(countryCode.toString()).toBe('US')
    })
  })

  describe('valid country codes', () => {
    const validCodes = [
      'US',
      'CA',
      'GB',
      'DE',
      'FR',
      'JP',
      'AU',
      'BR',
      'IN',
      'CN'
    ]

    validCodes.forEach(code => {
      it(`should accept valid country code: ${code}`, () => {
        expect(() => new CountryCode(code)).not.toThrow()
      })
    })

    const invalidCodes = [
      '',
      '   ',
      'USA',
      'U',
      '123',
      null as any,
      undefined as any
    ]

    invalidCodes.forEach(code => {
      it(`should reject invalid country code: ${code}`, () => {
        expect(() => new CountryCode(code)).toThrow()
      })
    })
  })
})
