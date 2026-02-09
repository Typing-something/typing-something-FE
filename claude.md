# Claude Instructions (Project Guide)

This file defines how an AI assistant (Claude) should work on this repository.
Goal: help implement features, fixes, and refactors **without inventing behavior** and **without breaking the project architecture**.

---

## 1) Project Context

- This is a production-oriented web app (not a demo).
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS.
- Server Components are default. Client Components are used only when necessary.

Core values:
- Correctness over cleverness
- Maintainability over speed
- Small, reviewable changes
- No speculation about backend behavior

---

## 2) Tech / Coding Rules

### TypeScript
- Use strict typing.
- Avoid `any`. If unavoidable, explain why and isolate it.
- Prefer `type` aliases for object shapes and API responses.

### React / Next.js
- Prefer React Server Components by default.
- Add `"use client"` only when needed (state, effects, browser APIs, event handlers).
- Do not move logic to client components unnecessarily.
- Do not introduce new libraries unless explicitly requested.

### Tailwind / UI
- Follow existing UI patterns/components.
- Keep styling consistent (spacing, typography, neutral palette usage).
- Avoid large inline style blocks unless required.

---

## 3) Architecture & File Structure

- Keep separation of concerns:
  - UI components should not contain API fetching logic unless already patterned that way.
  - Data fetching belongs in `lib/api/*` or existing API utilities.
  - React Query / hooks belong in `hooks/*` or `query/*` (follow existing structure).
- Atomic-ish hierarchy should be respected:
  - atoms: smallest presentational units
  - molecules: small composed UI
  - organisms: page-level sections/containers

Rules:
- One component per file (unless trivial).
- If a file grows too large (~300+ lines), suggest splitting.
- Do not rename or move many files in one PR unless requested.

---

## 4) API / Data Contract Rules (IMPORTANT)

- **Do not assume** API response fields or shapes.
- Only use fields that are explicitly provided in existing code or by the user.
- If the API shape is unclear:
  - Ask for the response example (JSON) OR
  - Provide a safe implementation that validates/guards unknown fields and clearly marks assumptions.

Do NOT:
- Invent endpoints
- Invent auth behavior
- Invent DB schema
- Invent pagination rules

---

## 5) “No Lies” Policy

- Do not claim that something is implemented if it is not.
- Do not reference features from other projects unless explicitly told to.
- If you add placeholders / TODOs, label them clearly.

---

## 6) Change Management (PR Discipline)

When implementing something:
1. Explain the approach in 3–6 bullet points.
2. List files to change.
3. Provide code changes.
4. Mention edge cases & tests (even if tests aren’t added yet).

Scope control:
- Do not mix unrelated changes in one PR.
- Do not format/rewrite entire files unless necessary.
- Avoid “drive-by refactors”.

---

## 7) Git Conventions

Branch naming:
- `feature/*` for new features
- `fix/*` for bug fixes
- `refactor/*` for internal refactors
- `chore/*` for tooling/docs

Commit message style:
- Prefer Korean commit messages unless the user requests English.
- Be specific and small.

Examples:
- `chore: claude.md 작업 가이드 추가`
- `fix: 결과 모달 WPM/CPM 라벨 교정`
- `feature: 마이페이지 프로필 편집 모달 추가`

---

## 8) Output Format Preferences

- Prefer concise, copy-paste-ready code.
- If multiple options exist, recommend one and explain why.
- If unsure, ask a single focused question OR provide a safe default + assumptions.

---

## 9) Security / Secrets

- Never hardcode secrets.
- Use environment variables and existing patterns.
- Avoid logging tokens or personal data.

---

## 10) Quick Checklist Before Answering

- Am I inventing an API shape? (If yes → stop)
- Did I add "use client" unnecessarily?
- Did I change unrelated code?
- Did I match existing code style/patterns?
- Is the diff reviewable?

# Claude Code – Testing Workflow Rules

## 📌 Mandatory Workflow for Test Tasks

Whenever working on **test code**, you MUST strictly follow this process:

---

### 1. Branching

- Create a **dedicated branch per test task**
- Branch name format:
  - `test/<target>`
  - `test/<target>-<scenario>`
- Examples:
  - `test/parseTypingLine`
  - `test/useLiveTypingMetrics-accuracy`
- Never write or modify tests on `main` or `develop`.

---

### 2. Read the Testing Guide

- Always read `TESTING_GUIDE.md` **before** writing tests.
- Follow its philosophy, naming conventions, and structure.
- Do NOT invent new testing styles.

---

### 3. Write Tests

- Tests must clearly explain:
  - What behavior is being verified
  - What bug or regression the test prevents
- Prefer readable and intention-revealing test names.

---

### 4. Run Tests

- Run tests locally:
  - `npm test` / `pnpm test`
- Do NOT assume tests pass without running them.

---

### 5. Handle Failures

- If any test FAILS:
  - Do NOT commit.
  - Analyze whether:
    - The test expectation is incorrect, or
    - There is a bug in the implementation.
  - Fix the issue.
  - Re-run tests until all tests PASS.
- If expected behavior is unclear, STOP and ask the user.

⚠️ STRICT RULES
- Never commit failing tests.
- Never skip or comment out tests.
- Never use `.only`, `.skip`, or equivalents.

---

### 6. Commit & Push

- Commit **only after all tests pass**
- Commit message format:
  - `test: add tests for <target>`
- Push the branch after commit.

---

### 7. Cleanup (Post-Merge)

- Branch cleanup MUST be done **after merge**.
- Claude MUST NOT delete branches automatically.
- After pushing the test branch, Claude should:

  1. **Suggest a PR description**
     - Summarize:
       - What was tested
       - Why the test was added
       - What regression or risk it prevents
     - Keep it concise and review-friendly.

  2. Inform the user that cleanup is required after merge.
  3. Specify which local and remote branches can be deleted.

Example:
- "Suggested PR description:
  - Adds regression tests for whitespace handling in `parseTypingLine`
  - Prevents incorrect accuracy calculation when extra spaces are typed

  After merging `test/parseTypingLine-whitespace`, you can safely delete:
  - local branch: `test/parseTypingLine-whitespace`
  - remote branch: `origin/test/parseTypingLine-whitespace`"
---

### ⚠️ Absolute Rules

- Never skip any step above.
- Never combine multiple unrelated tests into one branch.
- If unsure about branch naming, scope, or cleanup timing, ASK first.