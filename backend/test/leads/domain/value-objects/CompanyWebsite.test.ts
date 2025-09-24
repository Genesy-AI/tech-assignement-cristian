import { describe, it, expect } from 'vitest'
import { CompanyWebsite } from '../../../../src/leads/domain/value-objects/CompanyWebsite'

describe('CompanyWebsite Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid website', () => {
      const website = new CompanyWebsite('example.com')
      expect(website.getValue()).toBe('example.com')
    })

    it('should normalize URL by removing protocol', () => {
      const website = new CompanyWebsite('https://example.com')
      expect(website.getValue()).toBe('example.com')
    })

    it('should trim whitespace', () => {
      const website = new CompanyWebsite('  example.com  ')
      expect(website.getValue()).toBe('example.com')
    })

    it('should throw error for empty website', () => {
      expect(() => new CompanyWebsite('')).toThrow('Company website cannot be empty')
      expect(() => new CompanyWebsite('   ')).toThrow('Company website cannot be empty')
    })

    it('should throw error for null/undefined website', () => {
      expect(() => new CompanyWebsite(null as any)).toThrow('Company website cannot be empty')
      expect(() => new CompanyWebsite(undefined as any)).toThrow('Company website cannot be empty')
    })

    it('should throw error for too long website', () => {
      const longWebsite = 'a'.repeat(501)
      expect(() => new CompanyWebsite(longWebsite)).toThrow('Company website cannot exceed 500 characters')
    })

    it('should throw error for invalid URL format', () => {
      expect(() => new CompanyWebsite('invalid-url')).toThrow('Invalid website URL format')
      expect(() => new CompanyWebsite('not-a-url')).toThrow('Invalid website URL format')
    })
  })

  describe('constructor without validation', () => {
    it('should create website without validation', () => {
      const website = new CompanyWebsite('invalid-url', false)
      expect(website.getValue()).toBe('invalid-url')
    })

    it('should allow manual validation', () => {
      const website = new CompanyWebsite('invalid-url', false)
      expect(() => website.validate()).toThrow('Invalid website URL format')
    })
  })

  describe('static create method', () => {
    it('should create website with validation by default', () => {
      const website = CompanyWebsite.create('example.com')
      expect(website.getValue()).toBe('example.com')
    })

    it('should create website without validation when specified', () => {
      const website = CompanyWebsite.create('invalid-url', false)
      expect(website.getValue()).toBe('invalid-url')
    })
  })

  describe('getFullUrl method', () => {
    it('should return full URL with https protocol', () => {
      const website = new CompanyWebsite('example.com')
      expect(website.getFullUrl()).toBe('https://example.com')
    })

    it('should return full URL with existing protocol', () => {
      const website = new CompanyWebsite('http://example.com')
      expect(website.getFullUrl()).toBe('https://example.com')
    })
  })

  describe('equals method', () => {
    it('should return true for same websites', () => {
      const website1 = new CompanyWebsite('example.com')
      const website2 = new CompanyWebsite('example.com')
      expect(website1.equals(website2)).toBe(true)
    })

    it('should return false for different websites', () => {
      const website1 = new CompanyWebsite('example.com')
      const website2 = new CompanyWebsite('test.com')
      expect(website1.equals(website2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return website as string', () => {
      const website = new CompanyWebsite('example.com')
      expect(website.toString()).toBe('example.com')
    })
  })

  describe('valid websites', () => {
    const validWebsites = [
      'example.com',
      'www.example.com',
      'subdomain.example.com',
      'example.co.uk',
      'test-site.com',
      'company.org'
    ]

    validWebsites.forEach(website => {
      it(`should accept valid website: ${website}`, () => {
        expect(() => new CompanyWebsite(website)).not.toThrow()
      })
    })

    const invalidWebsites = [
      '',
      '   ',
      'invalid-url',
      'not-a-url',
      'a'.repeat(501), // Too long
      null as any,
      undefined as any
    ]

    invalidWebsites.forEach(website => {
      it(`should reject invalid website: ${website}`, () => {
        expect(() => new CompanyWebsite(website)).toThrow()
      })
    })
  })
})
