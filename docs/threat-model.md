# ArtisanMarket Client — Threat Model

**Stage:** Plan (Section 4.3.1) · **Tool:** OWASP Threat Dragon · **Status:** Reviewed

This document is the Plan-stage artifact required before a feature proceeds to Code.
It covers the core flows of the ArtisanMarket storefront (`artisanmarket`): browsing
and search, account registration and login, cart and checkout, vendor dashboards, and
product reviews.

**The authoritative model is `docs/threat-model.json`**, an OWASP Threat Dragon v2
model built from this document, with one data-flow diagram, four trust boundaries and
threats T1–T9 attached to the elements they affect. This file is its narrative
companion. The Plan stage enforces the JSON model, not this file:
`scripts/threat-model-gate.mjs` fails the pipeline if any High or Critical threat is
Open, if any threat marked Mitigated or Accepted does not state its mitigation, or if
the model contains no threats.

## System under review

- **Runtime:** React 18 single-page application built with Vite 7 and TypeScript
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
| `staging` | + Build, Staging | + Production build, Trivy, Checkov, OWASP ZAP baseline DAST (Snyk optional, not configured) |
| `main` | + Deploy, Monitor | + Release gate, continuous compliance summary |

## STRIDE analysis (summary)

| # | Element | Threat (STRIDE) | Description | Mitigation / control |
|---|---|---|---|---|
| T1 | Session token storage (`src/store/slices/authSlice.ts`) | Information Disclosure | The JWT is held in `localStorage`, which is readable by any script running on the origin. A single XSS flaw — in first-party code or any dependency — exfiltrates a full session | SAST gate (SonarQube) at Code stage; prefer an `HttpOnly`, `Secure`, `SameSite` cookie issued by the API, or accept the risk explicitly and keep T2 tightly controlled |
| T2 | Product, review and vendor content rendering | Tampering / Elevation of Privilege | Attacker-supplied content (review bodies, shop descriptions) rendered as raw HTML would execute as script — the delivery path for T1 | **Currently mitigated** — no `dangerouslySetInnerHTML` anywhere in `src/`; React escapes by default. Any future use is a blocking review item |
| T3 | Build-time environment variables | Information Disclosure | Every `import.meta.env.VITE_*` value is inlined into the public bundle. A private key placed in one is world-readable | Only publishable values are used today (`VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_IMAGEKIT_PUBLIC_KEY`, `VITE_API_URL`, `VITE_SOCKET_URL`). Gitleaks gate at Code stage; secret keys must stay server-side |
| T4 | Third-party packages | Tampering | The bundle inlines dependency code and ships it to every visitor, so a compromised or vulnerable package executes in the user's browser | SCA gates on the full dependency tree, both blocking: `npm audit` on every branch through `scripts/audit-gate.mjs` (accepts a named advisory only with a reason and review date), and a Trivy dependency scan at Build (staging and main). Snyk is wired in as optional and does not run |
| T5 | Static host response headers | Tampering / Information Disclosure | Without CSP, `X-Frame-Options` and HSTS, the SPA is exposed to clickjacking and script injection that a header policy would blunt | DAST gate (OWASP ZAP baseline) at Staging stage reports missing headers; policy is set on the static host, not in the bundle |
| T6 | PWA service worker (`vite-plugin-pwa`) | Information Disclosure | `registerType: 'autoUpdate'` with a broad `globPatterns` cache could persist authenticated responses in the browser cache across sessions | Cache only static build assets; never add API responses to precache. Verify on each Workbox config change |
| T7 | Checkout (Stripe.js) | Repudiation / Information Disclosure | Card data must never reach ArtisanMarket servers or the Redux store | Stripe Elements keeps card entry inside a Stripe-hosted iframe, holding the app in PCI DSS SAQ-A scope. Any move to raw card fields changes that materially |
| T8 | Container image and deployment manifests | Tampering / Denial of Service | A serving image or manifest could carry known CVEs or run as root | **Active.** Trivy image scan and Checkov at Build stage. The first image scan found 40 findings (2 CRITICAL) from `nginx:1.27-alpine` pinning alpine 3.21.3; pinned forward to `nginx:1.31.6-alpine` and patched `libexpat` (CVE-2026-93990) and `pcre2` (CVE-2026-103111, published after the image had passed every gate), now clean at CRITICAL/HIGH. Checkov: 89 checks pass, with one documented exception (`CKV_K8S_43` image digest) |
| T9 | Client-side route guards | Elevation of Privilege | Hiding vendor or admin routes in the SPA is presentation only; the bundle can be read and any route reached directly | Not a client-side control — every privileged action is authorised server-side by the API. Recorded here so it is not mistaken for a mitigation |

T1 is a **formally accepted risk**, not an open defect. Token-in-`localStorage` is a
real, currently-shipping design decision at three call sites in
`src/store/slices/authSlice.ts`, each carrying an inline justification and a scoped
`eslint-disable-next-line`. The acceptance is bounded: the rule still blocks any
**new** credential write to browser storage, so the gate constrains future code while
the recorded exception covers the existing three. T8 is **now active**: the
`Dockerfile` and `k8s/` manifests exist, so the Trivy image scan and Checkov both
execute against real artifacts rather than self-skipping.

Note also that T5 (response headers) is now *configured* — `nginx.conf` in the
image carries the CSP and header policy — but is still **not exercised by DAST**,
because the Staging gate scans `vite preview`, which serves no headers. Pointing
DAST at a container built from this image would close that gap; it has not been
done, and the ZAP exceptions in `.zap/rules.tsv` remain in place.

### Risk acceptance — T1

- **Decision:** accept, do not remediate in this iteration.
- **Rationale:** the API issues bearer tokens; moving to an `HttpOnly` cookie is a
  cross-repo change touching login, `authMiddleware`, CORS credentials and every
  authenticated request path. The change is disproportionate to this iteration and
  carries a real risk of breaking authentication outright.
- **Compensating control:** threat T2 — every HTML sink stays closed. There is no
  `dangerouslySetInnerHTML` or `innerHTML` assignment anywhere in `src/`, and the
  Code-stage ruleset blocks both. Exfiltrating the token requires an XSS that T2 is
  specifically gating against.
- **Remediation path:** migrate to an `HttpOnly`, `Secure`, `SameSite=Strict` cookie
  issued by the API; remove all `localStorage` token access and the three exceptions.
- **Review:** revisit when auth is next modified.

### Gate status

All gates are blocking, on the **full** dependency tree.

| | Before | After |
|---|---|---|
| critical | 1 | 0 |
| high | 26 | 0 |
| moderate | 7 | 2 |
| **total** | **36** | **2** |

The two remaining moderates are `react-router` / `react-router-dom`.

**Previously scoped, now reverted.** The dependency gate ran with `--omit=dev`
for a period, because Vite 4 carried high-severity dev-server advisories
(`server.fs.deny` bypasses, `launch-editor` command injection) that could not be
upgraded away: `@vitejs/plugin-react@6` pulls `@rolldown/plugin-babel`, which
requires `@babel/core@8` and could not resolve against the tree.

That scoping narrowed supply-chain coverage — a compromised build tool can
affect the bundle even though it never ships — so it was recorded as a
weakening rather than applied quietly.

Upgrading to **Vite 7** cleared it. Vite 8 was *not* chosen: it forces
`@vitejs/plugin-react@6` and reintroduces the same rolldown/Babel conflict.
Vite 7 is the newest version with a fully resolvable plugin set here. The full
audit is blocking again and the compromise is gone.
