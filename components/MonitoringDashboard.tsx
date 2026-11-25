import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar } from 'recharts';
import { Activity, AlertTriangle, Play, Pause, RefreshCw, Smartphone, TrendingUp, Calendar, Download } from 'lucide-react';
import { predictAddictionScore } from '../services/dlModel';
import { generateDataset } from '../services/dataset';
import { HistoryLog, SurveyData } from '../types';

interface MonitoringDashboardProps {
  onBack: () => void;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<string>('Low');
  const [alerts, setAlerts] = useState<string[]>([]);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Generate initial "past 30 days" data
  useEffect(() => {
    const initialData: HistoryLog[] = [];
    const baseProfile = generateDataset(1)[0].input;
    
    for (let i = 30; i > 0; i--) {
      // Create slight variations to simulate realistic fluctuation
      const variation = { ...baseProfile };
      variation.dailyUsageHours = Math.max(0, baseProfile.dailyUsageHours + (Math.random() * 4 - 2));
      variation.anxietyLevel = Math.max(1, Math.min(10, baseProfile.anxietyLevel + Math.floor(Math.random() * 3 - 1)));
      
      try {
        const score = predictAddictionScore(variation);
        initialData.push({
          day: `Day -${i}`,
          score: Math.round(score),
          usageHours: parseFloat(variation.dailyUsageHours.toFixed(1)),
          anxiety: variation.anxietyLevel,
          sleep: Math.max(4, 9 - (variation.screenTimeBeforeBed / 60)) // Crude proxy for sleep hours
        });
      } catch (e) {
        // Model might not be ready if navigated too fast, handled by App.tsx loader usually
      }
    }
    setHistory(initialData);
  }, []);

  const toggleSimulation = () => {
    if (isSimulating) {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      let dayCounter = 1;
      
      simulationInterval.current = setInterval(() => {
        setHistory(prev => {
          const lastEntry = prev[prev.length - 1];
          // Simulate a trend (e.g., getting worse)
          const newUsage = Math.min(14, Math.max(1, lastEntry.usageHours + (Math.random() > 0.4 ? 0.5 : -0.3)));
          const newAnxiety = Math.min(10, Math.max(1, lastEntry.anxiety + (Math.random() > 0.6 ? 1 : -1)));
          
          // Create dummy survey data for prediction
          const mockInput: SurveyData = {
            ...generateDataset(1)[0].input, // base
            dailyUsageHours: newUsage,
            anxietyLevel: newAnxiety,
            screenTimeBeforeBed: (9 - Math.max(4, 9 - (newUsage * 0.5))) * 60 // inverse proxy
          };

          const newScore = predictAddictionScore(mockInput);
          const newLog: HistoryLog = {
            day: `Day +${dayCounter}`,
            score: Math.round(newScore),
            usageHours: parseFloat(newUsage.toFixed(1)),
            anxiety: newAnxiety,
            sleep: parseFloat((9 - (newUsage * 0.3)).toFixed(1))
          };
          
          dayCounter++;

          // Check for alerts
          if (newScore > 70 && lastEntry.score <= 70) {
            setAlerts(prevA => [`High Risk Alert: Threshold crossed on Day +${dayCounter-1}`, ...prevA].slice(0, 5));
          }

          setCurrentRisk(newScore > 70 ? 'High' : newScore > 35 ? 'Moderate' : 'Low');

          const newHistory = [...prev, newLog];
          if (newHistory.length > 50) newHistory.shift(); // Keep window size manageable
          return newHistory;
        });
      }, 1500); // Update every 1.5 seconds to simulate days passing
    }
  };

  const exportToCSV = () => {
    if (history.length === 0) return;

    const headers = ['Day', 'Addiction Score', 'Usage Hours', 'Anxiety Level', 'Sleep Hours'];
    const rows = history.map(log => [
      log.day,
      log.score,
      log.usageHours,
      log.anxiety,
      log.sleep
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "addiction_monitoring_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, []);

  if (history.length === 0) return <div className="p-8 text-center text-[#6b7280]">Loading historical data...</div>;

  const currentScore = history[history.length - 1].score;

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e8ecf1]">
        <div>
           <h2 className="text-2xl font-bold text-[#1a2332] flex items-center">
             <Activity className="w-6 h-6 mr-3 text-[#55c2da]" />
             Live Monitoring Dashboard
           </h2>
           <p className="text-[#4a5568] mt-1">Real-time analysis of behavioral patterns and predictive risk assessment.</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right mr-4 hidden md:block">
             <div className="text-xs text-[#6b7280] font-semibold uppercase">Current Risk</div>
             <div className={`text-2xl font-bold ${currentScore > 70 ? 'text-red-600' : currentScore > 35 ? 'text-amber-500' : 'text-emerald-500'}`}>
               {currentRisk} ({currentScore})
             </div>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-white border border-[#e8ecf1] text-[#374151] rounded-lg hover:bg-[#f4f6f9] hover:text-[#55c2da] font-medium transition-colors shadow-sm"
            title="Download CSV Log"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          <button 
            onClick={toggleSimulation}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              isSimulating 
                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                : 'bg-[#55c2da] text-white hover:bg-[#4ab3c9] shadow-md'
            }`}
          >
            {isSimulating ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Simulate</>}
          </button>
          
          <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a2332] font-medium px-2">
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-[#e8ecf1]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1a2332] flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
              Addiction Score Trend
            </h3>
            <div className="flex items-center text-xs space-x-3">
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> High Risk</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Moderate</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Low</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  labelStyle={{ color: '#64748b' }}
                />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'High Risk', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: 'Moderate', fill: '#f59e0b', fontSize: 10 }} />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#e8ecf1] flex flex-col">
           <h3 className="font-bold text-slate-800 flex items-center mb-4">
             <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
             Detection Log
           </h3>
           <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px]">
             {alerts.length === 0 ? (
               <div className="text-center text-[#6b7280] text-sm py-10">No critical events detected yet.</div>
             ) : (
               alerts.map((alert, idx) => (
                 <div key={idx} className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start animate-fadeIn">
                   <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                   {alert}
                 </div>
               ))
             )}
             {history.length > 0 && (
               <div className="p-3 bg-[#f4f6f9] text-[#4a5568] text-sm rounded-lg border border-[#e8ecf1] flex items-center">
                 <Activity className="w-4 h-4 mr-2 text-[#55c2da]" />
                 Last updated: {new Date().toLocaleTimeString()}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8ecf1]">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center">
             <Smartphone className="w-5 h-5 mr-2 text-[#55c2da]" />
             Usage vs. Sleep Correlation
           </h3>
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" label={{ value: 'Usage (h)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" label={{ value: 'Sleep (h)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="usageHours" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.6} barSize={8} />
                <Line yAxisId="right" type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8ecf1]">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center">
             <Calendar className="w-5 h-5 mr-2 text-rose-500" />
             Emotional Volatility (Anxiety)
           </h3>
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="step" dataKey="anxiety" stroke="#e11d48" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;