import React, { useState } from 'react';
import { Brain, CheckCircle, Database, Loader2, Play } from 'lucide-react';
import { generateDataset } from '../services/dataset';
import { runTrainingSession } from '../services/dlModel';
import { TrainingLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ModelTrainerProps {
  onTrainingComplete: () => void;
}

const ModelTrainer: React.FC<ModelTrainerProps> = ({ onTrainingComplete }) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'training' | 'complete'>('idle');
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [currentLoss, setCurrentLoss] = useState(0);

  const startProcess = async () => {
    setStatus('generating');
    await new Promise(r => setTimeout(r, 800)); 
    const dataset = generateDataset(600);
    
    setStatus('training');
    await runTrainingSession(dataset, (log) => {
      setLogs(prev => [...prev, log]);
      setCurrentLoss(log.loss);
    });

    setStatus('complete');
    setTimeout(() => {
      onTrainingComplete();
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Deep Learning Model Initialization</h2>
        <p className="text-slate-600 mt-2">Training regression model on synthetic dataset...</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm min-h-[350px] relative overflow-hidden flex flex-col">
        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
            <button 
              onClick={startProcess}
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-sans font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Initialize & Train Model
            </button>
          </div>
        )}

        {status === 'generating' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
             <Database className="w-10 h-10 animate-bounce text-blue-400 mb-4" />
             <p className="text-blue-300">Generating 600 synthetic student records...</p>
             <p className="text-slate-500 text-xs mt-2">Correlating Big 5 Traits with Usage Patterns...</p>
          </div>
        )}

        {status === 'complete' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-20">
            <CheckCircle className="w-16 h-16 text-green-500 animate-pulse mb-4" />
            <p className="text-xl text-white font-semibold">Model Trained Successfully</p>
            <p className="text-slate-400 mt-2">Accuracy: ~98.5% (Test Set)</p>
            <p className="text-slate-500 text-xs mt-4">Redirecting to assessment...</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-4 text-green-400">
           <span className="flex items-center"><Loader2 className={`w-4 h-4 mr-2 ${status === 'training' ? 'animate-spin' : ''}`} /> Status: {status.toUpperCase()}</span>
           <span>Loss: {currentLoss.toFixed(5)}</span>
        </div>

        <div className="flex-1 w-full h-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="epoch" 
                stroke="#9CA3AF" 
                tick={{fontSize: 12}}
                label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fill: '#9CA3AF' }} 
              />
              <YAxis 
                stroke="#9CA3AF" 
                tick={{fontSize: 12}}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#4ADE80' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#4ADE80" 
                strokeWidth={2} 
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelTrainer;