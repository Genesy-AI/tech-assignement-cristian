// Domain exports
export * from './domain/Lead'
export * from './domain/LeadRepository'
export * from './domain/value-objects/Email'
export * from './domain/services/MessageTemplateService'
export * from './domain/services/EmailVerificationService'

// Application exports
export * from './application/usecases/BulkImportLeads'
export * from './application/usecases/GenerateMessages'
export * from './application/usecases/VerifyEmails'

// Infrastructure exports
export * from './infrastructure/prisma/LeadPrismaRepository'
export * from './infrastructure/temporal/TemporalEmailVerificationService'

// Interface exports
export { default as leadsRouter } from './interfaces/http/leads'
