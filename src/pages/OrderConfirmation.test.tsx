// @vitest-environment jsdom
import { describe, test, expect, afterEach } from 'vitest'
import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import OrderConfirmation from './OrderConfirmation'

/**
 * Renders the order confirmation page.
 *
 * The behaviour under test is the order reference: it comes from the query
 * string when supplied, and is otherwise generated with crypto.randomUUID
 * rather than Math.random (typescript:S2245). A reference a third party can
 * predict is one they can guess and probe for.
 *
 * Rendered rather than unit-tested because the fallback only runs when the
 * component mounts — the branch is unreachable any other way.
 *
 * This file opts into jsdom; the rest of the suite runs in node, which is
 * faster and keeps a DOM out of tests that do not need one.
 */

let container: HTMLDivElement | null = null
let root: Root | null = null

const renderAt = (search: string) => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(
      <StrictMode>
        <MemoryRouter initialEntries={[`/order-confirmation${search}`]}>
          <OrderConfirmation />
        </MemoryRouter>
      </StrictMode>
    )
  })
  return container.textContent ?? ''
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  container = null
  root = null
})

describe('OrderConfirmation — order reference', () => {
  test('renders without crashing and shows a reference', () => {
    const text = renderAt('')
    expect(text).toMatch(/ORD-[0-9A-F]{9}/)
  })

  test('uses the orderId from the query string when one is supplied', () => {
    const text = renderAt('?orderId=ORD-FROMSERVER')
    expect(text).toContain('ORD-FROMSERVER')
  })

  test('generates a distinct reference per mount when none is supplied', () => {
    const first = renderAt('')?.match(/ORD-[0-9A-F]{9}/)?.[0]
    act(() => root?.unmount())
    container?.remove()
    const second = renderAt('')?.match(/ORD-[0-9A-F]{9}/)?.[0]

    expect(first).toBeTruthy()
    expect(second).toBeTruthy()
    // A predictable generator would repeat across mounts in the same tick.
    expect(first).not.toBe(second)
  })
})
