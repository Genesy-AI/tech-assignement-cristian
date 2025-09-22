import { Prisma } from '@prisma/client'
import { getPrismaClient } from '../../../infrastructure/prisma/PrismaClient'
import { CreateLeadInput, Lead, UpdateLeadInput } from '../../domain/Lead'
import { LeadRepository } from '../../domain/LeadRepository'

export class LeadPrismaRepository implements LeadRepository {
  private readonly prisma = getPrismaClient()

  async create(input: CreateLeadInput): Promise<Lead> {
    const lead = await this.prisma.lead.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone ?? null,
        jobTitle: input.jobTitle ?? null,
        countryCode: input.countryCode ?? null,
        companyName: input.companyName ?? null,
      },
    })
    return lead
  }

  async findById(id: number): Promise<Lead | null> {
    return this.prisma.lead.findUnique({ where: { id } })
  }

  async findAll(): Promise<Lead[]> {
    return this.prisma.lead.findMany()
  }

  async update(id: number, input: UpdateLeadInput): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        jobTitle: input.jobTitle,
        countryCode: input.countryCode,
        companyName: input.companyName,
        message: input.message,
        emailVerified: input.emailVerified,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lead.delete({ where: { id } })
  }

  async deleteMany(ids: number[]): Promise<number> {
    const res = await this.prisma.lead.deleteMany({ where: { id: { in: ids } } })
    return res.count
  }

  async findManyByIds(ids: number[]): Promise<Lead[]> {
    return this.prisma.lead.findMany({ where: { id: { in: ids } } })
  }

  async findByFirstAndLast(firstName: string, lastName: string): Promise<Lead[]> {
    return this.prisma.lead.findMany({ where: { AND: [{ firstName }, { lastName }] } })
  }
}
