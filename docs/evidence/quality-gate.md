# Quality gate configuration and its deliberate weakening

**Decision date:** 2026-10-01

The Code stage now treats SonarQube as a **gate** rather than a reporting step:
`sonar.qualitygate.wait=true` makes the scanner wait for the server-side result
and fail the build when it is `ERROR`. Without it the step uploads findings and
passes regardless — which is how a Security rating of **E** sat next to a green
pipeline for the whole of this project's first Sonar run.

## The custom gate

The projects use a custom gate, **"ArtisanMarket way"**, which is SonarCloud's
built-in *Sonar way* with **one condition removed**:

| Condition | Sonar way | ArtisanMarket way |
|---|---|---|
| `new_security_rating` > A | fail | **fail** |
| `new_reliability_rating` > A | fail | **fail** |
| `new_maintainability_rating` > A | fail | **fail** |
| `new_duplicated_lines_density` > 3% | fail | **fail** |
| `new_security_hotspots_reviewed` < 100% | fail | **fail** |
| `new_coverage` < 80% | fail | **removed** |

Every security-relevant condition still blocks. Only the coverage condition is
dropped.

## Why coverage was dropped, honestly

This is a weakening of the gate and is recorded as such rather than quietly
applied.

This repository has **no test suite at all**, so coverage on new code is 0%.

Worth noting precisely: SonarCloud's coverage condition reported `ok` here even
at 0%, because it is skipped when a pull request adds no new *executable* lines.
The condition was therefore never what blocked this project — the gate failed on
maintainability instead, which has since been fixed. Coverage is removed from
the gate anyway, so that a future change which does add executable lines cannot
be blocked by a threshold this repository has never been in a position to meet.

The API repository carries the substantive test suite (38 unit, 9 integration);
see its `docs/evidence/quality-gate.md` for why 80% was not pursued there.

**What this costs:** a future change can add untested code without the gate
objecting. Coverage is still measured and visible on the SonarCloud dashboard;
it is simply not blocking.

**Revisit when:** the route/entrypoint circular import is resolved, which would
make route tests cheap enough that 80% is reachable without per-file mocking.

## Known false positives

None in this repository. The API repository has two marked `jssecurity:S5147`
findings; see its `docs/evidence/quality-gate.md` for the reasoning, which is
worth reading as a general result about SAST taint analysis rather than a
repository-specific note.

## Reproducing this configuration

1. **SonarCloud → Quality Gates → Create** — name it `ArtisanMarket way`, copy
   *Sonar way*, then delete the `Coverage on New Code` condition.
2. **Assign it** to both `ImmanuelN_artisanmarket-api` and
   `ImmanuelN_artisanmarket` (Project → Administration → Quality Gate).
3. `sonar.qualitygate.wait=true` is already set in `sonar-project.properties`;
   no pipeline change is needed.
