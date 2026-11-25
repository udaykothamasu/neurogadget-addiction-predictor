import React, { useState } from 'react';
import { AnalysisResult, AddictionLevel } from '../types';
import { AlertTriangle, BookOpen, CheckCircle, TrendingDown, Activity, Brain, Star, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getTheme = (score: number) => {
    if (score > 70) return { 
      main: 'text-red-600', 
      stroke: '#DC2626', 
      bg: 'bg-red-50/50', 
      border: 'border-red-100',
      track: 'text-red-100',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-orange-500'
    };
    if (score > 35) return { 
      main: 'text-amber-600', 
      stroke: '#D97706', 
      bg: 'bg-amber-50/50', 
      border: 'border-amber-100',
      track: 'text-amber-100',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-yellow-500'
    };
    return { 
      main: 'text-emerald-600', 
      stroke: '#059669', 
      bg: 'bg-emerald-50/50', 
      border: 'border-emerald-100',
      track: 'text-emerald-100',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-teal-500'
    };
  };

  const submitFeedback = () => {
    if (rating === 0) return;
    
    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      rating,
      score: result.score,
      level: result.level
    };
    
    try {
      const existing = localStorage.getItem('neurogadget_feedback');
      const log = existing ? JSON.parse(existing) : [];
      localStorage.setItem('neurogadget_feedback', JSON.stringify([...log, feedbackEntry]));
      setIsSubmitted(true);
    } catch (e) {
      console.error("Failed to save feedback", e);
    }
  };

  const theme = getTheme(result.score);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  // Prepare data for the chart
  const chartData = [
    { name: 'Stress & Anxiety', value: result.psychologicalProfile.stress },
    { name: 'Escapism', value: result.psychologicalProfile.escapism },
    { name: 'Social Health', value: result.psychologicalProfile.socialHealth }
  ];

  const getBarColor = (name: string, value: number) => {
    if (name === 'Social Health') {
      return value < 40 ? '#ef4444' : value < 70 ? '#f59e0b' : '#10b981'; // Low social health is bad (Red)
    }
    return value > 60 ? '#ef4444' : value > 30 ? '#f59e0b' : '#10b981'; // High stress/escapism is bad (Red)
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Enhanced Score Card */}
      <div className={`relative overflow-hidden rounded-3xl bg-white shadow-lg border ${theme.border}`}>
        {/* Background Decor */}
        <div className={`absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full ${theme.bg} blur-3xl opacity-50 pointer-events-none`}></div>
        <div className={`absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full ${theme.bg} blur-3xl opacity-50 pointer-events-none`}></div>

        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f4f6f9] text-[#4a5568] text-xs font-semibold uppercase tracking-wider mb-3">
                <Activity className="w-3 h-3" />
                <span>AI Assessment Complete</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a2332] tracking-tight">
                {result.level} <span className={theme.main}>Risk Level</span>
              </h2>
            </div>
            
            <p className="text-lg text-[#4a5568] leading-relaxed max-w-xl">
              Our deep learning model has analyzed your behavioral patterns and personality traits. 
              {result.score > 70 
                ? " Immediate attention to digital habits is highly recommended." 
                : result.score > 35 
                  ? " There are signs of developing dependency. Proactive balance is advised." 
                  : " Your digital habits appear healthy and balanced. Keep it up!"}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="bg-[#f4f6f9] rounded-xl p-3 border border-[#e8ecf1]">
                 <div className="text-[#6b7280] text-xs uppercase font-semibold">Category</div>
                 <div className="text-[#1a2332] font-semibold">{result.level} Addiction</div>
               </div>
               <div className="bg-[#f4f6f9] rounded-xl p-3 border border-[#e8ecf1]">
                 <div className="text-[#6b7280] text-xs uppercase font-semibold">Percentile</div>
                 <div className="text-[#1a2332] font-semibold">Top {Math.max(1, 100 - Math.round(result.score))}%</div>
               </div>
            </div>
          </div>

          {/* Circular Chart */}
          <div className="relative flex-shrink-0">
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-tr ${theme.gradientFrom} ${theme.gradientTo}`}></div>
            
            <svg className="w-64 h-64 transform -rotate-90 relative z-10">
              {/* Defs for Gradient */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={theme.gradientFrom.replace('from-', 'stop-')} style={{ stopColor: 'var(--tw-gradient-from)' }} />
                  <stop offset="100%" className={theme.gradientTo.replace('to-', 'stop-')} style={{ stopColor: 'var(--tw-gradient-to)' }} />
                </linearGradient>
              </defs>
              
              {/* Background Track */}
              <circle 
                cx="128" cy="128" r={radius} 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                className={theme.track}
              />
              
              {/* Progress Path */}
              <circle 
                cx="128" cy="128" r={radius} 
                stroke={theme.stroke}
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1500 ease-out drop-shadow-sm"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className={`text-7xl font-bold tracking-tighter ${theme.main}`}>
                {result.score.toFixed(0)}
              </span>
              <span className="text-sm font-semibold text-[#6b7280] uppercase tracking-widest mt-1">
                Score
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Academic Impact */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#e8ecf1] flex flex-col h-full">
          <div className="flex items-center mb-6 text-indigo-600">
            <div className="p-3 bg-indigo-50 rounded-2xl mr-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#1a2332]">Academic Forecast</h3>
          </div>
          <p className="text-[#4a5568] leading-relaxed mb-8 flex-grow">
            {result.academicImpactPrediction}
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-2xl border border-indigo-50">
             <div className="flex justify-between text-sm text-indigo-900 font-bold mb-2">
               <span>Projected Grade Impact</span>
               <span>-{((result.score / 100) * 20).toFixed(1)}%</span>
             </div>
             <div className="w-full bg-indigo-100 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(result.score / 100) * 80}%` }}></div>
             </div>
          </div>
        </div>

        {/* Psychological Profile Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#e8ecf1] flex flex-col h-full">
           <div className="flex items-center mb-6 text-teal-600">
            <div className="p-3 bg-teal-50 rounded-2xl mr-4">
               <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#1a2332]">Risk Indicator Distribution</h3>
          </div>
          
          <div className="flex-grow min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} 
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.name, entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between px-2 mt-4 text-xs text-[#6b7280] font-medium">
             <span>Low Impact</span>
             <span>High Impact</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#e8ecf1]">
          <h3 className="font-bold text-xl text-[#1a2332] mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
            Risk Factors
          </h3>
          <ul className="space-y-4">
            {result.riskFactors.map((factor, i) => (
              <li key={i} className="flex items-start p-4 bg-amber-50/50 rounded-xl border border-amber-50">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-[#374151] font-medium">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#e8ecf1]">
          <h3 className="font-bold text-xl text-[#1a2332] mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
            Recommendations
          </h3>
           <ul className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start p-4 bg-emerald-50/50 rounded-xl border border-emerald-50">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-[#374151] font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="max-w-xl mx-auto bg-[#f4f6f9] rounded-2xl p-6 text-center border border-[#e8ecf1]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-[#55c2da]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-[#1a2332] mb-2">
            {isSubmitted ? "Thank You!" : "Was this analysis helpful?"}
          </h3>
          
          {!isSubmitted ? (
            <>
              <p className="text-sm text-[#6b7280] mb-4">Your feedback helps improve our prediction model.</p>
              <div className="flex space-x-2 justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-all duration-200 transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-[#d1d5db] hover:text-[#9ca3af]'}`}
                  >
                    <Star className="w-8 h-8" />
                  </button>
                ))}
              </div>
              <button
                onClick={submitFeedback}
                disabled={rating === 0}
                className="px-6 py-2 bg-[#55c2da] text-white text-sm font-medium rounded-lg hover:bg-[#4ab3c9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Feedback
              </button>
            </>
          ) : (
            <p className="text-[#4a5568] text-sm">
              We appreciate your feedback. It has been recorded for future improvements.
            </p>
          )}
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={onReset}
          className="group inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-[#55c2da] rounded-full hover:bg-[#4ab3c9] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#55c2da]"
        >
          <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsView;