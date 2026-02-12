# RehabServE — Project Documentation

**Version:** 1.0  
**Date:** 2026-01-21  
**Audience:** Academic reviewers, management, and reporting stakeholders

---

## 1. Project Objectives and Goals

- Provide a clinical analytics platform for rehabilitation centres (PDKs)
- Ingest survey responses and compute RehabServE Index and dimension scores (0–7)
- Visualise trends and dimension breakdowns for decision-making
- Offer concise AI-informed recommendations via RehabBot
- Support CSV and PDF exports for reporting

---

## 2. Scope and Limitations

### 2.1 In Scope

- Dashboard visualisations (gauges, charts, scorecards)
- RehabBot chatbot with single-intent responses
- Google Sheets as data source
- PDK-level filtering and admin view
- Export to CSV and PDF

### 2.2 Out of Scope / Limitations

- No dedicated backend or database
- Data refresh depends on Google Sheets availability
- Client-side processing only; large datasets may affect performance
- PDK list and dimension mappings are configured in code

---

## 3. Project Timeline and Milestones

*(To be updated by project owners)*

| Phase | Description |
|-------|-------------|
| **Phase 1** | Core dashboard and data pipeline |
| **Phase 2** | RehabBot chatbot and quick buttons |
| **Phase 3** | Export (CSV, PDF) and scorecard |
| **Phase 4** | Deployment and user acceptance |

---

## 4. Tools, Technologies, and Methodologies

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| Icons | Lucide React |
| PDF | jsPDF, html2canvas |
| Email | EmailJS |
| Data Source | Google Sheets (gviz/tq) |
| Deployment | Firebase Hosting, Cloudflare Pages, InfinityFree |

---

*See also: `TECHNICAL_GUIDE.md` for documentation index.*
