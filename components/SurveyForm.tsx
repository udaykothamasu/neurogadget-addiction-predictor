import React, { useState } from 'react';
import { SurveyData } from '../types';
import { ChevronRight, ChevronLeft, Loader2, Info } from 'lucide-react';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void;
  isAnalyzing: boolean;
}

const INITIAL_DATA: SurveyData = {
  age: 16,
  gender: 'Male',
  gradeLevel: '10th',
  dailyUsageHours: 4,
  phoneChecksPerDay: 50,
  gamingHours: 1,
  screenTimeBeforeBed: 30,
  mostUsedAppCategory: 'Social Media',
  anxietyLevel: 5,
  depressionLevel: 3,
  selfEsteem: 7,
  familyCommunication: 6,
  // Personality Defaults
  openness: 5,
  conscientiousness: 5,
  extraversion: 5,
  agreeableness: 5,
  neuroticism: 5,
  
  academicPerformance: 85,
  exerciseHours: 3,
  socialInteractions: 10
};

const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SurveyData>(INITIAL_DATA);

  const handleChange = (field: keyof SurveyData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderSlider = (label: string, field: keyof SurveyData, desc: string) => (
    <div className="group relative">
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-medium text-[#374151] flex items-center">
          {label}
        </label>
        <span className="text-sm font-semibold text-[#55c2da] bg-[#55c2da]/10 border border-[#55c2da]/30 px-2 py-0.5 rounded">
          {formData[field]}
        </span>
      </div>
      
      <p className="text-xs text-[#6b7280] mb-3 leading-relaxed min-h-[2.5em]">{desc}</p>
      
      <input 
        type="range" min="1" max="10" 
        value={formData[field]} 
        onChange={e => handleChange(field, parseInt(e.target.value))}
        className="w-full h-2 bg-[#e8ecf1] rounded-lg appearance-none cursor-pointer accent-[#55c2da]"
      />
      <div className="flex justify-between text-xs text-[#6b7280] mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  const inputClass = "w-full px-4 py-2 bg-white border border-[#e8ecf1] text-[#1a2332] rounded-lg focus:ring-2 focus:ring-[#55c2da] focus:border-[#55c2da] outline-none";
  const selectClass = "w-full px-4 py-2 bg-white border border-[#e8ecf1] text-[#1a2332] rounded-lg focus:ring-2 focus:ring-[#55c2da] outline-none";

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-[#1a2332] border-b border-[#e8ecf1] pb-2">Demographics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Age</label>
          <input 
            type="number" 
            value={formData.age} 
            onChange={e => handleChange('age', parseInt(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Gender</label>
          <select 
            value={formData.gender} 
            onChange={e => handleChange('gender', e.target.value)}
            className={selectClass}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Grade Level</label>
          <input 
            type="text" 
            value={formData.gradeLevel} 
            onChange={e => handleChange('gradeLevel', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-[#1a2332] border-b border-[#e8ecf1] pb-2">Digital Habits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Daily Usage (Hours)</label>
          <input type="number" step="0.5" value={formData.dailyUsageHours} onChange={e => handleChange('dailyUsageHours', parseFloat(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Phone Checks (Daily)</label>
          <input type="number" value={formData.phoneChecksPerDay} onChange={e => handleChange('phoneChecksPerDay', parseInt(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Gaming (Hours/Day)</label>
          <input type="number" step="0.5" value={formData.gamingHours} onChange={e => handleChange('gamingHours', parseFloat(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Bedtime Usage (Min)</label>
          <input type="number" value={formData.screenTimeBeforeBed} onChange={e => handleChange('screenTimeBeforeBed', parseInt(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Top App Category</label>
          <select value={formData.mostUsedAppCategory} onChange={e => handleChange('mostUsedAppCategory', e.target.value)} className={selectClass}>
            <option>Social Media</option>
            <option>Gaming</option>
            <option>Streaming/Video</option>
            <option>Messaging</option>
            <option>Productivity</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-[#1a2332] border-b border-[#e8ecf1] pb-2">Psychology & Lifestyle</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSlider("Anxiety Level", "anxietyLevel", "Tendency to feel nervous, restless, or tense.")}
        {renderSlider("Depression Level", "depressionLevel", "Feelings of severe despondency and dejection.")}
        {renderSlider("Self Esteem", "selfEsteem", "Confidence in one's own worth or abilities.")}
        {renderSlider("Family Communication", "familyCommunication", "Quality and frequency of interactions with family.")}
      </div>

      <div className="pt-4 border-t border-[#e8ecf1]">
         <h4 className="text-md font-semibold text-[#374151] mb-3">Academic & Physical</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Grades (0-100)</label>
              <input type="number" value={formData.academicPerformance} onChange={e => handleChange('academicPerformance', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Exercise (Hr/Wk)</label>
              <input type="number" value={formData.exerciseHours} onChange={e => handleChange('exerciseHours', parseFloat(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Offline Social (Hr/Wk)</label>
              <input type="number" value={formData.socialInteractions} onChange={e => handleChange('socialInteractions', parseFloat(e.target.value))} className={inputClass} />
            </div>
         </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-[#1a2332] border-b border-[#e8ecf1] pb-2">Big 5 Personality Traits</h3>
      <p className="text-[#6b7280] text-sm">Rate yourself 1-10 based on the descriptions below.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {renderSlider(
          "Openness", 
          "openness", 
          "High: Creative, adventurous, intellectual.\nLow: Practical, traditional, avoids the unknown."
        )}
        {renderSlider(
          "Conscientiousness", 
          "conscientiousness", 
          "High: Organized, determined, goal-oriented.\nLow: Impulsive, easily sidetracked."
        )}
        {renderSlider(
          "Extraversion", 
          "extraversion", 
          "High: Seeks attention, active, social.\nLow: Conserves energy, reserved."
        )}
        {renderSlider(
          "Agreeableness", 
          "agreeableness", 
          "High: Empathetic, serves others.\nLow: Prioritizes own concerns over others."
        )}
        {renderSlider(
          "Neuroticism", 
          "neuroticism", 
          "High: Strong negative reaction to stress/fear.\nLow: Brushes off misfortune easily."
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-[500px] border border-[#e8ecf1]">
      {/* Progress Bar */}
      <div className="w-full bg-[#e8ecf1] h-2">
        <div 
          className="bg-[#55c2da] h-2 transition-all duration-300" 
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="p-8 flex-1">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      <div className="p-8 bg-white border-t border-[#e8ecf1] flex justify-between items-center">
        <button 
          onClick={prevStep}
          disabled={step === 1 || isAnalyzing}
          className={`flex items-center text-[#6b7280] hover:text-[#1a2332] disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? 'invisible' : ''}`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        {step < 4 ? (
          <button 
            onClick={nextStep}
            className="flex items-center bg-[#55c2da] text-white px-6 py-2.5 rounded-lg hover:bg-[#4ab3c9] transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button 
            onClick={onSubmit.bind(null, formData)}
            disabled={isAnalyzing}
            className="flex items-center bg-[#55c2da] text-white px-8 py-2.5 rounded-lg hover:bg-[#4ab3c9] transition-colors disabled:bg-[#55c2da]/60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Assessment'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;