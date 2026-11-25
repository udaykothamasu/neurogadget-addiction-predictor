import { SurveyData, TrainingLog } from '../types';
import { APP_CATEGORIES, GENDERS } from './dataset';

const tf = (window as any).tf;

let minMaxValues: Record<string, { min: number; max: number }> = {};

const encodeCategory = (value: string, categories: string[]) => {
  const index = categories.indexOf(value);
  return index === -1 ? 0 : index;
};

const preprocessData = (data: SurveyData[]) => {
  return data.map(d => {
    return [
      d.age,
      encodeCategory(d.gender, GENDERS),
      d.dailyUsageHours,
      d.phoneChecksPerDay,
      d.gamingHours,
      d.screenTimeBeforeBed,
      encodeCategory(d.mostUsedAppCategory, APP_CATEGORIES),
      d.anxietyLevel,
      d.depressionLevel,
      d.selfEsteem,
      d.familyCommunication,
      // New Personality Features
      d.openness,
      d.conscientiousness,
      d.extraversion,
      d.agreeableness,
      d.neuroticism,
      // End New Features
      d.academicPerformance,
      d.exerciseHours,
      d.socialInteractions
    ];
  });
};

// 14 original + 5 personality = 19 features
const NUM_FEATURES = 19;

export const createModel = () => {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [NUM_FEATURES],
    units: 64,
    activation: 'relu'
  }));

  model.add(tf.layers.dropout({ rate: 0.2 }));

  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.1 }));

  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));

  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mse']
  });

  return model;
};

const normalizeTensor = (tensor: any) => {
  const min = tensor.min(0);
  const max = tensor.max(0);
  return {
    tensor: tensor.sub(min).div(max.sub(min)),
    min,
    max
  };
};

export const runTrainingSession = async (
  dataset: { input: SurveyData, targetScore: number }[],
  onProgress: (log: TrainingLog) => void
) => {
  const inputs = dataset.map(d => d.input);
  const targets = dataset.map(d => d.targetScore);
  
  const processedInputs = preprocessData(inputs);
  const inputTensor = tf.tensor2d(processedInputs);
  const labelTensor = tf.tensor2d(targets, [targets.length, 1]);

  const inputMin = inputTensor.min(0);
  const inputMax = inputTensor.max(0);
  const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));

  normalizationParams = {
    min: inputMin,
    max: inputMax
  };

  const model = createModel();

  await model.fit(normalizedInputs, labelTensor, {
    batchSize: 32,
    epochs: 50,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch: number, logs: any) => {
        onProgress({ epoch: epoch + 1, loss: logs.loss });
      }
    }
  });

  trainedModel = model;
  
  inputTensor.dispose();
  labelTensor.dispose();
  normalizedInputs.dispose();
  
  return true;
};

let trainedModel: any = null;
let normalizationParams: any = null;

export const predictAddictionScore = (input: SurveyData): number => {
  if (!trainedModel || !normalizationParams) {
    throw new Error("Model not trained");
  }

  return tf.tidy(() => {
    const processed = preprocessData([input]); 
    const inputT = tf.tensor2d(processed);
    const normalized = inputT.sub(normalizationParams.min).div(normalizationParams.max.sub(normalizationParams.min));
    const prediction = trainedModel.predict(normalized);
    const score = prediction.dataSync()[0];
    return score;
  });
};