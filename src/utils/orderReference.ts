/**
 * Generates a customer-facing order reference.
 *
 * Uses crypto.randomUUID rather than Math.random (typescript:S2245). An order
 * reference a third party can predict is one they can guess and probe for, and
 * Math.random is not a cryptographically secure source.
 *
 * This is a display reference only — the authoritative order id is assigned by
 * the API. It exists so the UI has something to show before the server
 * responds.
 */
export function generateOrderReference(): string {
  return `ORD-${crypto.randomUUID().replace(/-/g, '').slice(0, 9).toUpperCase()}`
}
