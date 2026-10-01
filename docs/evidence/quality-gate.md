# Quality gate configuration

**Decision date:** 2026-10-01 · **Status:** passing on the default gate

The Code stage treats SonarQube as a **gate**, not a reporting step:
`sonar.qualitygate.wait=true` makes the scanner wait for the server-side result
and fail the build when it is `ERROR`. Without it the step uploads findings and
passes regardless.

## Result

The project passes SonarCloud's **unmodified default gate**, *Sonar way* — every
condition green, nothing relaxed, no paid feature used.

![SonarCloud quality gate passing on PR #4](screenshots/sonar-gate-passed-client.png)
*SonarCloud quality gate, `artisanmarket` PR #4.*

## The gate is SonarCloud's default, "Sonar way"

| Condition | Threshold |
|---|---|
| `new_security_rating` | worse than A fails |
| `new_reliability_rating` | worse than A fails |
| `new_maintainability_rating` | worse than A fails |
| `new_coverage` | below 80% fails |
| `new_duplicated_lines_density` | above 3% fails |
| `new_security_hotspots_reviewed` | below 100% fails |

### Why not a custom gate

A custom gate without the coverage condition was considered and **rejected on
cost**. SonarCloud restricts assigning any gate other than the default to paid
plans, and this project is bound by the open-source and free-tooling constraint
in Section 7.2 of the proposal.

Worth recording as a finding about tool selection: a free-tier hosted scanner
can constrain engineering decisions in ways the feature list does not make
obvious, and the constraint only surfaced at the point of trying to act on it.

## Coverage on this repository

The repository now has a test suite. Previously it had none, and
`new_coverage` reported 0% — passing only because SonarCloud skips the
condition when a pull request adds no new *executable* lines. That was a
condition not yet triggered rather than one satisfied, and the first change
touching `src/` would have been blocked with no way to meet it.

**17 tests, 96.6% coverage of `src/utils/validation.ts`.**

They assert security properties rather than counting lines. The central ones
cover the ReDoS fix (`typescript:S5852`): a 50,000-character hostile input and a
100,000-character input with no `@` must both return in under a second. Against
the previous pattern — `([.-]?\w+)*`, which nests quantifiers — those inputs
backtrack exponentially, and because validation runs on the UI thread a pasted
value could hang the tab. The suite also checks the pattern still accepts
ordinary addresses and still rejects malformed ones, so the fix cannot regress
into something merely permissive.

One test covers a client-side mass-assignment case: a role outside
`customer`/`vendor` is rejected. The server is authoritative, but the client
should not offer to submit a privileged role in the first place.

### A tooling constraint worth recording

Vitest is pinned to **0.34.x**, not current. Current Vitest requires Vite 6 or
newer and this project is on Vite 4 — the same upstream constraint that blocks
upgrading Vite itself, documented under "Gate status" in `docs/threat-model.md`.
A dependency being too old to upgrade also makes its *tooling* too old to
upgrade, which compounds rather than staying isolated. Revisit both together.

## Known false positives

None in this repository. The API repository has two marked `jssecurity:S5147`
findings; its `docs/evidence/quality-gate.md` records the reasoning, which is
worth reading as a general result about SAST taint analysis rather than a
repository-specific note.
