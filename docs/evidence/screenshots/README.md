# Screenshots to capture

The evidence documents reference these images. Save with the filename given —
the documents already link to them.

> **Before capturing:** check nothing sensitive is in frame — tokens in a URL
> bar, unrelated private repositories, email addresses in an account menu.

## 1. `sonar-gate-passed-client.png`

**Referenced by:** `quality-gate.md`.

```
https://sonarcloud.io/summary/pull_request?id=ImmanuelN_artisanmarket&pullRequest=4
```

The **Quality Gate** panel showing **Passed** with all conditions visible.

Capture the **Coverage on New Code** measure in the same frame if it fits. It
reads 0% yet passes, because SonarCloud skips the condition when a pull request
adds no new executable lines — a distinction the document explains and which is
easy to misread from the number alone.

## 2. `pipeline-six-stages-green.png`

**Referenced by:** `end-to-end-run.md`.

```
https://github.com/ImmanuelN/artisanmarket/actions
```

The most recent successful run on `feat/sonar-activation`, showing all eight
jobs green: Context, Plan, Code (SAST), Code (SCA), Build, Staging/DAST, Deploy,
Monitor.

## 3. `zap-baseline-client.png`

**Referenced by:** `end-to-end-run.md` — the DAST section.

Open that run's **Staging · DAST** job and capture the ZAP summary line:
`FAIL-NEW: 0 · WARN-NEW: 0 · IGNORE: 10 · PASS: 57`.

The `IGNORE: 10` matters — those are the host-layer header rules scoped out in
`.zap/rules.tsv`, not findings that were silently dropped.
