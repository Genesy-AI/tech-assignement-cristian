import { describe, it, expect } from 'vitest'
import { generateMessageFromTemplate } from '../../src/leads/domain/services/MessageTemplateService'
import { Lead } from '../../src/leads/domain/Lead'

describe('generateMessageFromTemplate', () => {
  const fullLead: Lead = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    jobTitle: 'Software Engineer',
    companyName: 'Tech Corp',
    countryCode: 'US',
  }

  const partialLead: Lead = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    jobTitle: undefined,
    companyName: '',
    countryCode: 'CA',
  }

  const minimalLead: Lead = {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
  }

  describe('successful message generation', () => {
    it('should replace single field in template', () => {
      const template = 'Hello {firstName}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello John!')
    })

    it('should replace multiple different fields in template', () => {
      const template = 'Hi {firstName} {lastName}, welcome to {companyName}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hi John Doe, welcome to Tech Corp!')
    })

    it('should replace the same field multiple times', () => {
      const template = 'Hello {firstName}, how are you {firstName}?'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello John, how are you John?')
    })

    it('should handle template with all available fields', () => {
      const template =
        'Name: {firstName} {lastName}, Email: {email}, Job: {jobTitle} at {companyName}, Country: {countryCode}'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe(
        'Name: John Doe, Email: john.doe@example.com, Job: Software Engineer at Tech Corp, Country: US'
      )
    })

    it('should handle template with no field placeholders', () => {
      const template = 'This is a static message with no placeholders.'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('This is a static message with no placeholders.')
    })

    it('should handle empty template', () => {
      const template = ''
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('')
    })

    it('should handle complex message template', () => {
      const template =
        'Dear {firstName},\n\nI hope this message finds you well. I noticed you work at {companyName} as a {jobTitle}. I would love to connect with you.\n\nBest regards!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe(
        'Dear John,\n\nI hope this message finds you well. I noticed you work at Tech Corp as a Software Engineer. I would love to connect with you.\n\nBest regards!'
      )
    })
  })

  describe('error handling for missing fields', () => {
    it('should throw error when field is null', () => {
      const leadWithNullField: Lead = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        jobTitle: null,
      }
      const template = 'Your job title is {jobTitle}'
      expect(() => generateMessageFromTemplate(template, leadWithNullField)).toThrow(
        'Missing required field: jobTitle'
      )
    })

    it('should throw error when field is undefined', () => {
      const template = 'Your job title is {jobTitle}'
      expect(() => generateMessageFromTemplate(template, partialLead)).toThrow(
        'Missing required field: jobTitle'
      )
    })    

    it('should throw error when field does not exist on lead', () => {
      const leadWithMissingField: Lead = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        jobTitle: undefined,
      }
      const template = 'Your job title is {jobTitle}'
      expect(() => generateMessageFromTemplate(template, leadWithMissingField)).toThrow(
        'Missing required field: jobTitle'
      )
    })
  })

  describe('handling of unknown and invalid fields', () => {
    it('should throw error for unknown field in template', () => {
      const template = 'Hello {firstName} {unknownField}!'
      expect(() => generateMessageFromTemplate(template, fullLead)).toThrow(
        'Unknown field in template: unknownField'
      )
    })

    it('should ignore invalid field patterns with hyphens', () => {
      const template = 'Hello {first-name}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello {first-name}!')
    })

    it('should ignore invalid field patterns with spaces', () => {
      const template = 'Hello {first name}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello {first name}!')
    })
  })

  describe('edge cases and malformed templates', () => {
    it('should handle malformed brackets (single opening bracket)', () => {
      const template = 'Hello {firstName'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello {firstName')
    })

    it('should handle malformed brackets (single closing bracket)', () => {
      const template = 'Hello firstName}'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello firstName}')
    })

    it('should ignore empty brackets', () => {
      const template = 'Hello {} {firstName}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello {} John!')
    })

    it('should handle nested brackets', () => {
      const template = 'Hello {{firstName}}!'
      const result = generateMessageFromTemplate(template, fullLead)
      expect(result).toBe('Hello {John}!')
    })

    it('should handle brackets with numbers', () => {
      const template = 'Hello {firstName123}!'
      expect(() => generateMessageFromTemplate(template, fullLead)).toThrow(
        'Unknown field in template: firstName123'
      )
    })

    it('should handle case sensitivity', () => {
      const template = 'Hello {FirstName}!'
      expect(() => generateMessageFromTemplate(template, fullLead)).toThrow(
        'Unknown field in template: FirstName'
      )
    })
  })

  describe('performance and large templates', () => {
    it('should handle template with many field replacements', () => {
      const template = Array(100).fill('{firstName}').join(' ')
      const result = generateMessageFromTemplate(template, fullLead)
      const expected = Array(100).fill('John').join(' ')
      expect(result).toBe(expected)
    })

    it('should handle very long field values', () => {
      const longLead: Lead = {
        firstName: 'A'.repeat(1000),
        lastName: 'Long',
        email: 'long@example.com',
        companyName: 'B'.repeat(500),
      }
      const template = 'Name: {firstName}, Company: {companyName}'
      const result = generateMessageFromTemplate(template, longLead)
      expect(result).toBe(`Name: ${'A'.repeat(1000)}, Company: ${'B'.repeat(500)}`)
    })
  })

  describe('special characters and encoding', () => {
    it('should handle special characters in field values', () => {
      const specialLead: Lead = {
        firstName: 'José',
        lastName: 'García',
        email: 'josé@café.com',
        companyName: 'Café & Co.',
      }
      const template = 'Hello {firstName} from {companyName}! Email: {email}'
      const result = generateMessageFromTemplate(template, specialLead)
      expect(result).toBe('Hello José from Café & Co.! Email: josé@café.com')
    })

    it('should handle emojis in field values', () => {
      const emojiLead: Lead = {
        firstName: 'John 😊',
        lastName: 'Emoji',
        email: 'john@example.com',
        companyName: 'TechCorp 🚀',
      }
      const template = 'Hi {firstName} from {companyName}!'
      const result = generateMessageFromTemplate(template, emojiLead)
      expect(result).toBe('Hi John 😊 from TechCorp 🚀!')
    })
  })
})
