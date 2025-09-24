import { describe, it, expect } from 'vitest'
import { JobTitle } from '../../../../src/leads/domain/value-objects/JobTitle'

describe('JobTitle Value Object', () => {
  describe('constructor with validation', () => {
    it('should create valid job title', () => {
      const jobTitle = new JobTitle('Software Engineer')
      expect(jobTitle.getValue()).toBe('Software Engineer')
    })

    it('should trim whitespace', () => {
      const jobTitle = new JobTitle('  Software Engineer  ')
      expect(jobTitle.getValue()).toBe('Software Engineer')
    })

    it('should throw error for empty job title', () => {
      expect(() => new JobTitle('')).toThrow('Job title cannot be empty')
      expect(() => new JobTitle('   ')).toThrow('Job title cannot be empty')
    })

    it('should throw error for null/undefined job title', () => {
      expect(() => new JobTitle(null as any)).toThrow('Job title cannot be empty')
      expect(() => new JobTitle(undefined as any)).toThrow('Job title cannot be empty')
    })

    it('should throw error for too long job title', () => {
      const longTitle = 'A'.repeat(201)
      expect(() => new JobTitle(longTitle)).toThrow('Job title cannot exceed 200 characters')
    })
  })

  describe('constructor without validation', () => {
    it('should create job title without validation', () => {
      const jobTitle = new JobTitle('', false)
      expect(jobTitle.getValue()).toBe('')
    })

    it('should allow manual validation', () => {
      const jobTitle = new JobTitle('', false)
      expect(() => jobTitle.validate()).toThrow('Job title cannot be empty')
    })
  })

  describe('static create method', () => {
    it('should create job title with validation by default', () => {
      const jobTitle = JobTitle.create('Software Engineer')
      expect(jobTitle.getValue()).toBe('Software Engineer')
    })

    it('should create job title without validation when specified', () => {
      const jobTitle = JobTitle.create('', false)
      expect(jobTitle.getValue()).toBe('')
    })
  })

  describe('equals method', () => {
    it('should return true for same job titles', () => {
      const jobTitle1 = new JobTitle('Software Engineer')
      const jobTitle2 = new JobTitle('Software Engineer')
      expect(jobTitle1.equals(jobTitle2)).toBe(true)
    })

    it('should return false for different job titles', () => {
      const jobTitle1 = new JobTitle('Software Engineer')
      const jobTitle2 = new JobTitle('Product Manager')
      expect(jobTitle1.equals(jobTitle2)).toBe(false)
    })
  })

  describe('toString method', () => {
    it('should return job title as string', () => {
      const jobTitle = new JobTitle('Software Engineer')
      expect(jobTitle.toString()).toBe('Software Engineer')
    })
  })

  describe('valid job titles', () => {
    const validTitles = [
      'Software Engineer',
      'Product Manager',
      'CEO',
      'Marketing Director',
      'Data Scientist',
      'UX Designer',
      'A'.repeat(200) // Maximum length
    ]

    validTitles.forEach(title => {
      it(`should accept valid job title: ${title}`, () => {
        expect(() => new JobTitle(title)).not.toThrow()
      })
    })

    const invalidTitles = [
      '',
      '   ',
      'A'.repeat(201), // Too long
      null as any,
      undefined as any
    ]

    invalidTitles.forEach(title => {
      it(`should reject invalid job title: ${title}`, () => {
        expect(() => new JobTitle(title)).toThrow()
      })
    })
  })
})
