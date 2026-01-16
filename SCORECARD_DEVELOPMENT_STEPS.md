# Development Steps for Auto-Generated RehabServE Scorecard

## Overview

This document outlines the systematic development process for the auto-generated RehabServE Scorecard feature, which automatically generates comprehensive performance scorecards from survey data collected via Google Forms and stored in Google Sheets.

---

## Step 1: Data Structure Design and Mapping

### 1.1 Question-to-Dimension Mapping
**Objective**: Establish a hierarchical mapping system to categorize 38 survey questions into 6 service excellence dimensions.

**Implementation**:
- Created `QUESTION_ID_TO_DIMENSION` mapping dictionary mapping question IDs (TO1-TO6, PO1-PO6, CO1-CO6, LO1-LO8, IO1-IO6, EO1-EO6) to their corresponding dimensions
- Defined 6 core dimensions:
  - Trainee Orientation (TO1-TO6)
  - Performance Orientation (PO1-PO6)
  - Competitor Orientation (CO1-CO6)
  - Long-term Focus (LO1-LO8)
  - Inter-functional Coordination (IO1-IO6)
  - Employee Orientation (EO1-EO6)

**Code Location**: `App.tsx` lines 194-241

### 1.2 Excel Column to Question Mapping
**Objective**: Map Google Sheets column positions to question identifiers for accurate data extraction.

**Implementation**:
- Created `EXCEL_COLUMN_TO_QUESTION_MAP` dictionary mapping Excel column letters (X through BI) to question numbers and question IDs
- Implemented helper functions:
  - `excelColumnToIndex()`: Converts column letters to 0-based indices
  - `indexToExcelColumn()`: Converts indices back to column letters
  - `getQuestionInfo()`: Retrieves question information from column letters
  - `getQuestionInfoByIndex()`: Retrieves question information from column indices

**Code Location**: `App.tsx` lines 115-192

### 1.3 Question Description Database
**Objective**: Create a comprehensive knowledge base of question descriptions for scorecard display.

**Implementation**:
- Created `QUESTION_DESCRIPTIONS` dictionary containing detailed descriptions for all 38 questions
- Each description explains what the question measures in the context of rehabilitation service excellence
- Descriptions support both English and Malay languages

**Code Location**: `QuestionBreakdown.tsx` lines 12-57

---

## Step 2: Data Collection and Processing Pipeline

### 2.1 Real-time Data Fetching
**Objective**: Implement automatic data retrieval from Google Sheets with real-time updates.

**Implementation**:
- Developed `fetchSheetData()` function that:
  - Connects to Google Sheets API using gviz/tq endpoint
  - Fetches data in JSON format
  - Parses Google Sheets' specific data structure
  - Handles date parsing for Google's Date() string format
  - Implements error handling for network failures
- Configured automatic refresh every 10 seconds using `setInterval()`

**Code Location**: `App.tsx` lines 347-386

### 2.2 Data Parsing and Normalization
**Objective**: Convert raw Google Sheets data into structured format suitable for analysis.

**Implementation**:
- Parsed JSON response from Google Sheets API
- Extracted headers and maintained column order
- Converted row data into structured objects with header-based property access
- Implemented `parseGoogleSheetDate()` function to handle Google's Date() format
- Normalized numeric values and handled edge cases (null, undefined, empty strings)

**Code Location**: `App.tsx` lines 357-386

### 2.3 PDK Filtering System
**Objective**: Enable filtering of data by specific PDK (rehabilitation center) locations.

**Implementation**:
- Created `PDK_LIST` array with standardized PDK names
- Implemented `PDK_NAME_MAP` for mapping raw PDK names from sheets to standardized names
- Developed `buildGoogleSheetUrl()` function for server-side filtering (optional)
- Implemented client-side filtering in `processRawData()` function
- Added PDK selection dropdown in admin interface

**Code Location**: `App.tsx` lines 30-98, 414-448

---

## Step 3: Multi-Level Score Calculation Engine

### 3.1 Question-Level Score Calculation
**Objective**: Calculate average scores for each of the 38 individual questions.

**Implementation**:
- Iterated through all data rows and extracted scores for each question column
- Grouped scores by question ID (TO1, TO2, etc.)
- Calculated arithmetic mean for each question: `average = sum(scores) / count(scores)`
- Stored results in `questionScores` object with structure:
  ```typescript
  {
    questionId: string,
    questionNumber: number,
    dimension: string,
    score: number,
    count: number
  }
  ```

**Code Location**: `App.tsx` lines 501-600

### 3.2 Dimension-Level Score Aggregation
**Objective**: Aggregate question-level scores into dimension-level averages.

**Implementation**:
- Grouped questions by their assigned dimensions
- Collected all individual scores (not just averages) for each dimension
- Calculated dimension average: `dimensionScore = sum(allQuestionScores) / count(allQuestionScores)`
- Ensured accurate aggregation by using raw scores rather than pre-averaged question scores
- Created `dimensionScoresFromQuestions` object for dimension-level data

**Code Location**: `App.tsx` lines 602-627

### 3.3 Overall RehabServE Index Calculation
**Objective**: Calculate the overall performance index representing total service excellence.

**Implementation**:
- Calculated overall index as the mean of all dimension averages:
  ```typescript
  overallIndex = average(dimensionMeans)
  ```
- Converted to percentage: `percentage = (overallIndex / 7) * 100`
- Ensured statistical validity by using dimension means rather than raw scores
- Handled edge cases (empty data, NaN values)

**Code Location**: `App.tsx` lines 629-638

---

## Step 4: Scorecard Component Development

### 4.1 Component Architecture Design
**Objective**: Design the React component structure for scorecard rendering.

**Implementation**:
- Created `QuestionBreakdown` component as a functional React component
- Defined TypeScript interfaces:
  - `QuestionData`: Structure for individual question data
  - `QuestionBreakdownProps`: Component props interface
- Implemented component with props for:
  - `data`: Array of question data
  - `title`: Scorecard title
  - `pdk`: PDK name or "All PDKs"
  - `totalRespondents`: Number of survey respondents
  - `overallIndex`: Overall RehabServE Index
  - `aiSummary`: Optional AI-generated narrative summary

**Code Location**: `QuestionBreakdown.tsx` lines 1-86

### 4.2 Data Grouping and Organization
**Objective**: Organize question data by dimensions for structured display.

**Implementation**:
- Grouped questions by dimension using `dimensionGroups` object
- Calculated dimension averages for each group
- Sorted dimensions by the order they appear in the data (based on first question number)
- Maintained question order within each dimension

**Code Location**: `QuestionBreakdown.tsx` lines 198-220

### 4.3 Visual Design and Styling
**Objective**: Create a professional, print-ready scorecard layout.

**Implementation**:
- Designed table-based layout with fixed column widths:
  - Question ID column: 3rem
  - Question description column: 35rem
  - Score column: 5rem
  - Dimension average column: 4rem
- Implemented color-coding system:
  - Each dimension has distinct background colors for question IDs and scores
  - Color mapping: TO (yellow), PO (pink), CO (orange), LO (blue), IO (green), EO (peach)
- Created header section with:
  - RehabServE logo
  - Scorecard title with PDK name, respondent count, and date
  - Overall percentage display
  - Rating scale indicator (1-7)
- Designed footer with RehabServE Index display

**Code Location**: `QuestionBreakdown.tsx` lines 230-460

---

## Step 5: PDF Export Functionality

### 5.1 Print-to-PDF Implementation
**Objective**: Enable users to download scorecard as PDF document.

**Implementation**:
- Created `downloadPDF()` function using browser's native print functionality
- Opened new window with scorecard content
- Extracted all stylesheets from the main document
- Created print-optimized HTML document with:
  - Proper page setup (A4 size, 15mm margins)
  - Page break rules (avoid breaking within rows)
  - Print-specific CSS media queries
- Implemented automatic print dialog trigger
- Added window auto-close after printing

**Code Location**: `QuestionBreakdown.tsx` lines 89-188

### 5.2 Print Styling Optimization
**Objective**: Ensure scorecard renders correctly in PDF format.

**Implementation**:
- Added `@media print` CSS rules for:
  - Page size and margins
  - Page break controls
  - Background color preservation
  - Border and spacing adjustments
- Used `page-break-inside: avoid` for table rows to prevent splitting
- Ensured proper font rendering and sizing for print

**Code Location**: `QuestionBreakdown.tsx` lines 125-147

---

## Step 6: Integration with Main Application

### 6.1 Data Flow Integration
**Objective**: Connect scorecard component to main data processing pipeline.

**Implementation**:
- Integrated `QuestionBreakdown` component into `App.tsx`
- Passed processed question data from `processRawData()` function
- Connected to PDK filtering system
- Linked to overall index calculation
- Ensured real-time updates when new data arrives

**Code Location**: `App.tsx` lines 898-915

### 6.2 Navigation and Access Control
**Objective**: Provide user interface for accessing scorecard view.

**Implementation**:
- Added "Scorecard" section to sidebar navigation
- Implemented section-based routing using `activeSection` state
- Created full-screen scorecard view with proper layout
- Integrated with PDK access control system
- Added logout functionality

**Code Location**: `App.tsx` lines 898-915, 737-796

---

## Step 7: Real-time Updates and Data Synchronization

### 7.1 Automatic Refresh Mechanism
**Objective**: Ensure scorecard displays latest data automatically.

**Implementation**:
- Configured data fetching interval (10 seconds)
- Implemented `useEffect` hook to trigger data reprocessing when:
  - New data arrives from Google Sheets
  - PDK filter changes
  - Sheet headers update
- Ensured scorecard component re-renders with updated data

**Code Location**: `App.tsx` lines 710-715, 388-708

### 7.2 State Management
**Objective**: Manage component state for efficient updates.

**Implementation**:
- Used React `useState` hooks for:
  - Raw sheet data
  - Processed dashboard data
  - KPI data
  - Selected PDK filter
- Implemented `useEffect` dependencies to trigger updates only when necessary
- Optimized re-rendering to prevent unnecessary calculations

**Code Location**: `App.tsx` lines 308-320, 336-345

---

## Step 8: Metadata and Contextual Information

### 8.1 Header Information Generation
**Objective**: Display contextual metadata in scorecard header.

**Implementation**:
- Generated current date string in "Month Year" format
- Calculated overall percentage from overall index
- Formatted PDK name (or "All PDKs" for aggregate view)
- Displayed total respondent count
- Created standardized title format: `RehabServE Scorecard {PDK}_n={count}_{date}`

**Code Location**: `QuestionBreakdown.tsx` lines 222-228, 292-333

### 8.2 Dimension Information Display
**Objective**: Show dimension codes and full names for clarity.

**Implementation**:
- Created `DIMENSION_INFO` mapping with dimension codes and full names
- Displayed dimension averages at the end of each dimension section
- Used color-coding to visually distinguish dimensions

**Code Location**: `QuestionBreakdown.tsx` lines 59-67, 339-413

---

## Step 9: Quality Assurance and Error Handling

### 9.1 Data Validation
**Objective**: Ensure data integrity and handle edge cases.

**Implementation**:
- Added validation for empty data arrays
- Handled missing question data gracefully
- Implemented fallback values for missing scores
- Added error messages for data loading failures
- Validated numeric values before calculations

**Code Location**: `QuestionBreakdown.tsx` lines 190-196, `App.tsx` lines 484-495

### 9.2 Error Handling
**Objective**: Provide user feedback for errors and edge cases.

**Implementation**:
- Added try-catch blocks in PDF generation
- Implemented user-friendly error messages
- Handled popup blocker scenarios for PDF export
- Added console logging for debugging
- Graceful degradation when data is unavailable

**Code Location**: `QuestionBreakdown.tsx` lines 184-187, 97-100

---

## Step 10: Testing and Refinement

### 10.1 Visual Testing
**Objective**: Ensure scorecard renders correctly across different scenarios.

**Testing Scenarios**:
- Single PDK view
- All PDKs aggregate view
- Different respondent counts
- Various data completeness levels
- PDF export functionality
- Print preview accuracy

### 10.2 Data Accuracy Validation
**Objective**: Verify calculation correctness.

**Validation Checks**:
- Question-level averages match manual calculations
- Dimension averages correctly aggregate question scores
- Overall index equals mean of dimension averages
- Percentage conversion accuracy
- Response count accuracy

### 10.3 Performance Optimization
**Objective**: Ensure efficient rendering and updates.

**Optimizations**:
- Memoized calculations where possible
- Efficient data structure for lookups
- Minimized re-renders through proper React patterns
- Optimized PDF generation process

---

## Technical Specifications

### Data Flow Architecture
```
Google Sheets → fetchSheetData() → Raw Data Parsing → 
processRawData() → Question-Level Scores → Dimension Scores → 
Overall Index → QuestionBreakdown Component → PDF Export
```

### Key Algorithms

1. **Score Calculation Algorithm**:
   ```
   FOR each question:
     scores = collect all responses for question
     average = sum(scores) / count(scores)
   
   FOR each dimension:
     allScores = collect all scores from dimension's questions
     dimensionAverage = sum(allScores) / count(allScores)
   
   overallIndex = average(all dimensionAverages)
   ```

2. **Data Grouping Algorithm**:
   ```
   FOR each question in data:
     dimension = getDimension(question.questionId)
     dimensionGroups[dimension].push(question)
   
   FOR each dimension:
     sort questions by questionNumber
     calculate dimensionAverage
   ```

### Component Dependencies
- React 18+ for component framework
- TypeScript for type safety
- Tailwind CSS for styling
- Browser Print API for PDF generation

---

## Conclusion

The auto-generated RehabServE Scorecard represents a comprehensive solution for transforming raw survey data into actionable performance reports. The development process involved systematic implementation of data processing, score calculation, visualization, and export functionality, resulting in a professional, real-time scorecard system that supports evidence-based decision-making in rehabilitation service excellence.












