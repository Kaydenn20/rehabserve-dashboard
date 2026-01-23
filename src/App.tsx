import { useState, useEffect } from 'react';
import { AlertCircle, Shield, Filter, LogOut, Building2, ChevronDown, Activity, TrendingUp, Users, Award, Target, BarChart3, Sparkles, Layers, Radar, TrendingDown, UserCheck, HeartPulse, PieChart } from 'lucide-react';
import HorizontalBar from './components/HorizontalBar';
import RadarChart from './components/RadarChart';
import GaugeChart from './components/GaugeChart';
import StackedBarByGroup from './components/StackedBarByGroup';
import FunnelChart from './components/FunnelChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import CompactDonutChart from './components/CompactDonutChart';
import QuestionBreakdown from './components/QuestionBreakdown';
import FloatingChatbot from './components/FloatingChatbot';
import AIInsightsPanel from './components/AIInsightsPanel';
import HealthOutcomesChart from './components/HealthOutcomesChart';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';


const SHEET_ID = "1ZFX7Hy-Hinw1rA-mkpVwfUBQLV1IoHYXnc0CTFVkhqU";


const dimensionMappings = {
  'Trainee Orientation': { value: 'training_orientation'},
  'Performance Orientation': { value: 'performance_orientation'},
  'Competitor Orientation': { value: 'competitor_orientation' },
  'Long-term Focus': { value: 'long_term_focus'},
  'Inter-functional Coordination': { value: 'inter_functional_coordination' },
  'Employee Orientation': { value: 'employee_orientation' },
};

// Hardcoded list of PDKs (update values to match sheet values exactly)
const PDK_LIST: { value: string; label: string }[] = [
  { value: 'PDK Batu Kawa', label: 'PDK Batu Kawa' },
  { value: 'PDK Bau', label: 'PDK Bau' },
  { value: 'PDK Betong', label: 'PDK Betong' },
  { value: 'PDK Borneo Highland', label: 'PDK Borneo Highland' },
  { value: 'PDK Julau', label: 'PDK Julau' },
  { value: 'PDK KK', label: 'PDK KK' },
  { value: 'PDK Morsjaya Miri', label: 'PDK Morsjaya Miri' },
  { value: 'PDK Nur Quseh Sibu', label: 'PDK Nur Quseh Sibu' },
  { value: 'PDK Penrissen', label: 'PDK Penrissen' },
  { value: 'PDK Pibalqis Miri', label: 'PDK Pibalqis Miri' },
  { value: 'PDK Putrajaya', label: 'PDK Putrajaya' },
  { value: 'PDK Sadong Jaya', label: 'PDK Sadong Jaya' },
  { value: 'PDK Saratok', label: 'PDK Saratok' },
  { value: 'PDK Sarikei', label: 'PDK Sarikei' },
  { value: 'PDK Seberang Jaya', label: 'PDK Seberang Jaya' },
  { value: 'PDK Sebuyau', label: 'PDK Sebuyau' },
  { value: 'PDK Sentuhan Kasih Kuching', label: 'PDK Sentuhan Kasih Kuching' },
  { value: 'PDK Sinar Putrajaya', label: 'PDK Sinar Putrajaya' },
  { value: 'PDK Sri Aman', label: 'PDK Sri Aman' },
  { value: 'PDK Sunflower Miri', label: 'PDK Sunflower Miri' },
  { value: 'PDK Sungai Tiram', label: 'PDK Sungai Tiram' },
  { value: 'PDK Tampaioli', label: 'PDK Tampaioli' },
  { value: 'PDK Tuaran', label: 'PDK Tuaran' },
];

// Mapping for respondent group display names
const RESPONDENT_GROUP_LABEL_MAP: { [key: string]: string } = {
  'Staff / Staf': 'Staff',
  // Add other mappings if needed for other unique values in your sheet
};

// Mapping for PDK names from Google Sheet to standardized PDK names
// Google Form question 6a = "Name of your PDK / Nama PDK", Google Sheet column BS
// Maps actual PDK names found in Google Sheet column BS (like "Julau", "Sebuyau", "Saratok") to standardized PDK names
const PDK_NAME_MAP: { [key: string]: string } = {
  'Sebuyau': 'PDK Sebuyau',
  'Julau': 'PDK Julau',
  'Saratok': 'PDK Saratok',
  // Add more mappings as needed: 'Raw PDK Name from Sheet': 'Standardized PDK Name'
};

// Helper function to build Google Sheets URL with optional PDK filter
// If pdkFilter is provided, it will filter rows where the PDK column matches
// Google Form question 6a = "Name of your PDK / Nama PDK", Google Sheet column BS
// Example usage for PDK Julau:
//   buildGoogleSheetUrl('PDK Julau', '6a. Name of your PDK / Nama PDK')
//   or use column letter: buildGoogleSheetUrl('PDK Julau', 'BS') // PDK column is column BS
const buildGoogleSheetUrl = (pdkFilter?: string, pdkColumnName?: string): string => {
  const baseUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
  
  if (pdkFilter && pdkColumnName && pdkFilter !== 'all') {
    // Use Google Sheets query language to filter by PDK
    // Find the raw PDK name from the filter (reverse lookup in PDK_NAME_MAP)
    const rawPdkName = Object.keys(PDK_NAME_MAP).find(key => PDK_NAME_MAP[key] === pdkFilter) || pdkFilter;
    // Escape single quotes in the PDK name for SQL query
    const escapedPdkName = rawPdkName.replace(/'/g, "''");
    const escapedPdkFilter = pdkFilter.replace(/'/g, "''");
    // Build WHERE clause - try both raw name and standardized name
    // Note: Google Sheets query uses column letters (A, B, C...) or column labels
    const query = `select * where '${pdkColumnName}' = '${escapedPdkName}' or '${pdkColumnName}' = '${escapedPdkFilter}'`;
    return `${baseUrl}&tq=${encodeURIComponent(query)}`;
  }
  
  return baseUrl;
};

// Default URL fetches all data (filtering happens client-side)
// To fetch only PDK Julau, you could use:
// const GOOGLE_SHEET_URL = buildGoogleSheetUrl('PDK Julau', '6a. Name of your PDK / Nama PDK');
const GOOGLE_SHEET_URL = buildGoogleSheetUrl();

// --- MAPPING OF OLD TO NEW DIMENSION NAMES (insert after dimensionMappings definition) ---
const OLD_TO_NEW_DIMENSION = {
  'Training Excellence': 'Trainee Orientation',
  'Service Excellence': 'Performance Orientation',
  'Competitive Response': 'Competitor Orientation',
  'Long-term Planning': 'Long-term Focus',
  'Information Distribution': 'Inter-functional Coordination',
  'Employee Development': 'Employee Orientation',
};

// --- EXCEL COLUMN TO QUESTION MAPPING ---
// Maps Excel column letters to question numbers and question IDs
// Updated range: X to BQ (38 questions)
const EXCEL_COLUMN_TO_QUESTION_MAP: { [key: string]: { questionNumber: number; questionId: string } } = {
  'X': { questionNumber: 1, questionId: 'TO1' },
  'Y': { questionNumber: 2, questionId: 'TO2' },
  'Z': { questionNumber: 3, questionId: 'TO3' },
  'AA': { questionNumber: 4, questionId: 'TO4' },
  'AB': { questionNumber: 5, questionId: 'TO5' },
  'AC': { questionNumber: 6, questionId: 'TO6' },
  'AD': { questionNumber: 7, questionId: 'PO1' },
  'AE': { questionNumber: 8, questionId: 'PO2' },
  'AF': { questionNumber: 9, questionId: 'PO3' },
  'AG': { questionNumber: 10, questionId: 'PO4' },
  'AH': { questionNumber: 11, questionId: 'PO5' },
  'AI': { questionNumber: 12, questionId: 'PO6' },
  'AJ': { questionNumber: 13, questionId: 'CO1' },
  'AK': { questionNumber: 14, questionId: 'CO2' },
  'AL': { questionNumber: 15, questionId: 'CO3' },
  'AM': { questionNumber: 16, questionId: 'CO4' },
  'AN': { questionNumber: 17, questionId: 'CO5' },
  'AO': { questionNumber: 18, questionId: 'CO6' },
  'AP': { questionNumber: 19, questionId: 'LO1' },
  'AQ': { questionNumber: 20, questionId: 'LO2' },
  'AR': { questionNumber: 21, questionId: 'LO3' },
  'AS': { questionNumber: 22, questionId: 'LO4' },
  'AT': { questionNumber: 23, questionId: 'LO5' },
  'AU': { questionNumber: 24, questionId: 'LO6' },
  'AV': { questionNumber: 25, questionId: 'LO7' },
  'AW': { questionNumber: 26, questionId: 'LO8' },
  'AX': { questionNumber: 27, questionId: 'IO1' },
  'AY': { questionNumber: 28, questionId: 'IO2' },
  'AZ': { questionNumber: 29, questionId: 'IO3' },
  'BA': { questionNumber: 30, questionId: 'IO4' },
  'BB': { questionNumber: 31, questionId: 'IO5' },
  'BC': { questionNumber: 32, questionId: 'IO6' },
  'BD': { questionNumber: 33, questionId: 'EO1' },
  'BE': { questionNumber: 34, questionId: 'EO2' },
  'BF': { questionNumber: 35, questionId: 'EO3' },
  'BG': { questionNumber: 36, questionId: 'EO4' },
  'BH': { questionNumber: 37, questionId: 'EO5' },
  'BI': { questionNumber: 38, questionId: 'EO6' },
};

// Helper function to convert Excel column letter to column index (0-based)
// Example: 'A' -> 0, 'B' -> 1, 'Z' -> 25, 'AA' -> 26, 'AB' -> 27
const excelColumnToIndex = (column: string): number => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result - 1; // Convert to 0-based index
};

// Helper function to get question info from Excel column letter
const getQuestionInfo = (column: string): { questionNumber: number; questionId: string } | null => {
  return EXCEL_COLUMN_TO_QUESTION_MAP[column] || null;
};

// Helper function to convert 0-based index to Excel column letter (A=0, B=1, ..., Z=25, AA=26, etc.)
const indexToExcelColumn = (index: number): string => {
  let result = '';
  let num = index + 1; // Convert to 1-based (A=1, B=2, etc.)
  
  while (num > 0) {
    num--; // Adjust for 0-based modulo calculation
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
};

// Helper function to get question info from column index (0-based)
const getQuestionInfoByIndex = (columnIndex: number): { questionNumber: number; questionId: string } | null => {
  // Convert 0-based index to Excel column letter (A=0, B=1, ..., Z=25, AA=26, etc.)
  const column = indexToExcelColumn(columnIndex);
  return getQuestionInfo(column);
};

// --- QUESTION ID TO DIMENSION MAPPING ---
// Maps question IDs (TO1, PO1, etc.) to their corresponding dimensions
const QUESTION_ID_TO_DIMENSION: { [key: string]: string } = {
  // Trainee Orientation (TO1-TO6)
  'TO1': 'Trainee Orientation',
  'TO2': 'Trainee Orientation',
  'TO3': 'Trainee Orientation',
  'TO4': 'Trainee Orientation',
  'TO5': 'Trainee Orientation',
  'TO6': 'Trainee Orientation',
  // Performance Orientation (PO1-PO6)
  'PO1': 'Performance Orientation',
  'PO2': 'Performance Orientation',
  'PO3': 'Performance Orientation',
  'PO4': 'Performance Orientation',
  'PO5': 'Performance Orientation',
  'PO6': 'Performance Orientation',
  // Competitor Orientation (CO1-CO6)
  'CO1': 'Competitor Orientation',
  'CO2': 'Competitor Orientation',
  'CO3': 'Competitor Orientation',
  'CO4': 'Competitor Orientation',
  'CO5': 'Competitor Orientation',
  'CO6': 'Competitor Orientation',
  // Long-term Focus (LO1-LO8)
  'LO1': 'Long-term Focus',
  'LO2': 'Long-term Focus',
  'LO3': 'Long-term Focus',
  'LO4': 'Long-term Focus',
  'LO5': 'Long-term Focus',
  'LO6': 'Long-term Focus',
  'LO7': 'Long-term Focus',
  'LO8': 'Long-term Focus',
  // Inter-functional Coordination (IO1-IO6)
  'IO1': 'Inter-functional Coordination',
  'IO2': 'Inter-functional Coordination',
  'IO3': 'Inter-functional Coordination',
  'IO4': 'Inter-functional Coordination',
  'IO5': 'Inter-functional Coordination',
  'IO6': 'Inter-functional Coordination',
  // Employee Orientation (EO1-EO6)
  'EO1': 'Employee Orientation',
  'EO2': 'Employee Orientation',
  'EO3': 'Employee Orientation',
  'EO4': 'Employee Orientation',
  'EO5': 'Employee Orientation',
  'EO6': 'Employee Orientation',
};

// Helper function to get dimension from question ID
const getDimensionFromQuestionId = (questionId: string): string | null => {
  return QUESTION_ID_TO_DIMENSION[questionId] || null;
};

// Helper function to get dimension from Excel column index (0-based)
// Excel column V = index 21 (0-based), and we need to map columns V through BG
const getDimensionFromExcelColumnIndex = (columnIndex: number): string | null => {
  // Excel column V is index 21 (0-based), BG is index 58
  // Get question info if column is in range V-BG
  const questionInfo = getQuestionInfoByIndex(columnIndex);
  if (questionInfo) {
    return getDimensionFromQuestionId(questionInfo.questionId);
  }
  return null;
};

// Helper to parse Google Sheet's specific Date() string format
const parseGoogleSheetDate = (dateString: string): Date => {
  // Expected format: Date(YYYY,M,D,H,M,S)
  const match = dateString.match(/Date\((\d{4}),(\d{1,2}),(\d{1,2}),(\d{1,2}),(\d{1,2}),(\d{1,2})\)/);
  if (match) {
    // Month is 0-indexed in JavaScript Date, so subtract 1
    return new Date(
      parseInt(match[1]), // Year
      parseInt(match[2]), // Month (0-indexed)
      parseInt(match[3]), // Day
      parseInt(match[4]), // Hour
      parseInt(match[5]), // Minute
      parseInt(match[6])  // Second
    );
  }
  // Fallback for unexpected formats, though we expect the above to match
  return new Date(dateString); // Try to parse directly if format doesn't match
};

function App() {
  // Check sessionStorage for assigned PDK and admin status on mount
  // Wrap in try-catch to handle cases where sessionStorage might not be available
  const [assignedPDK, setAssignedPDK] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('assignedPDK');
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('isAdmin') === 'true';
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
      return false;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard-overview');
  const [navSection, setNavSection] = useState<'dashboard' | 'about' | 'contact'>('dashboard');

  // State for selected respondent group from donut chart
  const [selectedRespondentGroup] = useState<string>('all');

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && navSection === 'dashboard') {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navSection]);

  // Close sidebar when navigating away from dashboard
  useEffect(() => {
    if (navSection !== 'dashboard') {
      setIsSidebarOpen(false);
    } else if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, [navSection]);

  const [rawSheetData, setRawSheetData] = useState<any[]>([]);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [processedDashboardData, setProcessedDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for dynamically generated respondent group options
  const [respondentGroupOptions, setRespondentGroupOptions] = useState<{ value: string; label: string; }[]>([{ value: 'all', label: 'All Groups' }]);
  const [pdkOptions, setPdkOptions] = useState<{ value: string; label: string; }[]>([{ value: 'all', label: 'All PDKs' }]);
  
  // State for selected PDK filter - use assigned PDK from session, or 'all' for admin
  const [selectedPdk, setSelectedPdk] = useState<string>(() => {
    if (isAdmin) return 'all';
    return assignedPDK || 'all';
  });

  // Handle PDK access granted from landing page
  const handlePDKAccessGranted = (pdkName: string, adminMode: boolean = false) => {
    if (adminMode) {
      setIsAdmin(true);
      setAssignedPDK(null);
      setSelectedPdk('all');
    } else {
      setIsAdmin(false);
      setAssignedPDK(pdkName);
      setSelectedPdk(pdkName);
    }
  };

  // Initial/default KPI data (will be updated by fetched data)
  const [kpiData, setKpiData] = useState({
    overallIndex: 6.43,
    trend: 2.3,
    bestDimension: { name: 'Trainee Information Distribution', score: 6.42 },
    lowestDimension: { name: 'Competitive Response', score: 6.14 },
    totalRespondents: 156
  });

  // Simple AI-style analysis object derived from KPI data (for dashboard & reporting)
  const [aiSummary, setAiSummary] = useState<string>('');

  // Function to fetch data from Google Sheet
  const fetchSheetData = () => {
    setIsLoading(true);
    setFetchError(null);
    
    fetch(GOOGLE_SHEET_URL)
      .then(res => {
        console.log("DEBUG: Fetch response status:", res.status); // DEBUG
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        console.log("DEBUG: RAW TEXT FROM GOOGLE SHEET (Before Parsing):");
        console.log(text); // Log the raw text directly

        // Adjust parsing logic for Google Sheet gviz/tq output
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}') + 1;
        
        if (jsonStartIndex === -1 || jsonEndIndex === 0) {
          throw new Error('Invalid response format from Google Sheets');
        }
        
        const jsonString = text.substring(jsonStartIndex, jsonEndIndex);

        try {
          const json = JSON.parse(jsonString);
          console.log("DEBUG: Parsed JSON object:", json); // DEBUG
          
          if (!json.table || !json.table.cols || !json.table.rows) {
            throw new Error('Invalid JSON structure from Google Sheets');
          }
          
          const headers = json.table.cols.map((col: any) => col.label || col.id);
          setSheetHeaders(headers); // Store headers to maintain column order
          const data = json.table.rows.map((row: any) => {
            const rowObject: { [key: string]: string | number | null } = {};
            headers.forEach((header: string, index: number) => {
              rowObject[header] = row.c[index] ? row.c[index].v : null;
            });
            return rowObject;
          });
          setRawSheetData(data);
          setIsLoading(false);
          console.log("DEBUG: Headers:", headers); // DEBUG
          console.log("DEBUG: rawSheetData after parsing (set to state):", data); // DEBUG
        } catch (error) {
          console.error("Error parsing sheet data:", error);
          setFetchError(error instanceof Error ? error.message : 'Failed to parse sheet data');
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error fetching sheet data:", error);
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch sheet data');
        setIsLoading(false);
      });
  };

  // Process raw data into dashboard-ready format
  useEffect(() => {
    console.log("DEBUG: useEffect rawSheetData.length:", rawSheetData.length); // DEBUG
    console.log("DEBUG: Full rawSheetData in useEffect:", rawSheetData); // Re-add DEBUG log

    if (rawSheetData.length > 0) { // Ensure headers and at least one data row exist
      // Get respondent group column header for data processing (but don't filter)
      const respondentGroupColHeader = '1. What is your relationship with the trainee? / Apakah hubungan anda dengan pelatih?';
      console.log("DEBUG: respondentGroupColHeader:", respondentGroupColHeader); // DEBUG

      if (rawSheetData[0].hasOwnProperty(respondentGroupColHeader)) {
        const uniqueGroupsFromData = Array.from(new Set(rawSheetData.map(row => row[respondentGroupColHeader] as string))).filter(group => group);
        console.log("DEBUG: rawSheetData.map(row => row[respondentGroupColHeader] as string) for groups:", rawSheetData.map(row => row[respondentGroupColHeader] as string)); // DEBUG
        console.log("DEBUG: uniqueGroupsFromData:", uniqueGroupsFromData); // DEBUG

        const generatedOptions = [
          { value: 'all', label: 'All Groups' },
          ...uniqueGroupsFromData.map(group => ({
            value: group,
            label: RESPONDENT_GROUP_LABEL_MAP[group] || group // Use mapped label or fallback to raw group
          }))
        ];
        console.log("DEBUG: generated respondentGroupOptions:", generatedOptions); // DEBUG
        setRespondentGroupOptions(generatedOptions);
      }

      // PDK options - Find PDK column by header (question 6a) or by column index BS (70 in 0-based)
      // Google Form question 6a = "Name of your PDK / Nama PDK", Google Sheet column BS
      let pdkColHeader = sheetHeaders.find(h => {
        const hLower = typeof h === 'string' ? h.toLowerCase() : '';
        return (hLower.includes('6a') && (hLower.includes('pdk') || hLower.includes('nama'))) ||
               hLower.includes('name of your pdk') ||
               hLower.includes('nama pdk');
      }) || '';
      
      // Fallback: If not found by header, try column index BS (70 in 0-based indexing)
      // BS = (B=2, S=19) = 2*26 + 19 - 1 = 70 (0-based)
      if (!pdkColHeader && sheetHeaders.length > 70) {
        pdkColHeader = sheetHeaders[70] || '';
      }
      
      // Final fallback: search for any header containing 'pdk'
      if (!pdkColHeader) {
        pdkColHeader = sheetHeaders.find(h => typeof h === 'string' && h.toLowerCase().includes('pdk')) || '';
      }
      
      setPdkOptions([{ value: 'all', label: 'All PDKs' }, ...PDK_LIST]);
      
      // Filter data rows by selected PDK
      let filteredDataRows = rawSheetData.slice(0);
      if (selectedPdk !== 'all' && pdkColHeader && rawSheetData[0].hasOwnProperty(pdkColHeader)) {
        // Filter rows where PDK value matches the selected standardized PDK name
        filteredDataRows = rawSheetData.filter(row => {
          const rawPdkName = String(row[pdkColHeader] || '').trim();
          if (!rawPdkName) return false;
          // Map Excel PDK name to standardized name, or use raw name if not in map
          const standardizedPdkName = PDK_NAME_MAP[rawPdkName] || rawPdkName;
          // Match if standardized name equals selected PDK, or if raw name equals selected PDK (for backward compatibility)
          return standardizedPdkName === selectedPdk || rawPdkName === selectedPdk;
        });
      }

      // Helper to map column headers to dimensions
      const getDimensionForColumn = (columnIndex: number) => {
        if (columnIndex >= 16 && columnIndex <= 35) return 'Trainee Orientation';
        if (columnIndex >= 36 && columnIndex <= 66) return 'Performance Orientation';
        if (columnIndex >= 67 && columnIndex <= 80) return 'Competitor Orientation';
        if (columnIndex >= 81 && columnIndex <= 95) return 'Long-term Focus';
        if (columnIndex >= 96 && columnIndex <= 110) return 'Inter-functional Coordination';
        if (columnIndex >= 111 && columnIndex <= 125) return 'Employee Orientation';
        return null;
      };

      // Prefer mapping by header text; fallback to column index ranges
      const getDimensionForHeader = (header: string) => {
        const h = (header || '').toLowerCase();
        // Keyword lists per dimension (expand as needed to match your sheet wording)
        const keywords: { [key: string]: string[] } = {
          'Trainee Orientation': ['training', 'latihan'],
          'Performance Orientation': ['service', 'perkhidmatan', 'servis', 'performance'],
          'Competitor Orientation': ['competitive', 'competit', 'competition', 'market response', 'respons', 'responsiveness', 'competitor'],
          'Long-term Focus': ['long-term', 'long term', 'planning', 'strategic', 'perancangan', 'focus'],
          'Inter-functional Coordination': ['information distribution', 'distribution of information', 'info distribution', 'communication', 'communications', 'maklumat', 'coordination', 'koordinasi', 'cross-functional'],
          'Employee Orientation': [
            'employee development', 'employees development', 'development of employee', 'development of employees',
            'staff development', 'pembangunan', 'pembangunan staf', 'pembangunan pekerja',
            'career development', 'competency', 'kompetensi', 'kemahiran', 'skill', 'skills', 'upskilling',
            'pegawai', 'kakitangan', 'human capital', 'talent development', 'employee orientation'
          ],
        };
        for (const [dim, list] of Object.entries(keywords)) {
          if (list.some(k => h.includes(k))) return dim;
        }
        return null;
      };

      const processRawData = (previousOverallIndex: number, dataRows: any[], selectedDimension: string, respondentGroupColHeader: string, headers: string[]) => {
        if (dataRows.length === 0) {
          return {
            overallIndex: 0,
            trend: 0,
            bestDimension: { name: 'N/A', score: 0 },
            lowestDimension: { name: 'N/A', score: 0 },
            totalRespondents: 0,
            dimensionsData: [],
            respondentGroups: {},
          };
        }

        const allScores: number[] = [];
        const dimensionScores: { [key: string]: number[] } = {};
        Object.keys(dimensionMappings).forEach(dim => dimensionScores[dim] = []);
        
        // Track individual question scores (T01, T02, P01, etc.)
        const questionScores: { [key: string]: number[] } = {};

        const respondentGroups: { [key: string]: number } = {};

        if (!dataRows[0].hasOwnProperty(respondentGroupColHeader)) {
          console.warn("Warning: Respondent Group column header not found. Donut chart may not display correctly.");
        }

        dataRows.forEach((row) => {
          // Process Respondent Group
          if (dataRows[0].hasOwnProperty(respondentGroupColHeader) && row[respondentGroupColHeader]) {
            const group = row[respondentGroupColHeader] as string;
            respondentGroups[group] = (respondentGroups[group] || 0) + 1;
          }

          // Process Likert-scale questions using headers array to maintain column order
          // This ensures column indices match Excel column positions
          headers.forEach((header, colIndex) => {
            if (!row.hasOwnProperty(header)) return; // Skip if header doesn't exist in row
            
            const cellValue = row[header];
            const parsed = typeof cellValue === 'number' ? cellValue : parseFloat(String(cellValue).split(/[^0-9.]+/)[0]);
            const score = Number.isFinite(parsed) ? parsed : NaN;
            
            // Use Excel column mapping first (primary method)
            // Excel column V = index 21, columns V-BG map to questions T01-E06
            let dimensionName = getDimensionFromExcelColumnIndex(colIndex);
            
            // Fallback to header text matching if Excel mapping doesn't apply
            if (!dimensionName) {
              dimensionName = getDimensionForHeader(header);
            }
            
            // Fallback to legacy column index ranges if both above fail
            if (!dimensionName) {
              dimensionName = getDimensionForColumn(colIndex);
            }

            if (dimensionName && !isNaN(score)) {
              if ((dimensionName in dimensionMappings)) {
                const dimKey = dimensionName as keyof typeof dimensionMappings;
                if (selectedDimension === 'all' || dimensionMappings[dimKey].value === selectedDimension) {
                  allScores.push(score);
                  dimensionScores[dimensionName].push(score);
                  
                  // Track individual question scores
                  const questionInfo = getQuestionInfoByIndex(colIndex);
                  if (questionInfo && questionInfo.questionId) {
                    if (!questionScores[questionInfo.questionId]) {
                      questionScores[questionInfo.questionId] = [];
                    }
                    questionScores[questionInfo.questionId].push(score);
                  }
                  
                  // Get question info for better logging
                  const questionId = questionInfo ? questionInfo.questionId : 'N/A';
                  console.log('DEBUG: Pushed score to dimension', { 
                    dimension: dimensionName, 
                    header, 
                    colIndex, 
                    excelColumn: questionInfo ? Object.keys(EXCEL_COLUMN_TO_QUESTION_MAP).find(k => 
                      EXCEL_COLUMN_TO_QUESTION_MAP[k].questionId === questionId
                    ) : 'N/A',
                    questionId,
                    score 
                  });
                }
              }
            } else if (!dimensionName && !isNaN(score)) {
              console.log('DEBUG: Unmapped numeric header', { header, colIndex, score });
            }
          });
        });

        const calculateAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((sum, s) => sum + s, 0) / arr.length : 0;

        // Process question-level data first to calculate accurate dimension scores
        const questionsData = Object.entries(questionScores).map(([questionId, scores]) => {
          const avgScore = calculateAverage(scores);
          const dimension = getDimensionFromQuestionId(questionId) || 'Unknown';
          // Find question number from mapping
          const mappedEntry = Object.entries(EXCEL_COLUMN_TO_QUESTION_MAP).find(
            ([, info]) => info.questionId === questionId
          );
          const questionNumber = mappedEntry ? mappedEntry[1].questionNumber : 0;
          
          return {
            questionId,
            questionNumber,
            dimension,
            score: avgScore,
            count: scores.length
          };
        }).sort((a, b) => {
          // Sort by dimension, then by question number
          const dimOrder = Object.keys(dimensionMappings);
          const dimCompare = dimOrder.indexOf(a.dimension) - dimOrder.indexOf(b.dimension);
          return dimCompare !== 0 ? dimCompare : a.questionNumber - b.questionNumber;
        });

        // Calculate dimension scores based on question-level data
        // Group questions by dimension and calculate average
        const dimensionScoresFromQuestions: { [key: string]: number[] } = {};
        questionsData.forEach(question => {
          if (!dimensionScoresFromQuestions[question.dimension]) {
            dimensionScoresFromQuestions[question.dimension] = [];
          }
          // Add each individual score from this question to the dimension
          // We need to get all scores for this question, not just the average
          const questionScoresArray = questionScores[question.questionId] || [];
          dimensionScoresFromQuestions[question.dimension].push(...questionScoresArray);
        });

        // Recalculate dimension scores from question-level data for accuracy
        const dimensionsData = Object.entries(dimensionMappings).map(([label, { value }]) => {
          // Use question-based scores if available, otherwise fall back to original dimension scores
          const scoresForDimension = dimensionScoresFromQuestions[label] || dimensionScores[label] || [];
          const current = calculateAverage(scoresForDimension);
          return {
            label,
            value,
            current,
            // benchmark removed
            previous: current - 0.1 // Placeholder, adjust as needed
          };
        });

        // Recalculate overall index from all question scores
        const allQuestionScores: number[] = [];
        Object.values(questionScores).forEach(scores => {
          allQuestionScores.push(...scores);
        });
       // Overall index = mean of all dimensions (the bars in HorizontalBar)
const dimensionMeans = dimensionsData.map(d => d.current).filter(v => !isNaN(v));
const overallIndex = dimensionMeans.length > 0
  ? calculateAverage(dimensionMeans)
  : 0;

        const sortedDimensions = [...dimensionsData].sort((a, b) => b.current - a.current);
        const bestDimension = sortedDimensions[0] || { name: 'N/A', score: 0 };
        const lowestDimension = sortedDimensions[sortedDimensions.length - 1] || { name: 'N/A', score: 0 };

        const totalRespondents = dataRows.length; // Total respondents is the count of filtered data rows
        
        console.log("DEBUG: Respondent Groups in processRawData:", respondentGroups); // DEBUG
        console.log("DEBUG: Dimension scores calculated from questions:", dimensionScoresFromQuestions); // DEBUG

        return {
          overallIndex,
          trend: (overallIndex - previousOverallIndex) * 100, // Calculate trend from previous overall index
          bestDimension: { name: bestDimension.label, score: bestDimension.current },
          lowestDimension: { name: lowestDimension.label, score: lowestDimension.current },
          totalRespondents,
          dimensionsData, 
          respondentGroups, // Ensure this is returned
          questionsData, // Individual question scores
        };
      };

      // Pass all data rows to processing functions (no dimension filter)
      const newProcessedData = processRawData(kpiData.overallIndex, filteredDataRows, 'all', respondentGroupColHeader, sheetHeaders);
      if (newProcessedData) {
        setProcessedDashboardData(newProcessedData);
        setKpiData(prev => ({
          ...prev,
          overallIndex: newProcessedData.overallIndex,
          bestDimension: newProcessedData.bestDimension,
          lowestDimension: newProcessedData.lowestDimension,
          totalRespondents: newProcessedData.totalRespondents,
          trend: newProcessedData.trend,
        }));

        // --- Generate a simple AI-style narrative summary for reporting ---
        const overall = newProcessedData.overallIndex.toFixed(2);
        const bestDim = newProcessedData.bestDimension;
        const lowDim = newProcessedData.lowestDimension;
        let riskLabel = '';
        if (newProcessedData.overallIndex >= 6) riskLabel = 'excellent overall performance';
        else if (newProcessedData.overallIndex >= 5) riskLabel = 'good but still has room for improvement';
        else if (newProcessedData.overallIndex >= 4) riskLabel = 'average and needs focused improvement';
        else riskLabel = 'low and requires immediate attention';

        const trendVal = newProcessedData.trend;
        let trendSentence = '';
        if (trendVal > 0.2) {
          trendSentence = `The performance trend is improving (+${trendVal.toFixed(2)}%), indicating positive changes in service delivery.`;
        } else if (trendVal > -0.2) {
          trendSentence = 'The performance trend is relatively stable. There is an opportunity to improve by focusing on weaker dimensions.';
        } else {
          trendSentence = `The performance trend is declining (${trendVal.toFixed(2)}%), suggesting that some recent changes may be negatively affecting outcomes.`;
        }

        const summaryLines: string[] = [];
        summaryLines.push(`The current RehabServE with AI Index is ${overall} out of 7.0, which reflects ${riskLabel}.`);
        summaryLines.push(trendSentence);
        if (bestDim?.name) {
          summaryLines.push(`The strongest dimension is ${bestDim.name} with an average score of ${bestDim.score.toFixed(2)}. This is an area of good practice that can be maintained and used as a model for other areas.`);
        }
        if (lowDim?.name) {
          summaryLines.push(`The main area that needs attention is ${lowDim.name}, which has the lowest average score of ${lowDim.score.toFixed(2)}. Targeted interventions and strategic planning in this dimension are recommended to enhance overall service quality.`);
        }
        summaryLines.push(`This analysis is based on responses from ${newProcessedData.totalRespondents} participants.`);

        setAiSummary(summaryLines.join('\n\n'));
      }
    }
  }, [rawSheetData, sheetHeaders, selectedPdk]);

  // Fetch data on component mount; refresh every 10s
  useEffect(() => {
    fetchSheetData();
    const intervalId = setInterval(fetchSheetData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Prepare data for DonutChart
  const respondentGroupsData = Object.entries(processedDashboardData?.respondentGroups || {}).map(([group, count]) => ({
    label: RESPONDENT_GROUP_LABEL_MAP[group] || group,
    value: count as number // Explicitly cast count to number
  }));
  console.log("DEBUG: Final respondentGroupsData for DonutChart:", respondentGroupsData); // DEBUG

  // Show landing page if no PDK is assigned and not admin
  if (!assignedPDK && !isAdmin) {
    return <LandingPage onAccessGranted={handlePDKAccessGranted} />;
  }

  // Navigation component for dashboard
  const Navigation = () => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: 'dashboard' | 'about' | 'contact') => {
      e.preventDefault();
      setNavSection(section);
      if (section === 'dashboard') {
        setActiveSection('dashboard-overview');
      }
    };

    return (
      <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center h-16 ${navSection === 'dashboard' ? 'justify-between' : 'relative'}`}>
            {/* Navigation Links - Left aligned on dashboard, centered on other pages */}
            {navSection === 'dashboard' ? (
              <div className="flex space-x-8">
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, 'dashboard')}
                  className="font-medium transition-colors duration-200 text-[#CE1126]"
                >
                  Dashboard
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="font-medium transition-colors duration-200 text-gray-700 hover:text-[#CE1126]"
                >
                  About RehabServE
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="font-medium transition-colors duration-200 text-gray-700 hover:text-[#CE1126]"
                >
                  Contact Support
                </a>
              </div>
            ) : (
              <>
                {/* Left spacer for balance */}
                <div className="flex-1"></div>
                
                {/* Centered Navigation Links */}
                <div className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                  <a
                    href="#"
                    onClick={(e) => handleNavClick(e, 'dashboard')}
                    className="font-medium transition-colors duration-200 text-gray-700 hover:text-[#CE1126]"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, 'about')}
                    className={`font-medium transition-colors duration-200 ${
                      navSection === 'about' ? 'text-[#CE1126]' : 'text-gray-700 hover:text-[#CE1126]'
                    }`}
                  >
                    About RehabServE
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className={`font-medium transition-colors duration-200 ${
                      navSection === 'contact' ? 'text-[#CE1126]' : 'text-gray-700 hover:text-[#CE1126]'
                    }`}
                  >
                    Contact Support
                  </a>
                </div>
              </>
            )}
            
            {/* Exit Button - Right aligned */}
            <div className={navSection === 'dashboard' ? '' : 'flex-1 flex justify-end'}>
              <button
                onClick={() => {
                  sessionStorage.removeItem('assignedPDK');
                  sessionStorage.removeItem('isAdmin');
                  sessionStorage.removeItem('pdkAccessCode');
                  setAssignedPDK(null);
                  setIsAdmin(false);
                  setSelectedPdk('all');
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200"
                title="Exit"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 text-gray-900 flex flex-col relative overflow-hidden">
      {/* Subtle background shapes for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Horizontal Flexbox for Sidebar and Main Content */}
      <div className="flex flex-1 relative z-10 pt-0 min-h-0">
        {/* Sidebar - only show on dashboard pages */}
        {navSection === 'dashboard' && (
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}

        {/* Main Content Area - flex-1 to push footer down */}
        <div className={`flex-1 flex flex-col relative z-10 min-h-0 ${navSection === 'dashboard' ? 'lg:ml-64' : ''}`}>
          {/* Navigation Bar - shown for all sections */}
          <Navigation />

          {/* Show AboutUs or ContactUs if selected from navigation */}
          {navSection === 'about' && (
            <div className="flex-1 overflow-auto">
              <AboutUs />
            </div>
          )}

          {navSection === 'contact' && (
            <div className="flex-1 overflow-auto">
              <ContactUs />
            </div>
          )}

          {/* Dashboard Content - only show when navSection is dashboard */}
          {navSection === 'dashboard' && (
            <>
          {/* Header */}
          <header className="border-b bg-white/80 backdrop-blur-md border-gray-200/50 sticky top-16 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              {isAdmin ? (
                <>
                  {/* Admin Mode Badge */}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#CE1126]/10 to-[#CE1126]/5 border border-[#CE1126]/20 rounded-lg">
                    <Shield className="h-4 w-4 text-[#CE1126]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 leading-tight">Administrator</span>
                      <span className="text-sm font-bold text-[#CE1126] leading-tight">All PDKs</span>
                  </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-300"></div>
                  
                  {/* PDK Filter */}
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Filter className="h-4 w-4" />
                      <label className="text-sm font-semibold whitespace-nowrap">Select PDK:</label>
                    </div>
                    <div className="relative flex-1">
                    <select
                      value={selectedPdk}
                      onChange={(e) => setSelectedPdk(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#CE1126]/20 focus:border-[#CE1126] bg-white transition-all hover:border-gray-400 shadow-sm appearance-none cursor-pointer"
                    >
                      {pdkOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#CE1126]/5 border border-[#CE1126]/20 rounded-lg">
                    <Building2 className="h-4 w-4 text-[#CE1126]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 leading-tight">Centre</span>
                      <span className="text-sm font-bold text-[#CE1126] leading-tight">{assignedPDK}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content - Section-based Layout */}
        <main id="dashboard-content" className={`${activeSection === 'scorecard' ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1`}>
          {/* Loading State */}
          {isLoading && rawSheetData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126] mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          )}

          {/* Error State */}
          {fetchError && rawSheetData.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Error Loading Data</h3>
                  <p className="text-red-700 text-sm mb-3">{fetchError}</p>
                  <button
                    onClick={fetchSheetData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Dashboard Overview */}
          {activeSection === 'dashboard-overview' && (
            <div className="space-y-8">
              {/* Professional Header Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#CE1126] via-[#CE1126]/95 to-[#B01020] rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCD106] via-white to-[#FCD106] bg-clip-text text-transparent">Performance Dashboard</h1>
                          <p className="text-white/90 text-xs mt-0.5">Rehabilitation Centre Analytics & Insights</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Sparkles className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">AI-Powered Analysis</span>
                        </div>
                        <div className="h-3 w-px bg-white/30"></div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <BarChart3 className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Real-time Metrics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Performance Indicators */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        RehabServE with AI Index
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {kpiData.overallIndex.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Out of 7.0 scale</div>
                    </div>
              </div>

                  <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Best Performing Dimension
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {kpiData.bestDimension.score.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium line-clamp-1">
                        {kpiData.bestDimension.name}
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-purple-50 rounded-lg">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Total Respondents
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {kpiData.totalRespondents}
                      </div>
                      <div className="text-xs text-gray-500">Survey participants</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics & Insights Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Analytics & Insights</h2>
                </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Respondent Groups Distribution</h3>
                      <p className="text-xs text-gray-500 mt-1">Breakdown by respondent category</p>
                    </div>
                    <div className="flex items-center justify-center">
                <CompactDonutChart
                  data={respondentGroupsData}
                  selectedGroup={selectedRespondentGroup}
                        title=""
                        size={220}
                        thickness={30}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Dimension Performance Breakdown</h3>
                      <p className="text-xs text-gray-500 mt-1">Performance distribution across all dimensions</p>
                    </div>
                <CategoryBreakdown
                  data={processedDashboardData?.dimensionsData || []}
                      title=""
                />
                  </div>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
                </div>
              <AIInsightsPanel
                overallIndex={kpiData.overallIndex}
                trend={kpiData.trend}
                bestDimension={kpiData.bestDimension}
                lowestDimension={kpiData.lowestDimension}
                totalRespondents={kpiData.totalRespondents}
              />
              </div>
            </div>
          )}

          {/* Section: Dimensions Analysis */}
          {activeSection === 'dimensions-analysis' && (
            <div className="space-y-8">
              {/* Professional Header Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#CE1126] via-[#CE1126]/95 to-[#B01020] rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCD106] via-white to-[#FCD106] bg-clip-text text-transparent">Dimensions Analysis</h1>
                          <p className="text-white/90 text-xs mt-0.5">Comprehensive performance evaluation across all service dimensions</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-white/90">
                          <BarChart3 className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Multi-Dimensional Metrics</span>
                        </div>
                        <div className="h-3 w-px bg-white/30"></div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Radar className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Performance Balance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dimensional Performance Overview */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Dimensional Performance Overview</h2>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <HorizontalBar
                  data={processedDashboardData?.dimensionsData || []}
                  title="Dimensional Performance"
                  selectedGroup={selectedRespondentGroup}
                />
                </div>
              </div>

              {/* Visual Analysis Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Radar className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Visual Performance Analysis</h2>
                </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <RadarChart
                  data={processedDashboardData?.dimensionsData || []}
                      title="Dimension Balance Radar"
                  selectedGroup={selectedRespondentGroup}
                />
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <GaugeChart
                  data={processedDashboardData?.dimensionsData || []}
                      title="Dimension Scores Gauge View"
                />
                  </div>
                </div>
              </div>

              {/* Performance Comparison Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingDown className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Performance Comparison</h2>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <FunnelChart
                  data={processedDashboardData?.dimensionsData || []}
                    title="Top & Bottom Performing Dimensions"
                />
                </div>
              </div>
            </div>
          )}

          {/* Section: Scorecard */}
          {activeSection === 'scorecard' && (
            <div className="fixed inset-0 top-32 left-0 lg:left-64 bg-gray-50 overflow-auto z-10">
              <div className="p-4 sm:p-6">
              
                
              {/* Full list of question scores */}
              <QuestionBreakdown
                data={processedDashboardData?.questionsData || []}
                title="Question Scores"
                pdk={selectedPdk === 'all' ? 'All PDKs' : pdkOptions.find(opt => opt.value === selectedPdk)?.label || selectedPdk}
                totalRespondents={kpiData.totalRespondents}
                overallIndex={kpiData.overallIndex}
                aiSummary={aiSummary}
              />
              </div>
            </div>
          )}

          {/* Section: Respondent Analysis */}
          {activeSection === 'respondent-analysis' && (
            <div className="space-y-8">
              {/* Professional Header Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#CE1126] via-[#CE1126]/95 to-[#B01020] rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <UserCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCD106] via-white to-[#FCD106] bg-clip-text text-transparent">Respondent Analysis</h1>
                          <p className="text-white/90 text-xs mt-0.5">Insights from different respondent groups and their perspectives</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Users className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Group Comparisons</span>
                        </div>
                        <div className="h-3 w-px bg-white/30"></div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <PieChart className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Distribution Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Group Comparison and Distribution Section */}
              <div className="space-y-6">
                {/* Group Performance Comparison */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-[#CE1126]" />
                    <h2 className="text-lg font-bold text-gray-900">Group Performance Comparison</h2>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <StackedBarByGroup
                      data={processedDashboardData?.dimensionsData || []}
                      respondentGroupsData={respondentGroupsData}
                      title="Group Comparison"
                    />
                  </div>
                </div>

                {/* Respondent Distribution */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="h-5 w-5 text-[#CE1126]" />
                    <h2 className="text-lg font-bold text-gray-900">Respondent Distribution</h2>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <CompactDonutChart
                      data={respondentGroupsData}
                      selectedGroup={selectedRespondentGroup}
                      title=""
                      size={220}
                      thickness={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Health Outcomes */}
          {activeSection === 'health-outcomes' && (
            <div className="space-y-8">
              {/* Professional Header Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#CE1126] via-[#CE1126]/95 to-[#B01020] rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM22 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <HeartPulse className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCD106] via-white to-[#FCD106] bg-clip-text text-transparent">Health Outcomes</h1>
                          <p className="text-white/90 text-xs mt-0.5">AI-powered analytics tracking trainee health improvements and outcomes</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Sparkles className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">AI-Powered Analytics</span>
                        </div>
                        <div className="h-3 w-px bg-white/30"></div>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <Activity className="h-3.5 w-3.5 text-[#FCD106]" />
                          <span className="text-xs font-medium bg-gradient-to-r from-[#FCD106] to-white bg-clip-text text-transparent">Health Progress Tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Health Outcomes Analytics Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <HeartPulse className="h-5 w-5 text-[#CE1126]" />
                  <h2 className="text-xl font-bold text-gray-900">Trainee Health Outcome Analytics</h2>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <HealthOutcomesChart
                rawData={rawSheetData}
                dimensionsData={processedDashboardData?.dimensionsData || []}
                title="Trainees Getting Healthier - AI-Powered Health Outcome Analytics"
              />
                </div>
              </div>
            </div>
          )}
        </main>
            </>
          )}

          {/* Footer - shown for all sections except dashboard */}
          {navSection !== 'dashboard' && (
            <Footer 
              onNavClick={(section) => {
                if (section === 'home') {
                  setNavSection('dashboard');
                  setActiveSection('dashboard-overview');
                } else {
                  setNavSection(section);
                }
              }}
              withSidebarMargin={false}
            />
          )}
        </div>
      </div>

      {/* Floating Chatbot - Only show on dashboard pages */}
      {navSection === 'dashboard' && (
        <FloatingChatbot
          kpiData={kpiData}
          processedDashboardData={processedDashboardData}
          // Only pass required props
          // filters/respondentGroupOptions/pdkOptions/dimensionMappings removed (not used by component)
        />
      )}
    </div>
  );
}

export default App;