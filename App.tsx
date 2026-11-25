import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import SurveyForm from './components/SurveyForm';
import ResultsView from './components/ResultsView';
import ChatBot from './components/ChatBot';
import MonitoringDashboard from './components/MonitoringDashboard';
import LoginPage from './components/LoginPage';
import { analyzeAddictionProfile } from './services/geminiService';
import { predictAddictionScore, runTrainingSession } from './services/dlModel';
import { generateDataset } from './services/dataset';
import { SurveyData, AnalysisResult } from './types';
import { LayoutDashboard, LogOut } from 'lucide-react';
import type { AuthUser } from './components/LoginPage';

const AUTH_KEY = 'neurogadget_auth';

type AppState = 'hero' | 'survey' | 'analyzing' | 'results' | 'monitoring';

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [state, setState] = useState<AppState>('hero');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);

  // Auto-train model on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        const dataset = generateDataset(600);
        await runTrainingSession(dataset, () => {}); 
        setIsModelReady(true);
        console.log("Deep Learning model trained successfully in background");
      } catch (err) {
        console.error("Failed to train model:", err);
      }
    };
    initModel();
  }, []);

  const handleStart = () => {
    setState('survey');
  };

  const handleSurveySubmit = async (data: SurveyData) => {
    if (!isModelReady) {
      alert("The Deep Learning model is still initializing. Please wait a few seconds and try again.");
      return;
    }

    setState('analyzing');
    try {
      const predictedScore = predictAddictionScore(data);
      console.log("DL Model Prediction:", predictedScore);

      const fullAnalysis = await analyzeAddictionProfile(data, predictedScore);
      
      setResult(fullAnalysis);
      setState('results');
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      setState('survey');
    }
  };

  const handleReset = () => {
    setResult(null);
    setState('hero');
  };

  const handleLogin = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    setResult(null);
    setState('hero');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#1a2332] font-sans relative">
      <header className="bg-white border-b border-[#e8ecf1] sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setState('hero')}>
            <div className="w-8 h-8 bg-[#55c2da] rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#1a2332]">NeuroGadget</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#4a5568] truncate max-w-[120px]" title={user.email}>
              {user.name || user.email}
            </span>
            {state === 'hero' && (
               <button 
                 onClick={() => setState('monitoring')}
                 className="hidden md:flex items-center text-sm font-medium text-[#4a5568] hover:text-[#55c2da] transition-colors"
               >
                 <LayoutDashboard className="w-4 h-4 mr-2" />
                 Live Dashboard
               </button>
            )}
            {state !== 'hero' && (
             <button onClick={handleReset} className="text-sm text-[#6b7280] hover:text-[#1a2332]">
               Back to Home
             </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {state === 'hero' && (
          <Hero 
            onStart={handleStart} 
            onOpenDashboard={() => setState('monitoring')} 
            isModelReady={isModelReady}
          />
        )}
        
        {state === 'monitoring' && (
          <MonitoringDashboard onBack={() => setState('hero')} />
        )}

        {state === 'survey' && (
          <div className="animate-fadeIn py-8">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#1a2332]">Student Assessment</h2>
                <p className="text-[#4a5568] mt-2">Enter the behavioral, psychological, and personality metrics.</p>
             </div>
             <SurveyForm onSubmit={handleSurveySubmit} isAnalyzing={false} />
          </div>
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-fadeIn">
            <div className="w-16 h-16 border-4 border-[#55c2da]/30 border-t-[#55c2da] rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-[#1a2332]">Analyzing Data</h2>
            <p className="text-[#6b7280] mt-2">Running Deep Learning Inference & Generating Insights...</p>
          </div>
        )}

        {state === 'results' && result && (
          <ResultsView result={result} onReset={handleReset} />
        )}
      </main>

      {/* Floating Chat Bot - Hide on dashboard to prevent clutter */}
      {state !== 'monitoring' && <ChatBot score={result ? result.score : null} />}
    </div>
  );
};

export default App;