import { EmailVerificationService } from '../../application/leads/ports/EmailVerificationService'
import { Connection, Client } from '@temporalio/client'
import { verifyEmailWorkflow } from '../../workflows'

export class TemporalEmailVerificationService implements EmailVerificationService {
  async verify(email: string): Promise<boolean> {
    const connection = await Connection.connect({ address: 'localhost:7233' })
    const client = new Client({ connection, namespace: 'default' })
    try {
      const result = await client.workflow.execute(verifyEmailWorkflow, {
        taskQueue: 'myQueue',
        workflowId: `verify-email-${email}-${Date.now()}`,
        args: [email],
      })
      return result
    } finally {
      await connection.close()
    }
  }
}
