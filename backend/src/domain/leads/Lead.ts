export interface Lead {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  firstName: string
  lastName: string
  email: string
  jobTitle?: string | null
  countryCode?: string | null
  companyName?: string | null
  message?: string | null
  emailVerified?: boolean | null
}

export type CreateLeadInput = Pick<Lead, 'firstName' | 'lastName' | 'email'> &
  Partial<Pick<Lead, 'jobTitle' | 'countryCode' | 'companyName'>>

export type UpdateLeadInput = Partial<
  Pick<Lead, 'firstName' | 'lastName' | 'email' | 'jobTitle' | 'countryCode' | 'companyName' | 'message' | 'emailVerified'>
>
