# RehabServE — Technical Guide

Version: 1.0  
Date: 2026-01-21

## Table of Contents
- Overview
- Architecture
- Project layout
- Key components & responsibilities
- Data flow
- Setup & prerequisites
- Development workflow
- Environment & configuration
- Testing
- Build & deployment
- Observability & troubleshooting
- Security considerations
- Contribution & maintenance
- Appendix: Useful commands

## Overview

RehabServE is a React-based single-page application that ingests survey responses from Google Sheets, computes a RehabServE Index and dimension scores, visualizes results, and exposes a guided assistant (RehabBot) via a floating chatbot UI. This guide documents architecture, developer workflows, and operational procedures for maintainers and contributors.

## Architecture (high level)

- Client: React + TypeScript (TSX components). UI-driven, component-based architecture.
- Data source: Google Sheets (gviz/tq JSON) — fetched client-side by the application.
- Processing: Data is parsed and transformed in the client (see `processRawData()` in `src/App.tsx`).
- UI assistant: Floating chatbot (`src/components/FloatingChatbot.tsx`) implements single-intent mapping and reply guardrails.

## Project layout

- `src/`
  - `App.tsx` — application entry, Google Sheets fetching, parsing, state management.
  - `components/`
    - `FloatingChatbot.tsx` — chatbot UI, intent detection, quick buttons, response templates.
    - `QuestionBreakdown.tsx` — question-level scorecard and PDF export flow.
    - `Footer.tsx`, other UI components.
- `docs/`
  - `USER_MANUAL.md` — user-facing instructions and operational notes.
- `debug_output.txt` — local debug traces used during development.
- standard project files: `package.json`, `.gitignore`, config files.

## Key components & responsibilities

- `src/App.tsx`
  - Fetches Google Sheet data (`fetchSheetData()`).
  - Parses and processes raw sheet data (`processRawData()`).
  - Maintains global UI state such as `processedDashboardData` and `kpiData`.
  - Configurable constants: `SHEET_ID`, fetch interval.

- `src/components/FloatingChatbot.tsx`
  - Renders persistent floating chat widget.
  - Implements `detectIntent`, `getSuggestedQuestions`, and `getBotResponse()`.
  - Enforces rules: single-intent replies, anti-repetition, progressive depth, and content compression.

- `src/components/QuestionBreakdown.tsx`
  - Renders question-level table.
  - Implements **Download PDF** using a print window containing styled HTML of the scorecard.

## Data flow

1. Google Sheet (gviz/tq JSON) is fetched by `fetchSheetData()` in `App.tsx`.
2. Raw JSON is parsed and normalized.
3. `processRawData()` computes:
   - RehabServE Index
   - Dimension scores (0–7)
   - Trend indicators (percent change vs previous index)
4. `processedDashboardData` and `kpiData` states are used by UI components and the chatbot.

## Setup & prerequisites

- Node.js (LTS recommended: 18.x or 20.x)
- npm (bundled) or yarn
- Browser: modern Chrome/Edge/Firefox

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Verify app is accessible at the port printed by the dev server (commonly `http://localhost:3000`).

## Development workflow

- Branching: create feature branches from `main`/`develop` depending on team policy.
- Commits: small, focused, descriptive. Prefer one change per commit.
- Lint & format: run linters and formatters before committing.
- Type safety: keep TypeScript strict; add types for API responses and component props.
- Tests: add unit tests for data processing and component behaviour (chatbot intent mappings, PDF flow).

## Environment & configuration

- Sheet configuration:
  - `SHEET_ID` is defined in `src/App.tsx`. Update to point at your Google Sheet.
  - Ensure the sheet is available publicly or the fetch has valid access.
- Fetch interval:
  - Default fetch cadence is implemented with a repeating interval in `App.tsx` (example: `setInterval(fetchSheetData, 10000)`).
  - Adjust interval to reduce network usage for production deployments.
- Secrets:
  - Do not store secrets in the repo. Use CI/CD secret stores or environment injection for production.

## Testing

- Unit tests: use the project's configured test framework (Jest/React Testing Library recommended).
- Important areas to test:
  - `processRawData()` outputs and edge cases (missing columns, empty responses).
  - Chatbot `detectIntent` and `getBotResponse()` logic.
  - PDF export flow in `QuestionBreakdown.tsx`.

Run tests:

```bash
npm run test
```

## Build & deployment

- Production build:

```bash
npm run build
```

- Typical deployment targets:
  - Static hosting (Vercel, Netlify)
  - S3 + CloudFront (for single-page static builds)
  - Serve via a CDN or static web server

- CI/CD:
  - Pipeline should: install → lint → test → build → deploy.
  - Inject runtime environment variables (sheet IDs, feature flags) via the deployment platform.

## Observability & troubleshooting

- Client debugging:
  - Use browser DevTools (Console & Network) to inspect fetch requests and runtime errors.
  - The app logs useful diagnostics to `debug_output.txt` during development.
- Common failure modes:
  - Fetch fails: check `SHEET_ID`, network connectivity, and CORS.
  - Missing PDK detection: ensure sheet headers include expected columns (see header-detection in `App.tsx`).
  - PDF blocked: ensure popups are allowed — the PDF flow uses a new window + print.

## Security considerations

- Use HTTPS for production deployments.
- Avoid committing environment variables and secrets.
- Sanitize and validate any user input if relayed to backend services.
- Access control: session keys `assignedPDK` and `isAdmin` are stored in sessionStorage — treat those as client-side indicators only.

## Contribution & maintenance

- Workflow:
  1. Create branch
  2. Implement feature / fix
  3. Add tests
  4. Run linters and tests
  5. Open PR with a short summary and test plan

- Suggested refactors / future work:
  - Split large components (e.g., `FloatingChatbot.tsx`) into smaller subcomponents for clarity and testability.
  - Add integration/e2e tests for the chatbot flows and PDF export.
  - Centralize configuration (sheet IDs, intervals, feature flags) into a single config module.

## Appendix — Useful commands

Install:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---  
For developer-facing implementation notes and developer pointers see `docs/USER_MANUAL.md` and the implementation hints included in the top of `src/App.tsx` and `src/components/FloatingChatbot.tsx`.

