import React, { useRef, useState } from 'react';

interface QuestionData {
  questionId: string;
  questionNumber: number;
  dimension: string;
  score: number;
  count: number;
}

// Question descriptions mapping
const QUESTION_DESCRIPTIONS: { [key: string]: string } = {
  // TO - Trainee Orientation
  'TO1': 'Constantly check the level of commitment to serve the trainees\' needs',
  'TO2': 'Care for the trainees based on a good understanding of the trainees\' needs',
  'TO3': 'Love and be patient with every trainee',
  'TO4': 'Regularly understand the trainees\' satisfaction',
  'TO5': 'Know the changes in the trainees\' preferences',
  'TO6': 'Excellent after-training service for trainees',
  // PO - Performance Management
  'PO1': 'The Rehabilitation Centre strives for service excellence',
  'PO2': 'The top management is committed to delivering excellent rehabilitation services',
  'PO3': 'Systematically and regularly measures its service performance',
  'PO4': 'Seriously monitors its rehabilitation service performance',
  'PO5': 'Provide resources to enhance trainers\' ability to provide excellent service',
  'PO6': 'Aiming for being an excellent CBR Centre',
  // CO - Competitive Orientation
  'CO1': 'Respond quickly to competitors\' actions that may threaten the Centre',
  'CO2': 'Continuously knowing the competitors to provide better service',
  'CO3': 'The target for trainees that the Centre can serve better than its competitors',
  'CO4': 'Always learn from other rehabilitation centres to care for the trainees',
  'CO5': 'Always try to be different and better than other CBR Centres',
  'CO6': 'Work with other CBR Centres and counterparts',
  // LO - Long-Term Orientation
  'LO1': 'Invest in providing excellent services to the trainees (e.g., facilities)',
  'LO2': 'Implement changes to care for the trainees in the long-term',
  'LO3': 'Emphasise the Centre\'s long-term survival',
  'LO4': 'Emphasise continuous improvement in managing its services/products',
  'LO5': 'The Centre has long-term plans in service',
  'LO6': 'Consider serving the trainees well as a worthwhile long-term investment',
  'LO7': 'The Centre consistently emphasises service excellence',
  'LO8': 'Generate income for sustainability of the Centre',
  // IO - Internal Communication
  'IO1': 'The employees communicate and "talk" about how to care for the trainees better',
  'IO2': 'Trainee information is freely distributed in the Centre (e.g., notices)',
  'IO3': 'The employees of different departments in the Centre have good relationships',
  'IO4': 'During any activity involving various departments, there is good coordination',
  'IO5': 'There is good communication between the different departments/units in the Centre',
  'IO6': 'Work with external organisations',
  // EO - Employee Management
  'EO1': 'The employees of the Centre are well trained',
  'EO2': 'Employees who interact with the trainees are always motivated or joyful',
  'EO3': 'The Centre have sufficient staff to deliver quality service',
  'EO4': 'The Centre chooses suitable staff to interact or deal with the trainees',
  'EO5': 'Motivate trainers to love and care for the trainers',
  'EO6': 'Encourage employees to have a good relationship with parents',
};

// Dimension codes and full names mapping
const DIMENSION_INFO: { [key: string]: { code: string; fullName: string } } = {
  'Trainee Orientation': { code: 'TO', fullName: 'Trainee Orientation' },
  'Performance Orientation': { code: 'PO', fullName: 'Performance Management' },
  'Competitor Orientation': { code: 'CO', fullName: 'Competitive Orientation' },
  'Long-term Focus': { code: 'LO', fullName: 'Long-Term Orientation' },
  'Inter-functional Coordination': { code: 'IO', fullName: 'Internal Organization' },
  'Employee Orientation': { code: 'EO', fullName: 'Employee Orientation' },
};

interface QuestionBreakdownProps {
  data: QuestionData[];
  title: string;
  pdk?: string;
  totalRespondents?: number;
  overallIndex?: number;
  // Optional AI-generated narrative summary about the scorecard
  aiSummary?: string;
}

const QuestionBreakdown: React.FC<QuestionBreakdownProps> = ({ 
  data, 
  title,
  pdk = 'All PDKs',
  totalRespondents = 0,
  overallIndex = 0,
  aiSummary,
}) => {
  const scorecardRef = useRef<HTMLDivElement | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Function to download PDF using browser's print functionality
  // This method uses the browser's native print-to-PDF which handles multi-page correctly
  const downloadPDF = () => {
    if (!scorecardRef.current) return;

    try {
      // Create a new window with the scorecard content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
      }

      // Get the scorecard HTML
      const scorecardHTML = scorecardRef.current.innerHTML;
      
      // Get current styles from the document
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((style: any) => {
          if (style.tagName === 'STYLE') {
            return `<style>${style.innerHTML}</style>`;
          } else if (style.tagName === 'LINK' && style.href) {
            return `<link rel="stylesheet" href="${style.href}">`;
          }
          return '';
        })
        .join('');

      // Create the print document with proper print styles
      const printDocument = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>RehabServE Scorecard ${pdk !== 'all' && pdk !== 'All PDKs' ? pdk : 'All PDKs'}</title>
            <meta charset="utf-8">
            ${styles}
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 15mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                }
                /* Ensure proper page breaks - don't break within rows */
                table {
                  page-break-inside: avoid;
                }
                tr {
                  page-break-inside: avoid;
                }
                /* Allow page breaks between sections */
                div {
                  page-break-inside: avoid;
                }
              }
              @media screen {
                body {
                  margin: 0;
                  padding: 20px;
                  background: white;
                  font-family: sans-serif;
                }
              }
              body {
                margin: 0;
                padding: 20px;
                background: white;
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            ${scorecardHTML}
            <script>
              window.onload = function() {
                // Small delay to ensure styles are loaded
                setTimeout(function() {
                  window.print();
                  // Close window after printing (user can cancel)
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                }, 250);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(printDocument);
      printWindow.document.close();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white min-h-screen p-8">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Group questions by dimension and calculate average scores
  const dimensionGroups: { [key: string]: QuestionData[] } = {};
  data.forEach(question => {
    if (!dimensionGroups[question.dimension]) {
      dimensionGroups[question.dimension] = [];
    }
    dimensionGroups[question.dimension].push(question);
  });

  // Calculate average score for each dimension
  const dimensionAverages: { [key: string]: number } = {};
  Object.keys(dimensionGroups).forEach(dimension => {
    const questions = dimensionGroups[dimension];
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    dimensionAverages[dimension] = totalScore / questions.length;
  });

  // Sort dimensions by the order they appear in the data
  const sortedDimensions = Object.keys(dimensionGroups).sort((a, b) => {
    const aFirstQuestion = dimensionGroups[a][0];
    const bFirstQuestion = dimensionGroups[b][0];
    return aFirstQuestion.questionNumber - bFirstQuestion.questionNumber;
  });

  // Get current date for header
  const currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateString = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Calculate percentage (assuming 7 is max, so 6.33/7 = ~90.4%)
  const percentage = ((overallIndex / 7) * 100).toFixed(1);

  const pastelPalette = [
    '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff',
    '#ffc6ff', '#f1f2f6', '#f8d7da', '#d1e7dd', '#cff4fc'
  ];

  const getStatementColor = (qid: string) => {
    if (qid.startsWith('TO')) return 'rgb(255, 255, 255)';
    if (qid.startsWith('PO')) return 'rgb(255, 153, 255)';
    if (qid.startsWith('CO')) return 'rgb(255, 192, 0)';
    if (qid.startsWith('LO')) return 'rgb(155, 194, 230)';
    if (qid.startsWith('IO')) return 'rgb(146, 209, 80)';
    if (qid.startsWith('EO')) return 'rgb(248, 203, 173)';
    return '#ffffff';
  };

  const getScoreBg = (qid: string) => {
    if (qid.startsWith('TO')) return 'rgb(255, 242, 204)';
    if (qid.startsWith('PO')) return 'rgb(243, 163, 228)';
    if (qid.startsWith('CO')) return 'rgb(255, 230, 153)';
    if (qid.startsWith('LO')) return 'rgb(204, 204, 255)';
    if (qid.startsWith('IO')) return 'rgb(198, 224, 180)';
    if (qid.startsWith('EO')) return 'rgb(248, 203, 173)';
    return '#ffffff';
  };

  return (
    <div className="bg-white min-h-screen p-4 font-sans relative">
      {/* Download PDF Button */}
      <div className="fixed top-32 left-6 lg:left-[280px] z-[100]">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          title="Download Scorecard as PDF"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>
      <div className="flex justify-center w-full">
        <div ref={scorecardRef} data-scorecard="true" className="flex flex-col items-center">
      {/* Logo above the table */}
      <div className="flex justify-center w-full mb-4">
        {logoError ? (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#CE1126] to-[#FCD106] text-white px-4 py-2 rounded-lg font-bold text-xl">
              RehabServE
            </div>
            <span className="text-gray-700 font-semibold text-lg">with AI</span>
          </div>
        ) : (
          <img
            src="/RehabServELogo2.png"
            alt="RehabServE Logo"
            className="h-14"
            onError={() => setLogoError(true)}
          />
        )}
      </div>
      {/* Header with Title */}
      <div className="mb-0" style={{ width: 'calc(3rem + 35rem + 5rem + 4rem)' }}>
        {/* New row above header with 90.2% */}
        <div
          className="grid items-stretch"
          style={{ gridTemplateColumns: '3rem 35rem 5rem 4rem' }}
        >
          <div />
          <div />
          <div
            className="flex items-center justify-center px-3 py-1 border border-black leading-tight"
            style={{ backgroundColor: 'rgb(255, 255, 0)' }}
          >
            <div className="text-base font-bold text-gray-800 text-center">{percentage}%</div>
          </div>
          <div />
        </div>
        
        <div
          className="grid items-stretch"
          style={{ gridTemplateColumns: '3rem 35rem 5rem 4rem', borderLeft: '1px solid black' }}
        >
          <div
            className="border border-black"
            style={{ backgroundColor: 'rgb(128, 0, 128)' }}
          />
          <div
            className="flex items-center justify-center px-3 py-1 border border-black"
            style={{ backgroundColor: 'rgb(255, 255, 0)' }}
          >
            <h1 className="text-base font-bold text-gray-800 text-center leading-tight">
              RehabServE Scorecard {pdk !== 'all' && pdk !== 'All PDKs' ? pdk : 'All PDKs'}_n={totalRespondents}_{dateString}
            </h1>
          </div>
          <div
            className="flex items-center justify-center px-3 py-1 border border-black"
            style={{ backgroundColor: 'rgb(128, 0, 128)' }}
          >
            <div className="text-[10px] font-bold text-white leading-tight">Rating 1-7</div>
          </div>
          <div />
        </div>
      </div>

      {/* Main Content - Sections */}
      <div className="space-y-0">
        {sortedDimensions.map((dimension, idx) => {
          const questions = dimensionGroups[dimension];
          const averageScore = dimensionAverages[dimension];
          const dimInfo = DIMENSION_INFO[dimension] || { code: dimension.substring(0, 2).toUpperCase(), fullName: dimension };

          return (
            <div key={dimension} className="mb-0">
              {/* Statements Table */}
              <div className="bg-white">
                <table
                  className="border-separate border-spacing-0"
                  style={{ 
                    borderLeft: '1px solid black', 
                    borderTop: 'none', 
                    borderBottom: 'none', 
                    borderRight: 'none',
                    width: 'calc(3rem + 35rem + 5rem + 4rem)',
                    tableLayout: 'fixed'
                  }}
                >
                  <tbody>
                    {questions.map((question, qIdx) => {
                      const qid = question.questionId || '';
                      const idBg =
                        qid.startsWith('TO') ? 'rgb(255, 242, 204)' :
                        qid.startsWith('PO') ? 'rgb(198, 224, 180)' :
                        qid.startsWith('CO') ? 'rgb(248, 203, 173)' :
                        qid.startsWith('LO') ? 'rgb(221, 235, 247)' :
                        qid.startsWith('IO') ? 'rgb(198, 224, 180)' :
                        qid.startsWith('EO') ? 'rgb(252, 228, 214)' :
                        pastelPalette[qIdx % pastelPalette.length];
                      const description = QUESTION_DESCRIPTIONS[question.questionId] || `Question ${question.questionId}`;
                      const statementColor = getStatementColor(qid);
                      const scoreBg = getScoreBg(qid);
                      return (
                        <tr 
                          key={question.questionId}
                        >
                          <td
                            className="py-0 px-1 text-xs font-bold text-gray-900 w-12 text-center border border-black leading-tight"
                            style={{ backgroundColor: idBg }}
                          >
                            {question.questionId}
                          </td>
                          <td
                            className="py-0 px-1 text-xs font-bold bg-black border border-black leading-tight"
                            style={{ color: statementColor, width: '35rem' }}
                          >
                            {description}
                          </td>
                          <td
                            className="py-0 px-0 text-center text-xs text-gray-900 font-bold w-20 leading-tight"
                            style={{ backgroundColor: scoreBg, border: '1px solid black', borderRight: '1px solid black' }}
                          >
                            {question.score.toFixed(2)}
                          </td>
                          <td
                            className="py-0 px-1 text-center w-16 align-middle"
                            style={{ border: 'none' }}
                          >
                            {qIdx === questions.length - 1 ? (
                              <div className="bg-gray-900 px-2 py-0 w-full text-right leading-tight" style={{ border: 'none' }}>
                                <span className="font-bold text-sm text-white">{averageScore.toFixed(2)}</span>
                              </div>
                            ) : (
                              <div className="w-full" style={{ border: 'none' }} />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - RehabServE Index */}
      <div className="mt-0">
        <div>
          <table
      className="border-separate border-spacing-0"
      style={{
        borderLeft: '1px solid black',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        width: 'calc(3rem + 35rem + 5rem + 4rem)',
        tableLayout: 'fixed'
      }}
    >
      <tbody>
        <tr>
          {/* First column – spacer (matches question ID column width) */}
          <td
            className="w-12 border border-black"
            style={{ backgroundColor: 'rgb(128,0,128)' }}
          ></td>

          {/* Second column – label */}
          <td
            className="py-1 px-3 text-center text-sm font-semibold border border-black text-white leading-tight"
            style={{ backgroundColor: 'rgb(0,102,204)', width: '35rem' }}
          >
            RehabServE Index
          </td>

          {/* Third column – value */}
          <td
            className="py-1 px-3 text-center w-20 font-bold border border-black text-white leading-tight"
            style={{ backgroundColor: 'rgb(255,0,0)' }}
          >
            {overallIndex.toFixed(2)} 
          </td>

          {/* Fourth column – filler (for alignment with average column) */}
          <td className="w-16 border-0 p-0 m-0" style={{ backgroundColor: 'rgb(255,255,255)' }}></td>
          </tr>
          </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 w-full text-left text-xs italic text-black leading-tight">
  © Prof. Dr. Voon Boo Ho, UiTM Cawangan Sarawak (bhvoon@uitm.edu.my)
</div>


      <div className="text-xs text-gray-500 mt-2 text-center font-bold leading-tight">
      </div>
        </div>
      </div>
    </div>

  );
};

export default QuestionBreakdown;
