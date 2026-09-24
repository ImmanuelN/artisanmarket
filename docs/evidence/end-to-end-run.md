# Demonstration evidence — pipeline operates end to end

**Purpose (Section 6.2):** establish that the six-stage DevSecOps model executes
from Plan through Monitor. This is a claim about the *mechanism*, deliberately
separated from any claim about vulnerability detection, which is evidenced
separately by the seeded-case runs.

## Run under evidence

| | |
|---|---|
| Repository | `ImmanuelN/artisanmarket` (client) |
| Run | [35995410564](https://github.com/ImmanuelN/artisanmarket/actions/runs/35995410564) |
| Commit | `c85b19354eda4160555f66bf0532a4d75517ee5e` |
| Event | `pull_request`, base `main` |
| Started | 2026-09-24T11:50:43Z |
| Completed | 2026-09-24T11:55:46Z |
| Duration | ~5 minutes |
| Conclusion | **success** |

The `pull_request` event with base `main` resolves `production=true`, so all six
stages execute without modifying `main`.

## Stage results

| Stage (Chapter 4) | Job | Result |
|---|---|---|
| — | Context · resolve promotion stage | success |
| Plan (4.3.1) | Plan · threat model present | success |
| Code (4.3.2, 4.3.3) | Code · SAST + secret scanning | success |
| Code (4.3.4) | Code · SCA baseline (npm audit) | success |
| Build (4.3.4–4.3.6) | Build · SCA + container + IaC scanning | success |
| Staging (4.3.7) | Staging · DAST | success |
| Deploy (4.3.8) | Deploy · production release gate | success |
| Monitor (4.3.9) | Monitor · compliance summary | success |

## DAST result

OWASP ZAP baseline against the built SPA served by `vite preview`:

```
FAIL-NEW: 0   FAIL-INPROG: 0   WARN-NEW: 0   WARN-INPROG: 0
INFO: 0       IGNORE: 10       PASS: 57
```

57 application-layer rules passed across 9 URLs. The 10 `IGNORE` entries are
response-header rules scoped out per-rule in `.zap/rules.tsv`: the DAST target is
a static file server, and header policy is applied at the CDN/static host
(threat T5). Those controls are recorded as requiring verification against the
deployed host, which this job does not cover.

## Validity caveats

These must be stated wherever this run is cited:

1. **Two gates were relaxed for this run.** `npm audit` and the Trivy filesystem
   scan are marked `continue-on-error`, tagged `DEMO-GATE-RELAXED` in the
   workflow. 27 pre-existing critical/high advisories remain, one requiring a
   semver-major `vite` upgrade. Without this the chain could not reach Build, so
   the run evidences stage execution, **not** a vulnerability-free dependency
   tree.
2. **Threat T1 is an accepted risk, not a remediation.** Three `localStorage`
   token writes carry documented exceptions. See `docs/threat-model.md`.
3. **The type check is advisory.** `tsc --noEmit` runs with
   `continue-on-error`; ~95 pre-existing errors would otherwise mask the
   security gate.

## Defects found by reaching each stage

Five pipeline defects were only discoverable once each stage unblocked the next.
They are recorded because they bear on the Section 6.2 argument: a pipeline that
stays red for unrelated reasons cannot evidence that its later stages are even
correctly configured.

| # | Defect | Stage exposed |
|---|---|---|
| 1 | `aquasecurity/trivy-action@0.24.0` does not exist; release tags carry a `v` prefix. Job failed at *Set up job* before any scanner ran | Build |
| 2 | Gitleaks fired on `docs/threat-model.md` — documenting a remediated fallback reproduced a literal matching the Stripe key rule | Code |
| 3 | API exits in `utils/encryption.js` unless `BANK_ENCRYPTION_KEY` is 64 hex chars, so it never bound its port and the health check timed out with no visible cause | Staging |
| 4 | `zaproxy/action-baseline@v0.12.0` uploads via the retired `upload-artifact` v3 backend — the scan passed but the step failed | Staging |
| 5 | Gitleaks scans the **whole PR commit range**, not just the head commit, so a secret introduced and removed within the same PR still fires | Code (PR only) |

Defect 5 generalises: remediating a committed secret in a later commit does not
satisfy secret scanning. The secret must never be committed, or history rewritten.
