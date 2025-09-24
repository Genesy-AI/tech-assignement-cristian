import {
  FirstName,
  LastName,
  Email,
  Phone,
  JobTitle,
  CountryCode,
  CompanyName,
  CompanyWebsite,
  Message
} from './value-objects'

export class Lead {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _firstName: FirstName,
    private readonly _lastName: LastName,
    private readonly _email: Email,
    private readonly _phone: Phone | null,
    private readonly _jobTitle: JobTitle | null,
    private readonly _countryCode: CountryCode | null,
    private readonly _companyName: CompanyName | null,
    private readonly _companyWebsite: CompanyWebsite | null,
    private readonly _message: Message | null,
    private readonly _emailVerified: boolean | null,
    private readonly _createdAt: Date | undefined = undefined,
    private readonly _updatedAt: Date | undefined = undefined
  ) {}

  static create(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    jobTitle?: string | null
    countryCode?: string | null
    companyName?: string | null
    companyWebsite?: string | null
    message?: string | null
    emailVerified?: boolean | null
  }): Lead {
    const firstName = new FirstName(data.firstName)
    const lastName = new LastName(data.lastName)
    const email = new Email(data.email)
    const phone = data.phone ? new Phone(data.phone) : null
    const jobTitle = data.jobTitle ? new JobTitle(data.jobTitle) : null
    const countryCode = data.countryCode ? new CountryCode(data.countryCode) : null
    const companyName = data.companyName ? new CompanyName(data.companyName) : null
    const companyWebsite = data.companyWebsite ? new CompanyWebsite(data.companyWebsite) : null
    const message = data.message ? new Message(data.message) : null

    return new Lead(
      undefined,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      countryCode,
      companyName,
      companyWebsite,
      message,
      data.emailVerified || null
    )
  }

  static fromPersistence(data: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string | null
    jobTitle: string | null
    countryCode: string | null
    companyName: string | null
    companyWebsite: string | null
    message: string | null
    emailVerified: boolean | null
    createdAt: Date
    updatedAt: Date
  }): Lead {
    const firstName = new FirstName(data.firstName)
    const lastName = new LastName(data.lastName)
    const email = new Email(data.email)
    const phone = data.phone ? new Phone(data.phone) : null
    const jobTitle = data.jobTitle ? new JobTitle(data.jobTitle) : null
    const countryCode = data.countryCode ? new CountryCode(data.countryCode) : null
    const companyName = data.companyName ? new CompanyName(data.companyName) : null
    const companyWebsite = data.companyWebsite ? new CompanyWebsite(data.companyWebsite) : null
    const message = data.message ? new Message(data.message) : null

    return new Lead(
      data.id,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      countryCode,
      companyName,
      companyWebsite,
      message,
      data.emailVerified,
      data.createdAt,
      data.updatedAt
    )
  }

  static fromPersistenceLenient(data: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string | null
    jobTitle: string | null
    countryCode: string | null
    companyName: string | null
    companyWebsite: string | null
    message: string | null
    emailVerified: boolean | null
    createdAt: Date
    updatedAt: Date
  }): Lead {
    // Create value objects without validation for existing data
    const firstName = new FirstName(data.firstName, false)
    const lastName = new LastName(data.lastName, false)
    const email = new Email(data.email, false)
    
    // For optional fields, create without validation
    const phone = data.phone ? new Phone(data.phone, false) : null
    const jobTitle = data.jobTitle ? new JobTitle(data.jobTitle, false) : null
    const countryCode = data.countryCode ? new CountryCode(data.countryCode, false) : null
    const companyName = data.companyName ? new CompanyName(data.companyName, false) : null
    const companyWebsite = data.companyWebsite ? new CompanyWebsite(data.companyWebsite, false) : null
    const message = data.message ? new Message(data.message, false) : null

    return new Lead(
      data.id,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      countryCode,
      companyName,
      companyWebsite,
      message,
      data.emailVerified,
      data.createdAt,
      data.updatedAt
    )
  }

  // Getters
  get id(): number | undefined {
    return this._id
  }

  get firstName(): FirstName {
    return this._firstName
  }

  get lastName(): LastName {
    return this._lastName
  }

  get email(): Email {
    return this._email
  }

  get phone(): Phone | null {
    return this._phone
  }
  

  get jobTitle(): JobTitle | null {
    return this._jobTitle
  }

  get countryCode(): CountryCode | null {
    return this._countryCode
  }

  get companyName(): CompanyName | null {
    return this._companyName
  }

  get companyWebsite(): CompanyWebsite | null {
    return this._companyWebsite
  }

  get message(): Message | null {
    return this._message
  }

  get emailVerified(): boolean | null {
    return this._emailVerified
  }

  get createdAt(): Date | undefined {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  // Business methods
  updateMessage(message: string): Lead {
    const newMessage = new Message(message)
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      this._jobTitle,
      this._countryCode,
      this._companyName,
      this._companyWebsite,
      newMessage,
      this._emailVerified,
      this._createdAt
    )
  }

  markEmailAsVerified(): Lead {
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      this._jobTitle,
      this._countryCode,
      this._companyName,
      this._companyWebsite,
      this._message,
      true,
      this._createdAt
    )
  }

  markEmailAsUnverified(): Lead {
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      this._jobTitle,
      this._countryCode,
      this._companyName,
      this._companyWebsite,
      this._message,
      false,
      this._createdAt
    )
  }

  updatePhone(phone: string): Lead {
    const newPhone = new Phone(phone)
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      newPhone,
      this._jobTitle,
      this._countryCode,
      this._companyName,
      this._companyWebsite,
      this._message,
      this._emailVerified,
      this._createdAt
    )
  }

  updateJobTitle(jobTitle: string): Lead {
    const newJobTitle = new JobTitle(jobTitle)
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      newJobTitle,
      this._countryCode,
      this._companyName,
      this._companyWebsite,
      this._message,
      this._emailVerified,
      this._createdAt
    )
  }

  updateCompanyName(companyName: string): Lead {
    const newCompanyName = new CompanyName(companyName)
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      this._jobTitle,
      this._countryCode,
      newCompanyName,
      this._companyWebsite,
      this._message,
      this._emailVerified,
      this._createdAt
    )
  }

  updateCompanyWebsite(companyWebsite: string): Lead {
    const newCompanyWebsite = new CompanyWebsite(companyWebsite)
    return new Lead(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._phone,
      this._jobTitle,
      this._countryCode,
      this._companyName,
      newCompanyWebsite,
      this._message,
      this._emailVerified,
      this._createdAt
    )
  }

  // Persistence mapping
  toPersistence(): {
    id?: number
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    jobTitle: string | null
    countryCode: string | null
    companyName: string | null
    companyWebsite: string | null
    message: string | null
    emailVerified: boolean | null
    createdAt?: Date
    updatedAt?: Date
  } {
    return {
      id: this._id,
      firstName: this._firstName.getValue(),
      lastName: this._lastName.getValue(),
      email: this._email.getValue(),
      phone: this._phone?.getValue() || null,
      jobTitle: this._jobTitle?.getValue() || null,
      countryCode: this._countryCode?.getValue() || null,
      companyName: this._companyName?.getValue() || null,
      companyWebsite: this._companyWebsite?.getValue() || null,
      message: this._message?.getValue() || null,
      emailVerified: this._emailVerified,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    }
  }

  // Equality
  equals(other: Lead): boolean {
    return this._id === other._id
  }
}

