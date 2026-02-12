# RehabServE — Technical Documentation

**Version:** 1.0  
**Date:** 2026-01-21  
**Audience:** Developers, system administrators, and future maintainers

---

## 1. System Architecture

### 1.1 Frontend

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| Icons | Lucide React |

### 1.2 Data Source

- **Google Sheets** (gviz/tq JSON) — fetched client-side
- No dedicated backend; all processing runs in the browser

### 1.3 Data Flow

```
Google Sheet (gviz/tq JSON)
  → fetchSheetData() in App.tsx
  → parse raw JSON
  → processRawData()
  → processedDashboardData, kpiData state
  → visualisations + RehabBot
```

---

## 2. API Documentation (Data Endpoints & Integrations)

### 2.1 Google Sheets Integration

| Property | Value |
|----------|-------|
| **Endpoint** | `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json` |
| **Configuration** | `SHEET_ID` in `src/App.tsx` (line ~20) |
| **Filtering** | Optional PDK filter via `buildGoogleSheetUrl(pdkFilter, pdkColumnName)` |
| **Format** | Google Visualization API JSON (gviz/tq) |

### 2.2 EmailJS (Contact Form)

- Used for Contact Support form submissions
- Configuration: see `EMAILJS_SETUP.md`

---

## 3. Code Structure and Configuration

### 3.1 Project Layout

```
src/
├── App.tsx              # Entry, fetch, processRawData(), state
├── main.tsx             # React root
├── index.css            # Global styles
├── vite-env.d.ts        # Vite env types
├── components/
│   ├── FloatingChatbot.tsx   # RehabBot UI, detectIntent, getBotResponse
│   ├── QuestionBreakdown.tsx # Scorecard table, Download PDF
│   ├── LandingPage.tsx      # Login / PDK entry
│   ├── Sidebar.tsx          # Navigation
│   ├── Footer.tsx
│   ├── AboutUs.tsx, ContactUs.tsx
│   ├── AIInsightsPanel.tsx
│   ├── BarChart.tsx, DonutChart.tsx, GaugeChart.tsx, etc.
│   └── ...
└── utils/
    └── exportUtils.ts   # CSV/PDF export helpers
```

### 3.2 Key Configuration Points

| Item | Location | Description |
|------|----------|-------------|
| `SHEET_ID` | `src/App.tsx` | Google Sheet ID for data source |
| Fetch interval | `App.tsx` | `setInterval(fetchSheetData, 10000)` — 10 seconds |
| PDK list | `App.tsx` | `PDK_LIST` array |
| Dimension mappings | `App.tsx` | `dimensionMappings`, `OLD_TO_NEW_DIMENSION` |
| Quick buttons / responses | `FloatingChatbot.tsx` | `getSuggestedQuestions()`, `getBotResponse()` |

---

## 4. Security and Authentication Design

### 4.1 Access Control

| Session Key | Purpose |
|-------------|---------|
| `assignedPDK` | Limits visible data to that PDK |
| `isAdmin` | Enables PDK selector and "All PDKs" view |

- Stored in `sessionStorage`
- Client-side only; treat as UI state, not strong authentication

### 4.2 Security Notes

- Use HTTPS in production
- Do not commit secrets or API keys
- Avoid attaching raw exports to public channels

---

## 5. Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run linter
npm run deploy   # Build and deploy (Firebase)
```

---

*See also: `TECHNICAL_GUIDE.md` for documentation index, `USER_MANUAL.md` for implementation pointers.*
