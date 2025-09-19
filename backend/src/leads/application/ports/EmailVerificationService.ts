export interface EmailVerificationService {
  verify(email: string): Promise<boolean>
}
