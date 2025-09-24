import { Router } from 'express'
import { createLead } from './controllers/CreateLeadController'
import { getLead } from './controllers/GetLeadController'
import { listLeads } from './controllers/ListLeadsController'
import { updateLead } from './controllers/UpdateLeadController'
import { deleteLead } from './controllers/DeleteLeadController'
import { deleteLeads } from './controllers/DeleteLeadsController'
import { generateMessages } from './controllers/GenerateMessagesController'
import { bulkImportLeads } from './controllers/BulkImportLeadsController'
import { verifyEmails } from './controllers/VerifyEmailsController'
import { enrichPhone } from './controllers/EnrichPhoneController'

const router = Router()

router.post('/leads', createLead)

router.get('/leads/:id', getLead)

router.get('/leads', listLeads)

router.patch('/leads/:id', updateLead)

router.delete('/leads/:id', deleteLead)

router.delete('/leads', deleteLeads)

router.post('/leads/generate-messages', generateMessages)

router.post('/leads/bulk', bulkImportLeads)

router.post('/leads/verify-emails', verifyEmails)

router.post('/leads/enrich-phone', enrichPhone)

export default router
