# RehabServE Instruction Manual

Version: 1.0  
Date: {{REPORT_DATE}}  
Prepared by: {{AUTHOR_NAME}}

---

This manual is adapted to the RehabServE system in this repository. It replaces the generic template sections with instructions, workflows, and examples specific to RehabServE (see implementation in `src/App.tsx`, `src/components/FloatingChatbot.tsx`, `src/components/QuestionBreakdown.tsx`).

## 1. Introduction

### 1.1 Purpose of the System
RehabServE is a clinical analytics platform that ingests survey responses (Google Sheets), computes a RehabServE Index and dimension scores (0–7), visualizes trends and dimension breakdowns, and provides concise AI‑informed recommendations and exports.

### 1.2 Purpose of This Manual
This manual helps users operate the dashboard, generate one‑page reports, export data (CSV/PDF), and use the RehabBot chatbot while following the system’s brevity and anti‑repetition rules.

### 1.3 Intended Users
- General users: view dashboards and exports.  
- Staff: use insights and recommended actions.  
- Administrators: manage PDK assignments, exports, and sheet configuration.

---

## 2. System Overview

### 2.1 Key Features (implemented)
- RehabServE Index (overall metric) and dimension-level scores (computed from question averages).  
- Trend indicator (computed as percent change vs previous index).  
- Dimension comparison (ranked) and dimension score breakdown (numbers).  
- Question-level scorecard and printable PDF via the Download PDF flow (implemented in `QuestionBreakdown` component).  
- Floating chatbot (`FloatingChatbot.tsx`) with curated quick buttons and single-intent responses.  
- Periodic data refresh from Google Sheets (see `SHEET_ID` and `fetchSheetData()` in `App.tsx`).

### 2.2 Data Flow
Google Sheet (gviz/tq JSON) → fetched by `fetchSheetData()` → parsed in `App.tsx` → processed by `processRawData()` → `processedDashboardData` state → visualizations and chatbot use these states.

---

## 3. System Requirements

### 3.1 Hardware
- Device: PC, laptop, or tablet.  
- Minimum: modern CPU, 4GB RAM. Recommended: 8GB+.

### 3.2 Software
- Browser: Chrome or Edge recommended.  
- Internet access: app fetches data from Google Sheets (SHEET_ID in `src/App.tsx`).

---

## 4. Getting Started

### 4.1 Accessing RehabServE
1. Open the application URL provided by your organisation.  
2. If you have no assigned PDK, the Landing Page prompts you to request access or enter a PDK access code.

### 4.2 Login and Session
- After login the app stores session keys in sessionStorage: `assignedPDK`, `isAdmin`. Admins see the PDK selector and "All PDKs".

### 4.3 Logout
- Click **Exit** (top-right). This removes session keys and returns to the landing page.

---

## 5. Interface & Controls (labels used in the app)

- Main navigation: **Dashboard**, **About RehabServE**, **Contact Support**.  
- Floating chatbot quick buttons (bottom-left):  
  - Performance snapshot  
  - Performance stability & trends  
  - Dimension comparison  
  - Dimension score breakdown  
  - Top-performing dimension  
  - Priority improvement area  
  - How to interpret charts  
  - Strategic improvement focus  
  - Recommended next actions  
  - How KPIs are calculated  
  - What each metric measures

- Scorecard export: **Download PDF** (opens print window).  
- CSV export: Export controls provide dimension/question CSVs.

---

## 6. How to Use Key Features (implementation-specific)

### 6.1 Performance snapshot
- What it does: single-line executive status. Implemented in `FloatingChatbot.tsx` — first call returns full snapshot; subsequent calls return a short reference (`overallSummaryShown` flag).

### 6.2 Trend direction
- What it does: returns "Improving", "Declining", or "Stable" based on `kpiData.trend` computed in `App.tsx`.

### 6.3 Dimension comparison
- What it does: returns ranked names using `processedDashboardData.dimensionsData` (sorted by `current`).

### 6.4 Dimension scores
- What it does: returns numeric scores (0–7). For copying/export use the CSV Export (Export controls).

### 6.5 Question scorecard & PDF
- What it does: `QuestionBreakdown.tsx` renders question-level table and provides a **Download PDF** button that opens a print window containing the scorecard HTML and styles.

### 6.6 RehabBot behavior (rules implemented)
- Single-intent mapping: messages map to one intent (see `detectIntent` in `FloatingChatbot.tsx`).  
- Anti-repetition: one-time snapshot, perspective rotation, progressive depth through intent counts.  
- Content compression for rapid repeated clicks is implemented (shortened replies).

---

## 7. Common Tasks (exact steps)

- View dashboard: open the app → **Dashboard**.  
- Select PDK (admin): use PDK selector in header.  
- Generate snapshot: open chatbot → click **Performance snapshot**.  
- Export CSV: Export → **Dimension scores (CSV)**.  
- Export PDF: Scorecard → **Download PDF**.

---

## 8. Troubleshooting (implementation notes)

- Error Loading Data: `fetchSheetData()` failed. Check network, sheet permission, and that `SHEET_ID` is correct. Use the **Retry** button.  
- Missing PDK/options: the app attempts to detect the PDK header; ensure Google Sheet headers include "Name of your PDK" or similar. See header-detection block in `App.tsx`.  
- PDF export blocked: allow popups; the download uses a new window + print call.

---

## 9. FAQ (practical)

- Q: Where does data come from?  
  A: Google Sheet identified by `SHEET_ID` in `App.tsx` (gviz/tq JSON).
- Q: How often does the app refresh data?  
  A: The app calls `fetchSheetData()` on mount and repeats every 10 seconds (see interval in `App.tsx`).

---

## 10. Security & Privacy (notes)

- The dashboard exposes aggregated survey results. Avoid attaching raw exports to public channels.  
- Access control: session keys `assignedPDK` and `isAdmin` determine visible data. Admins have broader visibility.

---

## 11. Support

- Email: rehabserve.care@gmail.com  
- Operating hours: Mon–Fri 08:00–17:00

---

## Appendix — Implementation Pointers (for admins / developers)

- Key files:  
  - `src/App.tsx`: Google Sheets fetch, parsing, `processRawData()` and main state (`processedDashboardData`, `kpiData`).  
  - `src/components/FloatingChatbot.tsx`: chatbot UI, `detectIntent`, templates, response guardrails.  
  - `src/components/QuestionBreakdown.tsx`: question table and `Download PDF` implementation.
- Change sheet ID: edit `SHEET_ID` in `src/App.tsx`.  
- Change fetch interval: edit the `setInterval(fetchSheetData, 10000)` call in `App.tsx`.  
- To modify quick buttons or responses: edit `getSuggestedQuestions()` and `getBotResponse()` in `FloatingChatbot.tsx`.

---

## Notes & Best Practices
- Use single-intent chatbot queries for consistent replies.  
- Attach CSV to reports when recipients need editable data.  
- Contact the system admin for PDK assignment or access changes.

