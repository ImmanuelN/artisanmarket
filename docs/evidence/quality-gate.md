# Quality gate configuration

**Decision date:** 2026-10-01

The Code stage treats SonarQube as a **gate**, not a reporting step:
`sonar.qualitygate.wait=true` makes the scanner wait for the server-side result
and fail the build when it is `ERROR`. Without it the step uploads findings and
passes regardless.

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

This repository has no test suite, and `new_coverage` reports 0% — yet the
condition **passes**. SonarCloud skips it when a pull request adds no new
*executable* lines, which is the case here: the changes are configuration,
Kubernetes manifests, an nginx config and a regex literal.

That distinction matters and should not be relied on. A change which **does**
add executable TypeScript to this repository would be blocked by the 80%
threshold, and no test infrastructure exists to meet it. The condition has not
been satisfied here so much as not yet triggered.

The API repository carries the substantive suite — 54 tests across sanitisers,
the error handler and route integration against a real MongoDB. See its
`docs/evidence/quality-gate.md`, including why the coverage threshold was met
rather than avoided.

**Recommended follow-up:** add Vitest to this repository before the next change
that touches `src/`, so the gate is satisfiable when it does begin to apply.

## Known false positives

None in this repository. The API repository has two marked `jssecurity:S5147`
findings; its `docs/evidence/quality-gate.md` records the reasoning, which is
worth reading as a general result about SAST taint analysis rather than a
repository-specific note.
