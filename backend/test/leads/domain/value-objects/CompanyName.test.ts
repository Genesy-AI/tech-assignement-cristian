import { describe, it, expect } from 'vitest'
import { CompanyName } from '../../../../src/leads/domain/value-objects/CompanyName'

describe('CompanyName Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid company name', () => {
      const companyName = new CompanyName('Acme Corp')
      expect(companyName.getValue()).toBe('Acme Corp')
    })

    it('should trim whitespace', () => {
      const companyName = new CompanyName('  Acme Corp  ')
      expect(companyName.getValue()).toBe('Acme Corp')
    })

    it('should throw error for empty company name', () => {
      expect(() => new CompanyName('')).toThrow('Company name cannot be empty')
      expect(() => new CompanyName('   ')).toThrow('Company name cannot be empty')
    })

    it('should throw error for null/undefined company name', () => {
      expect(() => new CompanyName(null as any)).toThrow('Company name must be a string')
      expect(() => new CompanyName(undefined as any)).toThrow('Company name must be a string')
    })

    it('should throw error for too long company name', () => {
      const longName = 'A'.repeat(201)
      expect(() => new CompanyName(longName)).toThrow('Company name cannot exceed 200 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create company name without validation', () => {
      const companyName = new CompanyName('', false)
      expect(companyName.getValue()).toBe('')
    })

    it('should allow manual validation', () => {
      const companyName = new CompanyName('', false)
      expect(() => companyName.validate()).toThrow('Company name cannot be empty')
    })
  })

  describe('static create method', () => {
    it('should create company name with validation by default', () => {
      const companyName = CompanyName.create('Acme Corp')
      expect(companyName.getValue()).toBe('Acme Corp')
    })

    it('should create company name without validation when specified', () => {
      const companyName = CompanyName.create('', false)
      expect(companyName.getValue()).toBe('')
    })
  })

  describe('equals method', () => {
    it('should return true for same company names', () => {
      const companyName1 = new CompanyName('Acme Corp')
      const companyName2 = new CompanyName('Acme Corp')
      expect(companyName1.equals(companyName2)).toBe(true)
    })

    it('should return false for different company names', () => {
      const companyName1 = new CompanyName('Acme Corp')
      const companyName2 = new CompanyName('Tech Inc')
      expect(companyName1.equals(companyName2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return company name as string', () => {
      const companyName = new CompanyName('Acme Corp')
      expect(companyName.toString()).toBe('Acme Corp')
    })
  })

  describe('valid company names', () => {
    const validNames = [
      'Acme Corp',
      'Tech Inc',
      'Global Solutions Ltd',
      'Startup & Co',
      'A'.repeat(200) // Maximum length
    ]

    validNames.forEach(name => {
      it(`should accept valid company name: ${name}`, () => {
        expect(() => new CompanyName(name)).not.toThrow()
      })
    })

    const invalidNames = [
      '',
      '   ',
      'A'.repeat(201), // Too long
      null as any,
      undefined as any
    ]

    invalidNames.forEach(name => {
      it(`should reject invalid company name: ${name}`, () => {
        expect(() => new CompanyName(name)).toThrow()
      })
    })
  })
})
