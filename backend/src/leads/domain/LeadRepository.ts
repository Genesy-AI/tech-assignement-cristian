import { Lead } from './Lead'

export interface LeadRepository {
  create(lead: Lead): Promise<Lead>
  findById(id: number): Promise<Lead | null>
  findAll(): Promise<Lead[]>
  update(id: number, lead: Lead): Promise<Lead>
  updatePhone(id: number, phone: string): Promise<Lead>
  delete(id: number): Promise<void>
  deleteMany(ids: number[]): Promise<number>
  findManyByIds(ids: number[]): Promise<Lead[]>
  findByFirstAndLast(firstName: string, lastName: string): Promise<Lead[]>
}
