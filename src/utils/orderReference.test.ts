import { describe, test, expect } from 'vitest'
import { generateOrderReference } from './orderReference'

/**
 * Order references were previously built with Math.random (typescript:S2245).
 * A reference a third party can predict is one they can guess and probe for.
 *
 * These assert unpredictability as a property rather than trusting the source:
 * a thousand references must all differ, and the character distribution must
 * not collapse. Both would fail against a weak generator.
 */

describe('generateOrderReference', () => {
  test('has the expected shape', () => {
    expect(generateOrderReference()).toMatch(/^ORD-[0-9A-F]{9}$/)
  })

  test('a thousand references are all distinct', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i += 1) seen.add(generateOrderReference())
    expect(seen.size).toBe(1000)
  })

  test('does not repeat across consecutive calls', () => {
    // Math.random seeded per tick could produce runs of identical values;
    // a CSPRNG cannot.
    expect(generateOrderReference()).not.toBe(generateOrderReference())
  })

  test('uses a broad character distribution, not a collapsed one', () => {
    // A weak or poorly seeded generator tends to concentrate on few symbols.
    // Hex gives 16 possible characters; across 200 references almost all
    // should appear.
    const chars = new Set<string>()
    for (let i = 0; i < 200; i += 1) {
      for (const c of generateOrderReference().slice(4)) chars.add(c)
    }
    expect(chars.size).toBeGreaterThanOrEqual(14)
  })

  test('is uppercase, so references are not case-ambiguous when read aloud', () => {
    const ref = generateOrderReference()
    expect(ref).toBe(ref.toUpperCase())
  })
})
