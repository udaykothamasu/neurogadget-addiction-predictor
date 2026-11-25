import React from 'react';
import { Activity, Brain, ShieldAlert, LayoutDashboard, Loader2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onOpenDashboard?: () => void;
  isModelReady: boolean;
}

const Hero: React.FC<HeroProps> = ({ onStart, onOpenDashboard, isModelReady }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-[#f4f6f9]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 bg-[#55c2da]/20 text-[#2a8a9e] px-4 py-1.5 rounded-full text-sm font-medium">
          <Brain className="w-4 h-4" />
          <span>Powered by Deep Learning & Advanced AI</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-[#1a2332] tracking-tight">
          Predicting Student <br/>
          <span className="text-[#55c2da]">Gadget Addiction</span>
        </h1>
        
        <p className="text-xl text-[#4a5568] max-w-2xl mx-auto leading-relaxed">
          An advanced predictive framework using behavioral and psychological metrics to assess smartphone addiction risks and forecast academic impact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#e8ecf1] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-[#1a2332]">Behavioral Analysis</h3>
            <p className="text-[#4a5568] mt-2 text-sm">Analyzes daily usage patterns, sleep disruption, and gaming frequency.</p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#e8ecf1] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4 text-teal-600">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-[#1a2332]">Psychological Impact</h3>
            <p className="text-[#4a5568] mt-2 text-sm">Correlates anxiety, depression, and self-esteem with device dependency.</p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#e8ecf1] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-4 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-[#1a2332]">Academic Forecast</h3>
            <p className="text-[#4a5568] mt-2 text-sm">Predicts potential grade decline and provides actionable interventions.</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button 
            onClick={onStart}
            disabled={!isModelReady}
            className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-8 font-medium text-white transition-all duration-300 min-w-[200px] ${
              isModelReady 
                ? 'bg-[#55c2da] hover:bg-[#4ab3c9] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#55c2da] focus:ring-offset-2' 
                : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            {!isModelReady ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Initializing AI Model...</span>
              </>
            ) : (
              <span>Start Assessment</span>
            )}
            
            {isModelReady && <div className="absolute inset-0 -z-10 bg-[#55c2da] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
          </button>
          
          {onOpenDashboard && (
             <button 
              onClick={onOpenDashboard}
              className="inline-flex h-12 items-center justify-center rounded-md bg-white border border-[#e8ecf1] px-8 font-medium text-[#374151] transition-all duration-300 hover:bg-[#f8fafc] hover:text-[#55c2da] hover:border-[#55c2da] min-w-[200px]"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Live Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;