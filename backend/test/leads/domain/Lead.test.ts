import { describe, it, expect } from 'vitest'
import { Lead } from '../../../src/leads'


describe('Lead Domain Entity', () => {
  describe('Lead.create', () => {
    it('should create a valid lead with required fields', () => {
      const lead = Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })

      expect(lead.firstName.getValue()).toBe('John')
      expect(lead.lastName.getValue()).toBe('Doe')
      expect(lead.email.getValue()).toBe('john@example.com')
      expect(lead.phone).toBeNull()
      expect(lead.jobTitle).toBeNull()
      expect(lead.countryCode).toBeNull()
      expect(lead.companyName).toBeNull()
      expect(lead.companyWebsite).toBeNull()
      expect(lead.message).toBeNull()
      expect(lead.emailVerified).toBeNull()
    })

    it('should create a lead with all optional fields', () => {
      const lead = Lead.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        jobTitle: 'Software Engineer',
        countryCode: 'US',
        companyName: 'Tech Corp',
        companyWebsite: 'techcorp.com',
        message: 'Hello, interested in your services',
        emailVerified: true
      })

      expect(lead.firstName.getValue()).toBe('Jane')
      expect(lead.lastName.getValue()).toBe('Smith')
      expect(lead.email.getValue()).toBe('jane@example.com')
      expect(lead.phone?.getValue()).toBe('+1234567890')
      expect(lead.jobTitle?.getValue()).toBe('Software Engineer')
      expect(lead.countryCode?.getValue()).toBe('US')
      expect(lead.companyName?.getValue()).toBe('Tech Corp')
      expect(lead.companyWebsite?.getValue()).toBe('techcorp.com')
      expect(lead.message?.getValue()).toBe('Hello, interested in your services')
      expect(lead.emailVerified).toBe(true)
    })

    it('should throw error for invalid required fields', () => {
      expect(() => Lead.create({
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com'
      })).toThrow('First name cannot be empty')

      expect(() => Lead.create({
        firstName: 'John',
        lastName: '',
        email: 'john@example.com'
      })).toThrow('Last name cannot be empty')

      expect(() => Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email'
      })).toThrow('Invalid email format')
    })

    it('should throw error for invalid optional fields', () => {
      expect(() => Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: 'invalid-phone'
      })).toThrow('Invalid phone format')

      expect(() => Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        countryCode: 'INVALID'
      })).toThrow('Invalid country code format (must be 2 uppercase letters)')
    })
  })

  describe('Lead.fromPersistence', () => {
    it('should create lead from persistence data', () => {
      const persistenceData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        jobTitle: 'Software Engineer',
        countryCode: 'US',
        companyName: 'Tech Corp',
        companyWebsite: 'techcorp.com',
        message: 'Hello',
        emailVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      const lead = Lead.fromPersistence(persistenceData)

      expect(lead.id).toBe(1)
      expect(lead.firstName.getValue()).toBe('John')
      expect(lead.lastName.getValue()).toBe('Doe')
      expect(lead.email.getValue()).toBe('john@example.com')
      expect(lead.phone?.getValue()).toBe('+1234567890')
      expect(lead.jobTitle?.getValue()).toBe('Software Engineer')
      expect(lead.countryCode?.getValue()).toBe('US')
      expect(lead.companyName?.getValue()).toBe('Tech Corp')
      expect(lead.companyWebsite?.getValue()).toBe('techcorp.com')
      expect(lead.message?.getValue()).toBe('Hello')
      expect(lead.emailVerified).toBe(true)
      expect(lead.createdAt).toEqual(new Date('2023-01-01'))
      expect(lead.updatedAt).toEqual(new Date('2023-01-02'))
    })
  })

  describe('Lead.fromPersistenceLenient', () => {
    it('should create lead from persistence data without validation', () => {
      const persistenceData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email', // Invalid but should not throw
        phone: 'invalid-phone', // Invalid but should not throw
        jobTitle: 'Software Engineer',
        countryCode: 'INVALID', // Invalid but should not throw
        companyName: 'Tech Corp',
        companyWebsite: 'invalid-website', // Invalid but should not throw
        message: 'Hello',
        emailVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      const lead = Lead.fromPersistenceLenient(persistenceData)

      expect(lead.id).toBe(1)
      expect(lead.firstName.getValue()).toBe('John')
      expect(lead.lastName.getValue()).toBe('Doe')
      expect(lead.email.getValue()).toBe('invalid-email') // Should not validate
      expect(lead.phone?.getValue()).toBe('invalid-phone') // Should not validate
      expect(lead.jobTitle?.getValue()).toBe('Software Engineer')
      expect(lead.countryCode?.getValue()).toBe('INVALID') // Should not validate
      expect(lead.companyName?.getValue()).toBe('Tech Corp')
      expect(lead.companyWebsite?.getValue()).toBe('invalid-website') // Should not validate
      expect(lead.message?.getValue()).toBe('Hello')
      expect(lead.emailVerified).toBe(true)
    })
  })

  

  describe('Lead.toPersistence', () => {
    it('should convert lead to persistence format', () => {
      const lead = Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        jobTitle: 'Software Engineer',
        countryCode: 'US',
        companyName: 'Tech Corp',
        companyWebsite: 'techcorp.com',
        message: 'Hello',
        emailVerified: true
      })

      const persistence = lead.toPersistence()

      expect(persistence.firstName).toBe('John')
      expect(persistence.lastName).toBe('Doe')
      expect(persistence.email).toBe('john@example.com')
      expect(persistence.phone).toBe('+1234567890')
      expect(persistence.jobTitle).toBe('Software Engineer')
      expect(persistence.countryCode).toBe('US')
      expect(persistence.companyName).toBe('Tech Corp')
      expect(persistence.companyWebsite).toBe('techcorp.com')
      expect(persistence.message).toBe('Hello')
      expect(persistence.emailVerified).toBe(true)
    })
  })

  describe('Lead.equals', () => {
    it('should return true for same leads', () => {
      const lead1 = Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })

      const lead2 = Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })

      expect(lead1.equals(lead2)).toBe(true) // Same data, same ID (undefined)
    })

    it('should return true for leads with same undefined ID', () => {
      const lead1 = Lead.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })

      const lead2 = Lead.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      })

      // Both leads have undefined ID, so they're considered equal
      expect(lead1.equals(lead2)).toBe(true)
    })
  })
})
