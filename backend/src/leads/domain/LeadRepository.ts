import { CreateLeadInput, Lead, UpdateLeadInput } from './Lead'

export interface LeadRepository {
  create(input: CreateLeadInput): Promise<Lead>
  findById(id: number): Promise<Lead | null>
  findAll(): Promise<Lead[]>
  update(id: number, input: UpdateLeadInput): Promise<Lead>
  delete(id: number): Promise<void>
  deleteMany(ids: number[]): Promise<number>
  findManyByIds(ids: number[]): Promise<Lead[]>
  findByFirstAndLast(firstName: string, lastName: string): Promise<Lead[]>
}
