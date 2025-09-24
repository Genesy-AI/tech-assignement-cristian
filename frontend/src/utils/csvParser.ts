import Papa from 'papaparse'

export interface CsvLead {
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobTitle?: string
  countryCode?: string
  companyName?: string
  companyWebsite?: string
  isValid: boolean
  errors: string[]
  rowIndex: number
}

// Validation functions that match backend value object validation exactly
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false
  if (email.length === 0) return false
  if (email.length > 255) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false
  if (phone.length === 0) return false
  if (phone.length > 20) return false
  
  // Allow international phone formats with +, -, spaces, parentheses, and x for extensions
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.x]+$/
  return phoneRegex.test(phone) && phone.replace(/[\s\-\(\)\.x]/g, '').length >= 7
}

export const isValidFirstName = (firstName: string): boolean => {
  if (!firstName || typeof firstName !== 'string') return false
  if (firstName.length === 0) return false
  if (firstName.length > 100) return false
  return true
}

export const isValidLastName = (lastName: string): boolean => {
  if (!lastName || typeof lastName !== 'string') return false
  if (lastName.length === 0) return false
  if (lastName.length > 100) return false
  return true
}

export const isValidJobTitle = (jobTitle: string): boolean => {
  if (!jobTitle || typeof jobTitle !== 'string') return false
  if (jobTitle.length === 0) return false
  if (jobTitle.length > 200) return false
  return true
}

export const isValidCompanyName = (companyName: string): boolean => {
  if (!companyName || typeof companyName !== 'string') return false
  if (companyName.length === 0) return false
  if (companyName.length > 200) return false
  return true
}

export const isValidCountryCode = (countryCode: string): boolean => {
  if (!countryCode || typeof countryCode !== 'string') return false
  if (countryCode.length === 0) return false
  
  // Valid ISO 3166-1 alpha-2 country codes are exactly 2 uppercase letters
  const countryCodeRegex = /^[A-Z]{2}$/
  return countryCodeRegex.test(countryCode)
}

export const isValidCompanyWebsite = (website: string): boolean => {
  if (!website || typeof website !== 'string') return false
  if (website.length === 0) return false
  if (website.length > 500) return false
  
  try {
    // Add protocol if missing
    const urlWithProtocol = website.startsWith('http') ? website : `https://${website}`
    new URL(urlWithProtocol)
    return true
  } catch {
    return false
  }
}

export const parseCsv = (content: string): CsvLead[] => {
  if (!content?.trim()) {
    throw new Error('CSV content cannot be empty')
  }

  const parseResult = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
    transformHeader: (header) => header.trim().toLowerCase(),
    quoteChar: '"',
  })

  if (parseResult.errors.length > 0) {
    const criticalErrors = parseResult.errors.filter(
      (error) => error.type === 'Delimiter' || error.type === 'Quotes' || error.type === 'FieldMismatch'
    )
    if (criticalErrors.length > 0) {
      throw new Error(`CSV parsing failed: ${criticalErrors[0].message}`)
    }
  }

  if (!parseResult.data || parseResult.data.length === 0) {
    throw new Error('CSV file appears to be empty or contains no valid data')
  }

  const data: CsvLead[] = []

  parseResult.data.forEach((row, index) => {
    if (Object.values(row).every((value) => !value)) return

    const lead: Partial<CsvLead> = { rowIndex: index + 2 }

    Object.entries(row).forEach(([header, value]) => {
      const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '')
      const trimmedValue = value?.trim() || ''

      switch (normalizedHeader) {
        case 'firstname':
          lead.firstName = trimmedValue
          break
        case 'lastname':
          lead.lastName = trimmedValue
          break
        case 'email':
          lead.email = trimmedValue
          break
        case 'jobtitle':
          lead.jobTitle = trimmedValue || undefined
          break
        case 'countrycode':
          lead.countryCode = trimmedValue || undefined
          break
        case 'companyname':
          lead.companyName = trimmedValue || undefined
          break
        case 'phone':
        case 'phonenumber':
        case 'phone_number':
        case 'mobile':
        case 'telephone':
          lead.phone = trimmedValue || undefined
          break
        case 'companywebsite':
        case 'website':
          lead.companyWebsite = trimmedValue || undefined
          break
      }
    })

    const errors: string[] = []
    
    // Validate required fields with exact backend validation rules
    if (!lead.firstName?.trim()) {
      errors.push('First name is required')
    } else if (!isValidFirstName(lead.firstName)) {
      errors.push('First name cannot be empty and cannot exceed 100 characters')
    }
    
    if (!lead.lastName?.trim()) {
      errors.push('Last name is required')
    } else if (!isValidLastName(lead.lastName)) {
      errors.push('Last name cannot be empty and cannot exceed 100 characters')
    }
    
    if (!lead.email?.trim()) {
      errors.push('Email is required')
    } else if (!isValidEmail(lead.email)) {
      errors.push('Invalid email format')
    }
    
    // Validate optional fields if provided
    if (lead.phone && !isValidPhone(lead.phone)) {
      errors.push('Invalid phone format')
    }
    
    if (lead.jobTitle && !isValidJobTitle(lead.jobTitle)) {
      errors.push('Job title cannot be empty and cannot exceed 200 characters')
    }
    
    if (lead.companyName && !isValidCompanyName(lead.companyName)) {
      errors.push('Company name cannot be empty and cannot exceed 200 characters')
    }
    
    if (lead.countryCode && !isValidCountryCode(lead.countryCode)) {
      errors.push('Invalid country code format (must be 2 uppercase letters)')
    }
    
    if (lead.companyWebsite && !isValidCompanyWebsite(lead.companyWebsite)) {
      errors.push('Invalid website URL format')
    }

    data.push({
      ...lead,
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      isValid: errors.length === 0,
      errors,
    } as CsvLead)
  })

  return data
}
