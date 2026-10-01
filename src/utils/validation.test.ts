import { describe, test, expect } from 'vitest'
import { validateRegistration, validateLogin, getFieldError } from './validation'

/**
 * These assert security-relevant properties of the client validators, not just
 * that they return errors. See docs/evidence/finding-ledger.md.
 *
 * The email pattern previously nested quantifiers — `([.-]?\w+)*` — which
 * backtracks catastrophically on a crafted address (typescript:S5852). Because
 * validation runs on the UI thread, a pasted value could hang the tab.
 */

const validRegistration = {
  name: 'Immanuel',
  email: 'shopper@example.com',
  password: 'Password123',
  confirmPassword: 'Password123'
}

const errorFields = (errors: { field: string }[]) => errors.map((e) => e.field)

describe('email pattern — ReDoS resistance (typescript:S5852)', () => {
  test('a catastrophic-backtracking input returns immediately', () => {
    // Against the old pattern this input took exponential time. The replacement
    // is linear, so a generous bound still fails loudly if it regresses.
    const hostile = 'a'.repeat(50000) + '!'
    const started = Date.now()
    validateRegistration({ ...validRegistration, email: hostile })
    expect(Date.now() - started).toBeLessThan(1000)
  })

  test('a long input with no "@" returns immediately', () => {
    const started = Date.now()
    validateLogin('x'.repeat(100000), 'Password123')
    expect(Date.now() - started).toBeLessThan(1000)
  })

  test('still accepts ordinary addresses', () => {
    for (const email of ['a@b.co', 'first.last@sub.example.com', 'user+tag@example.org']) {
      const errors = validateRegistration({ ...validRegistration, email })
      expect(errorFields(errors)).not.toContain('email')
    }
  })

  test('still rejects malformed addresses', () => {
    for (const email of ['no-at-sign', 'two@at@signs', 'spaces in@example.com', '@example.com']) {
      const errors = validateRegistration({ ...validRegistration, email })
      expect(errorFields(errors)).toContain('email')
    }
  })
})

describe('validateRegistration', () => {
  test('accepts a well-formed registration', () => {
    expect(validateRegistration(validRegistration)).toHaveLength(0)
  })

  test('requires a name, and rejects whitespace-only', () => {
    expect(errorFields(validateRegistration({ ...validRegistration, name: '' }))).toContain('name')
    expect(errorFields(validateRegistration({ ...validRegistration, name: '   ' }))).toContain('name')
  })

  test('bounds the name at both ends', () => {
    expect(errorFields(validateRegistration({ ...validRegistration, name: 'a' }))).toContain('name')
    expect(
      errorFields(validateRegistration({ ...validRegistration, name: 'a'.repeat(51) }))
    ).toContain('name')
  })

  test('enforces a minimum password length', () => {
    expect(
      errorFields(validateRegistration({ ...validRegistration, password: 'short', confirmPassword: 'short' }))
    ).toContain('password')
  })

  test('bounds password length, so an over-long value cannot be submitted', () => {
    const long = 'a'.repeat(129)
    expect(
      errorFields(validateRegistration({ ...validRegistration, password: long, confirmPassword: long }))
    ).toContain('password')
  })

  test('requires the confirmation to match', () => {
    expect(
      errorFields(validateRegistration({ ...validRegistration, confirmPassword: 'Different123' }))
    ).toContain('confirmPassword')
  })

  test('rejects a role outside the allowed set — client-side mass assignment', () => {
    // The server is authoritative, but the client should not offer to submit a
    // privileged role in the first place.
    const errors = validateRegistration({ ...validRegistration, role: 'admin' })
    expect(errorFields(errors)).toContain('role')
  })

  test('accepts the two legitimate roles', () => {
    for (const role of ['customer', 'vendor']) {
      expect(errorFields(validateRegistration({ ...validRegistration, role }))).not.toContain('role')
    }
  })
})

describe('validateLogin', () => {
  test('accepts valid credentials', () => {
    expect(validateLogin('shopper@example.com', 'Password123')).toHaveLength(0)
  })

  test('requires both fields', () => {
    expect(errorFields(validateLogin('', 'Password123'))).toContain('email')
    expect(errorFields(validateLogin('shopper@example.com', ''))).toContain('password')
  })

  test('rejects a malformed email', () => {
    expect(errorFields(validateLogin('not-an-email', 'Password123'))).toContain('email')
  })
})

describe('getFieldError', () => {
  test('returns the message for a field with an error', () => {
    const errors = validateLogin('', 'Password123')
    expect(getFieldError(errors, 'email')).toBeTruthy()
  })

  test('returns undefined for a field without one', () => {
    const errors = validateLogin('', 'Password123')
    expect(getFieldError(errors, 'password')).toBeUndefined()
  })
})
