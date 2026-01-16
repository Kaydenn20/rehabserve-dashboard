import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Target, Award } from 'lucide-react';

interface AIInsightsPanelProps {
  overallIndex: number;
  trend: number;
  bestDimension?: { name: string; score: number };
  lowestDimension?: { name: string; score: number };
  totalRespondents: number;
}

// Simple rule-based "AI" insight generator that interprets KPI values
const getRiskLevel = (overallIndex: number): string => {
  if (overallIndex >= 6) return 'Low Risk (Excellent overall performance)';
  if (overallIndex >= 5) return 'Moderate Risk (Good but with room for improvement)';
  if (overallIndex >= 4) return 'High Risk (Average performance – needs attention)';
  return 'Critical Risk (Low performance – requires immediate action)';
};

const getTrendInsight = (trend: number): string => {
  if (trend > 0.2) return `Performance is improving (+${trend.toFixed(2)}%). Maintain strengths and scale best practices.`;
  if (trend > -0.2) return 'Performance is stable. Focus on weakest dimensions to drive improvement.';
  return `Performance is declining (${trend.toFixed(2)}%). Identify root causes and intervene early.`;
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  overallIndex,
  trend,
  bestDimension,
  lowestDimension,
  totalRespondents,
}) => {
  if (!overallIndex || totalRespondents === 0) {
    return null;
  }

  const riskLevel = getRiskLevel(overallIndex);
  const trendInsight = getTrendInsight(trend);

  const getTrendIcon = () => {
    if (trend > 0.2) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -0.2) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getRiskIcon = () => {
    if (overallIndex >= 6) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (overallIndex >= 5) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#CE1126]/10 to-[#CE1126]/5 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#CE1126]/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-[#CE1126]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI-Powered Insights</h3>
            <p className="text-sm text-gray-600">Automated analysis based on RehabServE Index metrics</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
          <div className="flex-shrink-0 mt-0.5">
            {getRiskIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-900">Overall Performance Status</span>
            </div>
            <p className="text-sm text-gray-700">
              RehabServE Index: <span className="font-semibold text-[#CE1126]">{overallIndex.toFixed(2)}</span> / 7.0
            </p>
            <p className="text-sm text-gray-600 mt-1">{riskLevel}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
          <div className="flex-shrink-0 mt-0.5">
            {getTrendIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-900">Performance Trend</span>
            </div>
            <p className="text-sm text-gray-700">{trendInsight}</p>
          </div>
        </div>

        {bestDimension && (
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex-shrink-0 mt-0.5">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-900">Key Strength</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{bestDimension.name}</span> with a score of <span className="font-semibold text-green-700">{bestDimension.score.toFixed(2)}</span> / 7.0
              </p>
              <p className="text-sm text-gray-600 mt-1">Maintain and replicate successful practices in this area.</p>
            </div>
          </div>
        )}

        {lowestDimension && (
          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex-shrink-0 mt-0.5">
              <Target className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-900">Focus Area for Improvement</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{lowestDimension.name}</span> with a score of <span className="font-semibold text-amber-700">{lowestDimension.score.toFixed(2)}</span> / 7.0
              </p>
              <p className="text-sm text-gray-600 mt-1">Prioritize interventions and training in this dimension.</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-900">Data Coverage</span>
            </div>
            <p className="text-sm text-gray-700">
              Analysis based on <span className="font-semibold text-blue-700">{totalRespondents}</span> survey respondents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
























