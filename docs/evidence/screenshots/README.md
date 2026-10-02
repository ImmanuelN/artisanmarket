# Screenshots

The evidence documents reference these images. Save with the filename given —
the documents already link to them.

> **Before capturing:** check nothing sensitive is in frame — tokens in a URL
> bar, unrelated private repositories, email addresses in an account menu.

| File | State |
|---|---|
| `sonar-gate-passed-client.png` | **captured**, embedded in `quality-gate.md` |
| `zap-baseline-client.png` | **captured**, embedded in `end-to-end-run.md` |
| `pipeline-six-stages-green.png` | **needs recapture** — see below |

## 1. `sonar-gate-passed-client.png` — done

**Referenced by:** `quality-gate.md`.

```
https://sonarcloud.io/dashboard?id=ImmanuelN_artisanmarket&pullRequest=4
```

The **Quality Gate** panel showing **Passed** with all conditions visible, and
the **Coverage** panel reading 0.0% against a required 80.0% in the same frame.

That pairing is the valuable part and the captured image has it. A 0% coverage
measure sitting next to a Passed gate is the whole point of the "Coverage on
this repository" section — do not crop it out as if it were an error.

## 2. `pipeline-six-stages-green.png` — recapture needed

**Referenced by:** `end-to-end-run.md`.

The image currently saved under this name is the **workflow run list**, which
shows run titles and branches but no stage names, and includes a failed run. It
does not evidence the claim in its caption, so it is not embedded.

What is needed is a **single run page**, not the list. Open a successful run and
capture the job sidebar showing all eight rows green:

```
Context · resolve promotion stage
Plan · threat model present
Code · SCA baseline (npm audit)
Code · SAST + secret scanning
Build · SCA + container + IaC scanning
Staging · DAST
Deploy · production release gate
Monitor · compliance summary
```

A run that satisfies this:

```
https://github.com/ImmanuelN/artisanmarket/actions/runs/36996863453
```

> The run-list image is still worth keeping, but for a different claim — that
> the pipeline ran repeatedly across all three branches and genuinely blocked a
> merge. If you want that in the thesis, save it as
> `pipeline-run-history.png` and it can be embedded alongside the CVE section,
> where the one red run is the evidence rather than a blemish.

## 3. `zap-baseline-client.png` — done

**Referenced by:** `end-to-end-run.md` — the DAST section.

The **Staging · DAST** job showing the ZAP totals line:

```
FAIL-NEW: 0  FAIL-INPROG: 0  WARN-NEW: 0  WARN-INPROG: 0  INFO: 0  IGNORE: 9  PASS: 58
```

The `IGNORE: 9` matters — those are the host-layer header rules scoped out in
`.zap/rules.tsv`, not findings that were silently dropped. The captured image
shows the per-rule `IGNORE` entries above the totals, which is what makes that
readable rather than assertable.

> This capture corrected the document. `end-to-end-run.md` had recorded
> `IGNORE: 10 · PASS: 57`; the run log confirms the screenshot, and the figures
> in the document were wrong.
