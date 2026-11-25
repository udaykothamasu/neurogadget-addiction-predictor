import { SurveyData } from '../types';

// Categories for encoding
export const APP_CATEGORIES = ['Social Media', 'Gaming', 'Streaming/Video', 'Messaging', 'Productivity', 'Education'];
export const GENDERS = ['Male', 'Female', 'Other'];

// Helper to generate random number in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a single synthetic data point
const generateStudentProfile = (): { input: SurveyData; targetScore: number } => {
  const usage = random(1, 14);
  const anxiety = randomInt(1, 10);
  const depression = randomInt(1, 10);
  const selfEsteem = randomInt(1, 10);
  const checks = randomInt(10, 200);
  const bedtime = randomInt(0, 120);
  const familyComm = randomInt(1, 10);
  
  // Personality Traits
  const openness = randomInt(1, 10);
  const conscientiousness = randomInt(1, 10);
  const extraversion = randomInt(1, 10);
  const agreeableness = randomInt(1, 10);
  const neuroticism = randomInt(1, 10);

  const data: SurveyData = {
    age: randomInt(13, 19),
    gender: pick(GENDERS),
    gradeLevel: `${randomInt(8, 12)}th`,
    dailyUsageHours: parseFloat(usage.toFixed(1)),
    phoneChecksPerDay: checks,
    gamingHours: parseFloat(random(0, usage * 0.8).toFixed(1)),
    screenTimeBeforeBed: bedtime,
    mostUsedAppCategory: pick(APP_CATEGORIES),
    anxietyLevel: anxiety,
    depressionLevel: depression,
    selfEsteem: selfEsteem,
    familyCommunication: familyComm,
    
    // New Traits
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,

    academicPerformance: randomInt(50, 100), 
    exerciseHours: random(0, 10),
    socialInteractions: random(0, 20)
  };

  // --- Research Paper Logic + Personality Logic for Target Generation ---
  
  let score = 0;
  
  // 1. Usage Impact (Base)
  score += (data.dailyUsageHours / 14) * 30;
  score += (Math.min(data.phoneChecksPerDay, 150) / 150) * 10;
  score += (Math.min(data.screenTimeBeforeBed, 60) / 60) * 10;

  // 2. Psychological Impact
  score += (data.anxietyLevel / 10) * 5;
  score += (data.depressionLevel / 10) * 5;
  score += ((11 - data.selfEsteem) / 10) * 5;

  // 3. Personality Impact
  // High Neuroticism -> Higher risk (responding to stressors with negative emotions/escapism)
  score += (data.neuroticism / 10) * 10; 
  
  // High Conscientiousness -> Lower risk (goal oriented, less impulsive)
  score -= (data.conscientiousness / 10) * 10;
  
  // Low Agreeableness -> Slightly higher risk (less social connection, maybe more online arguments)
  score += ((11 - data.agreeableness) / 10) * 5;

  // Extraversion + Social Media -> Higher Risk
  if (data.extraversion > 7 && data.mostUsedAppCategory === 'Social Media') {
    score += 5;
  }

  // 4. Category Multipliers
  if (data.mostUsedAppCategory === 'Gaming' || data.mostUsedAppCategory === 'Social Media') {
    score *= 1.1;
  }

  // Add random noise (+/- 5%)
  score += random(-5, 5);

  // Clamp 0-100
  score = Math.max(0, Math.min(100, score));

  // Correlate Academic Performance
  const academicImpact = (score / 100) * 35; // Higher impact
  data.academicPerformance = Math.max(40, 98 - academicImpact + random(-5, 5));

  return { input: data, targetScore: score };
};

export const generateDataset = (size: number = 600) => {
  const dataset = [];
  for (let i = 0; i < size; i++) {
    dataset.push(generateStudentProfile());
  }
  return dataset;
};