import { getPrismaClient } from '../../../infrastructure/prisma/PrismaClient'
import { Lead } from '../../domain/Lead'
import { LeadRepository } from '../../domain/LeadRepository'

export class LeadPrismaRepository implements LeadRepository {
  private readonly prisma = getPrismaClient()

  async create(lead: Lead): Promise<Lead> {
    const persistenceData = lead.toPersistence()
    const createdLead = await this.prisma.lead.create({
      data: {
        firstName: persistenceData.firstName,
        lastName: persistenceData.lastName,
        email: persistenceData.email,
        phone: persistenceData.phone,
        jobTitle: persistenceData.jobTitle,
        countryCode: persistenceData.countryCode,
        companyName: persistenceData.companyName,
        companyWebsite: persistenceData.companyWebsite,
        message: persistenceData.message,
        emailVerified: persistenceData.emailVerified,
      },
    })
    return Lead.fromPersistence(createdLead)
  }

  async findById(id: number): Promise<Lead | null> {
    const lead = await this.prisma.lead.findUnique({ where: { id } })
    return lead ? Lead.fromPersistenceLenient(lead) : null
  }

  async findAll(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany()
    return leads.map(lead => Lead.fromPersistenceLenient(lead))
  }

  async update(id: number, lead: Lead): Promise<Lead> {
    const persistenceData = lead.toPersistence()
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        firstName: persistenceData.firstName,
        lastName: persistenceData.lastName,
        email: persistenceData.email,
        phone: persistenceData.phone,
        jobTitle: persistenceData.jobTitle,
        countryCode: persistenceData.countryCode,
        companyName: persistenceData.companyName,
        companyWebsite: persistenceData.companyWebsite,
        message: persistenceData.message,
        emailVerified: persistenceData.emailVerified,
      },
    })
    return Lead.fromPersistence(updatedLead)
  }

  async updatePhone(id: number, phone: string): Promise<Lead> {
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { phone },
    })
    return Lead.fromPersistenceLenient(updatedLead)
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lead.delete({ where: { id } })
  }

  async deleteMany(ids: number[]): Promise<number> {
    const res = await this.prisma.lead.deleteMany({ where: { id: { in: ids } } })
    return res.count
  }

  async findManyByIds(ids: number[]): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany({ where: { id: { in: ids } } })
    return leads.map(lead => Lead.fromPersistenceLenient(lead))
  }

  async findByFirstAndLast(firstName: string, lastName: string): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany({ where: { AND: [{ firstName }, { lastName }] } })
    return leads.map(lead => Lead.fromPersistenceLenient(lead))
  }
}
