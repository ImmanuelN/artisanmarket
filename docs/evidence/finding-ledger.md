# Finding ledger — SonarQube baseline

**Captured:** 2026-09-30, from the first SonarCloud analysis of `artisanmarket`.

This is the **pre-remediation baseline**: every vulnerability SonarQube reported
before any of it was fixed. It exists so each finding can be deliberately
reintroduced later as a controlled seeded case, in the same isolated one-commit
style as SEED-SAST-01 through SEED-SCA-01.

Once a finding is fixed SonarCloud stops reporting it, and this detail cannot be
reconstructed from the platform afterwards — which is why it is recorded here
rather than left implicit.

Each entry gives the rule, the affected sites, the weakness, and how to put it
back. **Threat** links the finding to `docs/threat-model.md` where one applies.

**Total: 22 vulnerabilities** — CRITICAL 2, MAJOR 19, MINOR 1


## `githubactions:S7637` — Action not SHA-pinned

**8 site(s)** · severity MAJOR · threat: —

A workflow references an action by tag, which is mutable, so the code executed can change without the workflow changing.

| File | Line |
|---|---|
| `.github/workflows/pipeline.yml` | 116 |
| `.github/workflows/pipeline.yml` | 122 |
| `.github/workflows/pipeline.yml` | 205 |
| `.github/workflows/pipeline.yml` | 220 |
| `.github/workflows/pipeline.yml` | 228 |
| `.github/workflows/pipeline.yml` | 238 |
| `.github/workflows/pipeline.yml` | 246 |
| `.github/workflows/pipeline.yml` | 273 |

**To reintroduce:** Replace a SHA ref with a tag. Directly relevant: two pipeline defects in this project were action-version problems.


## `githubactions:S6505` — npm lifecycle scripts allowed

**6 site(s)** · severity MAJOR · threat: —

npm ci / npx run package lifecycle scripts, executing third-party code at build time.

| File | Line |
|---|---|
| `.github/workflows/pipeline.yml` | 93 |
| `.github/workflows/pipeline.yml` | 101 |
| `.github/workflows/pipeline.yml` | 139 |
| `.github/workflows/pipeline.yml` | 176 |
| `.github/workflows/pipeline.yml` | 264 |
| `.github/workflows/pipeline.yml` | 270 |

**To reintroduce:** Drop --ignore-scripts.


## `typescript:S2245` — Insecure randomness

**2 site(s)** · severity MAJOR · threat: —

Math.random() is not cryptographically secure.

| File | Line |
|---|---|
| `src/pages/Checkout.tsx` | 120 |
| `src/pages/OrderConfirmation.tsx` | 18 |

**To reintroduce:** Use Math.random() for a security-relevant value.


## `typescript:S5852` — ReDoS regex

**2 site(s)** · severity CRITICAL · threat: —

A static regex is vulnerable to exponential backtracking.

| File | Line |
|---|---|
| `src/utils/validation.ts` | 27 |
| `src/utils/validation.ts` | 64 |

**To reintroduce:** Restore a nested-quantifier regex.


## `docker:S6504` — Copied resource writable

**1 site(s)** · severity MINOR · threat: T6

A copied resource can be modified by a non-root user.

| File | Line |
|---|---|
| `Dockerfile` | 57 |

**To reintroduce:** Remove the --chown on a COPY.


## `docker:S6505` — npm lifecycle scripts allowed in image build

**1 site(s)** · severity MAJOR · threat: T6

Same as the workflow case, inside the Dockerfile.

| File | Line |
|---|---|
| `Dockerfile` | 20 |

**To reintroduce:** Drop --ignore-scripts from the image build.


## `githubactions:S8233` — Over-broad workflow permission

**1 site(s)** · severity MAJOR · threat: —

A write permission is granted workflow-wide rather than to the job that needs it.

| File | Line |
|---|---|
| `.github/workflows/pipeline.yml` | 30 |

**To reintroduce:** Move a permission up to workflow level.


## `githubactions:S8543` — Unpinned package version

**1 site(s)** · severity MAJOR · threat: —

npx installs an unverified latest release.

| File | Line |
|---|---|
| `.github/workflows/pipeline.yml` | 101 |

**To reintroduce:** Remove the version from an npx invocation.
