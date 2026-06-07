---
name: spec-writer
description: Generate versioned markdown project specs from the current conversation, with acceptance criteria written in strict EARS syntax. Use when the user asks to create project requirements/spec docs, spec-vNNN.md files, or EARS-style acceptance criteria from chat context.
arguments: [appname]
---

# Spec Writer

Use this skill to generate a new versioned spec document from the current conversation only.

## Scope

- Use only the most recent grill-me interview in the current conversation as source material.
- Do not read repository files unless the user explicitly asks.
- Produce a new file each run using versioned naming.

## Output file naming

1. Scan the current working directory for files matching `spec-vNNN.md`.
2. Parse `NNN` as a zero-padded integer.
3. Create the next file in sequence.
4. If none exist, create `spec-v001.md`.
5. Never overwrite previous versions.

## Required document template

The generated file must contain these sections in this order:

```md
# Project Spec for $appname
## Context
## Goals
## Non-Goals
## Actors
## Assumptions & Constraints
## Acceptance Criteria
## Risks / Trade-offs
## Open Questions
## Known Gaps
```

## Acceptance Criteria rules

- Use one global ordered list only (`1.`, `2.`, `3.`).
- Every requirement must be phrased in EARS style.
- Normalize wording so EARS keywords are uppercase:
  - `WHEN`
  - `WHILE`
  - `WHERE`
  - `IF`
  - `THEN`
  - `SHALL`
- If a drafted requirement is not valid EARS phrasing, rewrite it into valid EARS form before writing.
- Do not add type labels (no `[Event-driven]`, etc.).

## Missing information handling

- Generate the draft immediately, even with incomplete inputs.
- Do not ask follow-up questions after writing the file.
- Add explicit placeholders for unknowns using `[NEEDS_INPUT:<topic>]`.
- Capture unresolved items in `## Known Gaps`.

## Process

1. Synthesize project intent and constraints from the conversation.
2. Draft all sections with concise, concrete content.
3. Convert acceptance items into strict EARS phrasing with uppercase keywords.
4. Add `[NEEDS_INPUT:<topic>]` where details are missing.
5. Write the next versioned spec file.
6. Stop after generation and report the created filename.
