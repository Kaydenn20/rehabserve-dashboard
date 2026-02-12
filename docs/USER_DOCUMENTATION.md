# RehabServE — User Documentation

**Version:** 1.0  
**Date:** 2026-01-21  
**Audience:** Rehabilitation centre staff, administrators, and general end users

---

## 1. User Manual (How to Use Dashboards & Features)

### 1.1 Purpose of RehabServE

RehabServE is a clinical analytics platform that:
- Ingests survey responses from Google Sheets
- Computes RehabServE Index and dimension scores (0–7)
- Visualises trends and dimension breakdowns
- Provides concise AI-informed recommendations via RehabBot
- Supports CSV and PDF exports for reporting

### 1.2 Key Features

| Feature | Description |
|---------|-------------|
| **RehabServE Index** | Overall metric computed from question averages |
| **Dimension scores** | Per-dimension scores (0–7) |
| **Trend indicator** | Improving / Declining / Stable (percent change vs previous index) |
| **Dimension comparison** | Ranked dimension names |
| **Dimension score breakdown** | Numeric scores per dimension |
| **Question scorecard** | Question-level table with Download PDF |
| **RehabBot** | Floating chatbot with quick-action buttons |
| **Data refresh** | Automatic refresh from Google Sheets every 10 seconds |

### 1.3 Interface & Controls

**Main navigation**
- **Dashboard** — View metrics and charts
- **About RehabServE** — System information
- **Contact Support** — Submit support requests

**Floating chatbot quick buttons (bottom-left)**
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

**Export options**
- **Download PDF** — Opens print window for scorecard
- **CSV export** — Dimension scores and question scores

### 1.4 Dashboard Sidebar and Sections

The sidebar is the main navigation within the Dashboard. It appears on the left (fixed on desktop, slide-out on mobile) and lists five sections that switch the main content area.

**Sidebar behaviour**
- **Desktop (≥1024px):** Sidebar is always visible.
- **Mobile (<1024px):** Sidebar is hidden; tap the menu button (top-left) to open it as an overlay. Selecting a section closes it.
- **Active section:** Highlighted with a red left border and chevron.
- **Filtering:** All sections respect the PDK selector and respondent group filter in the header.

#### 1.4.1 Dashboard Overview

**Icon:** Layout dashboard  
**Purpose:** High-level performance summary.

| Content | Description |
|---------|-------------|
| **Key Performance Indicators** | RehabServE Index (0–7), best performing dimension, total respondents |
| **Respondent Groups Distribution** | Donut chart by respondent category (e.g. Staff, Trainees) |
| **Dimension Performance Breakdown** | Bar chart of all six dimensions |
| **AI-Powered Insights** | AI-generated insights and recommendations |

#### 1.4.2 Dimensions Analysis

**Icon:** Bar chart  
**Purpose:** Detailed view of the six service dimensions.

| Content | Description |
|---------|-------------|
| **Dimensional Performance Overview** | Horizontal bar chart of dimension scores |
| **Radar Chart** | Dimension balance across all six dimensions |
| **Gauge Chart** | Dimension scores as gauges |
| **Performance Comparison** | Funnel chart for top vs bottom dimensions |

**Dimensions:** Trainee Orientation, Performance Orientation, Competitor Orientation, Long-term Focus, Inter-functional Coordination, Employee Orientation.

#### 1.4.3 Scorecard

**Icon:** File text  
**Purpose:** Question-level scores and printable report.

| Content | Description |
|---------|-------------|
| **Question Breakdown** | Table of all 38 questions with scores, question IDs (TO1, PO1, etc.), and dimensions |
| **Download PDF** | Button to open print dialog for the scorecard |

Shows PDK context and total respondents.

#### 1.4.4 Respondent Analysis

**Icon:** Users  
**Purpose:** Analysis by respondent group.

| Content | Description |
|---------|-------------|
| **Group Performance Comparison** | Stacked bar chart comparing dimension scores across respondent groups (e.g. Staff vs Trainees) |
| **Respondent Distribution** | Donut chart of respondent group proportions |

#### 1.4.5 Health Outcomes

**Icon:** Heart  
**Purpose:** Trainee health outcome analytics.

| Content | Description |
|---------|-------------|
| **Trainee Health Outcome Analytics** | Chart showing trainee health improvements and outcomes, powered by AI analytics |

---

## 2. Step-by-Step Guides

### 2.1 Login

1. Open the application URL provided by your organisation.
2. If you have no assigned PDK, the landing page prompts you to request access or enter a PDK access code.
3. After login, session keys are stored. Admins see the PDK selector and "All PDKs" option.

### 2.2 Logout

1. Click **Exit** (top-right).
2. Session keys are removed and you return to the landing page.

### 2.3 View Dashboard

1. Open the app.
2. Click **Dashboard**.

### 2.4 Select PDK (Admin only)

1. Use the PDK selector in the header.
2. Choose the desired PDK or "All PDKs".

### 2.5 Generate Performance Snapshot

1. Open the chatbot (bottom-left).
2. Click **Performance snapshot**.

### 2.6 Export CSV

1. Go to Export controls.
2. Click **Dimension scores (CSV)** or **Question scores (CSV)**.

### 2.7 Export PDF

1. Go to Scorecard.
2. Click **Download PDF**.
3. Allow popups if prompted (opens print window).

---

## 3. FAQs (Common Issues & Solutions)

| Question | Answer |
|----------|--------|
| Where does data come from? | Google Sheet identified by `SHEET_ID` in the application. Data is fetched in gviz/tq JSON format. |
| How often does the app refresh data? | On load and every 10 seconds. |
| Error Loading Data? | The fetch failed. Check your network connection and try the **Retry** button. Contact your admin if it persists. |
| Missing PDK options? | Ensure your Google Sheet has the correct headers. Contact your system admin. |
| PDF export blocked? | Allow popups in your browser; the download uses a new window and print call. |
| Who manages PDK assignment? | Contact the system admin or rehabserve.care@gmail.com. |

---

## 4. Support

- **Email:** rehabserve.care@gmail.com
- **Operating hours:** Mon–Fri 08:00–17:00

---

*See also: `USER_MANUAL.md` for detailed implementation notes, `TECHNICAL_GUIDE.md` for documentation index.*
