# Monitor stage — continuous compliance reporting

**Purpose:** record what the Monitor stage does, why it was rebuilt, and what it
found the first time it was tested. This is the source for the Monitor
component in the model design chapter. The same stage was rebuilt in
`artisanmarket-api`; its `docs/evidence/monitoring.md` covers the shared design
in the same terms.

## What it was, and why that was not acceptable

The first Monitor job wrote a fixed block of text to the run summary. It did not
read any result. Two consequences, both observed:

- On the `main` run of 2026-10-05 (run `37275761442`), the dependency audit
  failed and Build and Deploy were **skipped**. Monitor still succeeded and
  printed `Release gate (Deploy): passed`.
- It listed `Snyk on staging and main` as an active control. Snyk is not
  configured in this repository and has never run.

A monitoring stage that reports controls which did not run is worse than none,
because it is read as evidence.

## What it is now

`scripts/compliance-report.mjs`, run by the Monitor job, reads the **outcome of
every control's own step** and reports each as `passed`, `FAILED` or `not run`.
A control that was skipped, cancelled, or whose job never ran is `not run`,
never `passed`. The script is byte-identical to the API's tested copy; it is
`.mjs` here because this package is CommonJS.

| Stage | Control | Tool | PCI DSS v4.0.1 | GDPR |
|---|---|---|---|---|
| Plan | Threat model present | `docs/threat-model.md` | 6.2.1 | Art. 25(1) |
| Code | Security lint ruleset | ESLint | 6.2.4 | Art. 25(1) |
| Code | Security regression tests | Vitest | 6.2.4 | Art. 32(1)(d) |
| Code | Secret scanning | Gitleaks | 8.6.2 | Art. 32(1)(b) |
| Code | Static analysis and quality gate | SonarQube (SonarCloud) | 6.2.3, 6.2.4 | Art. 25(1) |
| Code | Dependency audit | npm audit + audit gate | 6.3.1, 6.3.3 | Art. 32(1)(b) |
| Build | Dependency analysis *(optional)* | Snyk | 6.3.1 | Art. 32(1)(b) |
| Build | Dependency and config scan | Trivy (filesystem) | 6.3.1, 6.3.2 | Art. 32(1)(b) |
| Build | Container image scan | Trivy (image) | 6.3.1, 6.3.3 | Art. 32(1)(b) |
| Build | Infrastructure-as-code scan | Checkov | 1.3.1, 2.2.1 | Art. 32(1)(b) |
| Staging | Dynamic scan of the running app | OWASP ZAP (baseline) | 6.2.4 | Art. 32(1)(d) |
| Deploy | Release gate | `needs` chain | 6.5.1 | Art. 32(1)(d) |

The job **fails unless every required control passed**, prints the
accepted-risk register with review dates, and stores each report as a run
artifact for 90 days.

### The compliance columns are an alignment, not an assessment

Each automated control *supports* part of the requirement cited; none satisfies
a requirement on its own. A ZAP **baseline** scan is passive — it crawls and
inspects responses, it does not attack — so it supports PCI DSS 6.2.4 but does
**not** satisfy 6.4.2, which requires an automated technical solution that
continually detects and prevents web-based attacks.

> The clause numbers were chosen against PCI DSS v4.0.1 and GDPR as published.
> Verify each against the standard's own text before citing them in the thesis.

## Continuous: a daily schedule

The workflow now also runs on `schedule` (daily, 02:23 UTC) and on
`workflow_dispatch`. The reason is evidenced in this repository:
CVE-2026-103111 in the `pcre2` package of the base image was published after the
image had passed every gate, and surfaced only because an unrelated
documentation merge happened to trigger a run.

GitHub disables scheduled workflows in a public repository after 60 days without
activity. If that happens, re-enable the workflow from the Actions tab.

## What the first full-history scan found

On push and pull-request events Gitleaks scans only the commits being
introduced; on a scheduled or manual run it scans the **entire history**. That
had never been done, so it was run locally first with the action's Gitleaks
version (8.24.3) against a fresh clone.

**15 hits**, all in commit `6a895f5` (2025-08-01). That commit predates the
split of the client and API into separate repositories and contains a `server/`
folder. None of the files is in the current tree.

| Rule | File | Hits | What it is |
|---|---|---|---|
| `curl-auth-header` | `server/test-vendor-bank-curl.md` | 11 | Placeholder bearer tokens: `YOUR_VENDOR_TOKEN`, `CUSTOMER_TOKEN`, `INVALID_TOKEN` |
| `stripe-access-token` | `server/server.js`, `server/routes/paymentRoutes.js` | 3 | The `sk_test_placeholder` fallback literal, already allowlisted in the API |
| `generic-api-key` | `DEMO_BANKING_SETUP.md` | 1 | A commented `# Example:` encryption key, written as a sequential `a1b2c3d4e5f6…` illustration |

**No live credential.** Each is allowlisted exactly in a new `.gitleaks.toml` —
by value or, for the example key, by its 12-character illustrative prefix — so a
real secret of the same kind is still detected.

The finding is that the history of the branch that ships had never been
examined. Commit-range scanning only sees new commits; anything committed before
the scanner existed is outside its view until a full scan is run.

### A Windows-only scan failure, recorded so it is not mistaken for a pipeline fault

Locally, the scan first stopped partway with `fatal: unable to read files to
diff`. The cause is a committed Word lock file
(`~$ftware Requirements Specification (SRS).docx`): Git for Windows ships a
system attribute that converts `.docx` for diffing, and the converter rejects
that file. Linux runners have no such attribute. With it disabled
(`GIT_ATTR_NOSYSTEM=1`) the scan completes, which is how the 15 hits above were
found.

### Verification

| Scan | Findings |
|---|---|
| Full history, all refs, new config | **0** |
| Full history, scoped to `main` (a scheduled run) | **0** |

This repository has no seeded-case branches, so both scopes agree. The Code
stage still scopes scheduled scans to the branch being verified, so the
behaviour matches the API.
