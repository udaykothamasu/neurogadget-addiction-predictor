import { SurveyData, AnalysisResult, AddictionLevel } from '../types';

export const analyzeAddictionProfile = async (data: SurveyData, dlScore: number): Promise<AnalysisResult> => {
  // Simulate a short "thinking" delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let level = AddictionLevel.LOW;
  if (dlScore > 35) level = AddictionLevel.MODERATE;
  if (dlScore > 70) level = AddictionLevel.HIGH;

  // --- 1. Rule-Based Academic Impact Forecast ---
  let academicImpactPrediction = "";
  if (level === AddictionLevel.HIGH) {
    academicImpactPrediction = `Based on a calculated addiction score of ${dlScore.toFixed(0)}, there is a high probability of negative academic impact. Heavy daily usage (${data.dailyUsageHours}h/day), especially in the ${data.mostUsedAppCategory} category, is statistically linked to reduced concentration spans and increased procrastination. Students with this profile often experience grade volatility of 15-20% due to sleep displacement and fragmented study sessions.`;
  } else if (level === AddictionLevel.MODERATE) {
    academicImpactPrediction = `With a score of ${dlScore.toFixed(0)}, the academic impact is currently moderate but trending upwards. While your current performance (${data.academicPerformance}) might be stable, the frequency of phone checks (${data.phoneChecksPerDay}/day) suggests a risk of "continuous partial attention," which can hinder deep learning and retention for complex subjects.`;
  } else {
    academicImpactPrediction = `Your digital habits appear to be healthy and balanced. A score of ${dlScore.toFixed(0)} suggests that your technology use is intentional and does not significantly interfere with your academic goals. Your ability to disconnect is a strong asset for focused studying and information retention.`;
  }

  // --- 2. Dynamic Risk Factor Identification ---
  const riskFactors: string[] = [];
  
  if (data.dailyUsageHours > 6) riskFactors.push("Excessive Daily Screen Time (>6 hours)");
  if (data.screenTimeBeforeBed > 45) riskFactors.push("Sleep Disruption (Blue Light Exposure)");
  if (data.phoneChecksPerDay > 100) riskFactors.push("Compulsive Checking Behavior");
  if (data.anxietyLevel > 7) riskFactors.push("High Anxiety Correlation");
  if (data.neuroticism > 7) riskFactors.push("High Stress Reactivity (Neuroticism)");
  if (data.mostUsedAppCategory === 'Gaming' || data.mostUsedAppCategory === 'Social Media') {
    riskFactors.push(`High Dopamine Activity (${data.mostUsedAppCategory})`);
  }
  
  // Fallback if no specific risks are triggered
  if (riskFactors.length === 0) {
    riskFactors.push("No critical behavioral risk factors detected.");
  }

  // --- 3. Targeted Recommendations ---
  const recommendations: string[] = [];
  
  if (level === AddictionLevel.HIGH) {
    recommendations.push("Implement a strict 'No-Phone' zone in the bedroom to improve sleep hygiene.");
    recommendations.push("Use grayscale mode on your device to reduce visual dopamine triggers.");
    recommendations.push(`Limit ${data.mostUsedAppCategory} to specific 30-minute blocks after school work.`);
  } else if (level === AddictionLevel.MODERATE) {
    recommendations.push("Practice the 'Pomodoro Technique': 25 minutes of study, 5 minutes of phone time.");
    recommendations.push("Turn off non-human notifications (apps, games) to reduce checking urges.");
    recommendations.push("Charge your phone outside the bedroom at night.");
  } else {
    recommendations.push("Maintain your current healthy boundaries.");
    recommendations.push("Use your focus to help friends who might be struggling with distraction.");
    recommendations.push("Periodically audit your app usage stats to stay aware of trends.");
  }

  // --- 4. Psychological Profile Calculation (Approximation) ---
  // Normalize values to 0-100 scale based on input 1-10 scales
  const stress = Math.min(100, Math.round((data.anxietyLevel * 7) + (data.neuroticism * 3)));
  
  // Escapism often correlates with high usage + depression/low self-esteem
  const escapism = Math.min(100, Math.round((data.dailyUsageHours * 5) + (data.depressionLevel * 3) + ((10 - data.selfEsteem) * 2)));
  
  // Social Health: Interactions + Extraversion + Agreeableness
  // Note: This metric is "Health", so higher is better usually, but the UI expects a "Risk Distribution"
  // The UI interprets High bars as High Impact/Intensity. 
  // For consistency with "Risk", let's calculate "Social Isolation Risk".
  const socialHealthRisk = Math.max(0, Math.min(100, 100 - ((data.socialInteractions * 4) + (data.extraversion * 3) + (data.agreeableness * 3))));

  return {
    score: dlScore,
    level,
    academicImpactPrediction,
    riskFactors: riskFactors.slice(0, 4), // Top 4
    recommendations: recommendations.slice(0, 3), // Top 3
    psychologicalProfile: {
      stress,
      escapism,
      socialHealth: socialHealthRisk 
    }
  };
};