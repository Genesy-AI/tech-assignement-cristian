export type LeadsUpdateInput = {
  id: number
  firstName: string
  email: string
}

export type LeadsUpdateOutput = {
  id: number
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string | null
  email: string | null
  phone: string | null
  jobTitle: string | null
  countryCode: string | null
  companyName: string | null
  companyWebsite: string | null
  message: string | null
  emailVerified: boolean | null
}
