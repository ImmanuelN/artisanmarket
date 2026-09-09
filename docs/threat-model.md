# ArtisanMarket Client — Threat Model

**Stage:** Plan (Section 4.3.1) · **Tool:** OWASP Threat Dragon · **Status:** Reviewed

This document is the Plan-stage artifact required before a feature proceeds to Code.
It is exported/summarised from the OWASP Threat Dragon model for the ArtisanMarket
storefront (`artisanmarket`) and covers the core flows: browsing and search, account
registration and login, cart and checkout, vendor dashboards, and product reviews.

## System under review

- **Runtime:** React 18 single-page application built with Vite 4 and TypeScript
- **State:** Redux Toolkit (`src/store/`), TanStack Query for server state
- **Delivery:** Static bundle served from a CDN/static host; `vite preview` on port 4173 in CI
- **Backend:** ArtisanMarket API over HTTPS (`VITE_API_URL`), Socket.IO (`VITE_SOCKET_URL`)
- **Third parties:** Stripe.js (`@stripe/react-stripe-js`), ImageKit, Plaid Link

### Trust boundaries

- **External entity:** Shopper / vendor (browser)
- **Process:** React SPA executing in the visitor's browser — fully attacker-inspectable
- **Boundaries:** Browser ↔ ArtisanMarket API · Browser ↔ Stripe / ImageKit / Plaid ·
  Build pipeline ↔ static host

Everything shipped in the bundle is public. The SPA is a **client of** the trust
boundary, never an enforcer of it: all authorisation decisions belong to the API.

## Branch promotion and gate coverage

The pipeline in `.github/workflows/pipeline.yml` applies these controls cumulatively:

| Branch | Stages | Gates applied |
|---|---|---|
| `dev` | Plan, Code | Threat model check, `tsc --noEmit`, ESLint, Gitleaks, SonarQube, `npm audit` |
| `staging` | + Build, Staging | + Production build, Snyk, Trivy, Checkov, OWASP ZAP baseline DAST |
| `main` | + Deploy, Monitor | + Release gate, continuous compliance summary |

## STRIDE analysis (summary)

| # | Element | Threat (STRIDE) | Description | Mitigation / control |
|---|---|---|---|---|
| T1 | Session token storage (`src/store/slices/authSlice.ts`) | Information Disclosure | The JWT is held in `localStorage`, which is readable by any script running on the origin. A single XSS flaw — in first-party code or any dependency — exfiltrates a full session | SAST gate (SonarQube) at Code stage; prefer an `HttpOnly`, `Secure`, `SameSite` cookie issued by the API, or accept the risk explicitly and keep T2 tightly controlled |
| T2 | Product, review and vendor content rendering | Tampering / Elevation of Privilege | Attacker-supplied content (review bodies, shop descriptions) rendered as raw HTML would execute as script — the delivery path for T1 | **Currently mitigated** — no `dangerouslySetInnerHTML` anywhere in `src/`; React escapes by default. Any future use is a blocking review item |
| T3 | Build-time environment variables | Information Disclosure | Every `import.meta.env.VITE_*` value is inlined into the public bundle. A private key placed in one is world-readable | Only publishable values are used today (`VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_IMAGEKIT_PUBLIC_KEY`, `VITE_API_URL`, `VITE_SOCKET_URL`). Gitleaks gate at Code stage; secret keys must stay server-side |
| T4 | Third-party packages | Tampering | The bundle inlines dependency code and ships it to every visitor, so a compromised or vulnerable package executes in the user's browser | SCA gates: `npm audit` on every branch, Snyk at Build stage (staging and main) |
| T5 | Static host response headers | Tampering / Information Disclosure | Without CSP, `X-Frame-Options` and HSTS, the SPA is exposed to clickjacking and script injection that a header policy would blunt | DAST gate (OWASP ZAP baseline) at Staging stage reports missing headers; policy is set on the static host, not in the bundle |
| T6 | PWA service worker (`vite-plugin-pwa`) | Information Disclosure | `registerType: 'autoUpdate'` with a broad `globPatterns` cache could persist authenticated responses in the browser cache across sessions | Cache only static build assets; never add API responses to precache. Verify on each Workbox config change |
| T7 | Checkout (Stripe.js) | Repudiation / Information Disclosure | Card data must never reach ArtisanMarket servers or the Redux store | Stripe Elements keeps card entry inside a Stripe-hosted iframe, holding the app in PCI DSS SAQ-A scope. Any move to raw card fields changes that materially |
| T8 | Container image and deployment manifests | Tampering / Denial of Service | A serving image or manifest could carry known CVEs or run as root | Trivy and Checkov at Build stage — **inactive**, no `Dockerfile`, `k8s/` or `docker-compose.yml` in the repository yet |
| T9 | Client-side route guards | Elevation of Privilege | Hiding vendor or admin routes in the SPA is presentation only; the bundle can be read and any route reached directly | Not a client-side control — every privileged action is authorised server-side by the API. Recorded here so it is not mistaken for a mitigation |

T1 is the live "before" case for Chapter 5 in this repository: token-in-`localStorage`
is a real, currently-shipping design decision that the Code-stage SAST gate flags, kept
in place so the chapter has a genuine finding to report and remediate. T8 is a staged
control — the pipeline steps exist and self-activate as soon as those artifacts land.

## Sign-off

Reviewed and approved to proceed to the Code stage.

- **Reviewer:** _[supervisor / lead developer name]_
- **Date:** _[sign-off date]_
