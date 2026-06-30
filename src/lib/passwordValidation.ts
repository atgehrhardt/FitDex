const MIN_LENGTH = 8
const MAX_LENGTH = 72

export interface PasswordValidation {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []

  if (password.length < MIN_LENGTH) {
    errors.push(`At least ${MIN_LENGTH} characters`)
  }
  if (password.length > MAX_LENGTH) {
    errors.push(`No more than ${MAX_LENGTH} characters`)
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number')
  }

  return { valid: errors.length === 0, errors }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateDisplayName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 32
}
