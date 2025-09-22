export interface Lead {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  jobTitle?: string | null
  countryCode?: string | null
  companyName?: string | null
  message?: string | null
  emailVerified?: boolean | null
}

export type CreateLeadInput = Pick<Lead, 'firstName' | 'lastName' | 'email'> &
  Partial<Pick<Lead, 'phone' | 'jobTitle' | 'countryCode' | 'companyName'>>

export type UpdateLeadInput = Partial<
  Pick<Lead, 'firstName' | 'lastName' | 'email' | 'phone' | 'jobTitle' | 'countryCode' | 'companyName' | 'message' | 'emailVerified'>
>
