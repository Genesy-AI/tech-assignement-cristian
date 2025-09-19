import { Lead } from '../Lead'

export function generateMessageFromTemplate(template: string, lead: Lead): string {
  let message = template

  const availableFields = {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    jobTitle: lead.jobTitle,
    companyName: lead.companyName,
    countryCode: lead.countryCode,
  }

  const templateVariables = template.match(/\{(\w+)\}/g) || []

  for (const variable of templateVariables) {
    const fieldName = variable.slice(1, -1)

    if (fieldName in availableFields) {
      const fieldValue = availableFields[fieldName as keyof typeof availableFields]

      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        throw new Error(`Missing required field: ${fieldName}`)
      }

      message = message.replace(new RegExp(`\\{${fieldName}\\}`, 'g'), String(fieldValue))
    } else {
      throw new Error(`Unknown field in template: ${fieldName}`)
    }
  }

  return message
}
