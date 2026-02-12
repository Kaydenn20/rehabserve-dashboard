# RehabServE — Process Documentation

**Version:** 1.0  
**Date:** 2026-01-21  
**Audience:** Operations staff, administrators, and maintainers

---

## 1. Data Collection and Analytics Workflow

1. **Data entry:** Respondents complete surveys; responses are stored in a Google Sheet.
2. **Sheet structure:** Headers must include PDK identifier (e.g. "Name of your PDK") and question columns mapped in `EXCEL_COLUMN_TO_QUESTION_MAP`.
3. **Fetch:** App calls `fetchSheetData()` on load and every 10 seconds.
4. **Processing:** `processRawData()` computes:
   - RehabServE Index (overall)
   - Dimension scores (0–7)
   - Trend (percent change vs previous index)
5. **Display:** Dashboard and RehabBot consume `processedDashboardData` and `kpiData`.

---

## 2. User Access and Role Management Process

| Role | Capabilities |
|------|--------------|
| **General user** | View dashboard and exports for assigned PDK |
| **Staff** | Use insights and recommended actions |
| **Administrator** | PDK selector, "All PDKs" view, manage exports |

**PDK assignment:** Handled outside the app (admin process). Users enter PDK access code or request access via landing page.

---

## 3. Standard Operating Procedures (SOPs)

### 3.1 Changing the Data Source

1. Obtain the new Google Sheet ID.
2. Edit `SHEET_ID` in `src/App.tsx`.
3. Ensure sheet is published or accessible (gviz/tq).
4. Verify column headers match expected names.

### 3.2 Adding or Updating PDKs

1. Edit `PDK_LIST` in `src/App.tsx`.
2. Update `PDK_NAME_MAP` if sheet uses different PDK names.
3. Rebuild and redeploy.

### 3.3 Modifying Chatbot Quick Buttons or Responses

1. Edit `getSuggestedQuestions()` in `FloatingChatbot.tsx` for buttons.
2. Edit `getBotResponse()` and `detectIntent()` for responses.
3. Test single-intent mapping and anti-repetition behaviour.

### 3.4 Changing Fetch Interval

1. Edit `setInterval(fetchSheetData, 10000)` in `App.tsx`.
2. Adjust value (milliseconds) as needed.

---

## 4. System Maintenance and Update Procedures

### 4.1 Development Setup

```bash
npm install
npm run dev
```

### 4.2 Build for Production

```bash
npm run build
```

### 4.3 Deploy (Firebase)

```bash
npm run deploy
# or: npm run firebase:deploy
```

### 4.4 Linting

```bash
npm run lint
```

### 4.5 Recommended Maintenance

- Run linter before commits
- Test data fetch after sheet structure changes
- Verify PDF export after UI changes
- Check `debug_output.txt` for diagnostics during development

---

*See also: `TECHNICAL_GUIDE.md` for documentation index, `TECHNICAL_DOCUMENTATION.md` for architecture details.*
