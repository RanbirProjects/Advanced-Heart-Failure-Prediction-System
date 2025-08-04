const { PythonShell } = require('python-shell');
const path = require('path');

// Simple ML prediction function (fallback when Python is not available)
function simplePrediction(data) {
  // This is a simplified prediction algorithm
  // In production, this should be replaced with a proper ML model
  
  let riskScore = 0;
  
  // Age factor (higher age = higher risk)
  if (data.age > 65) riskScore += 0.3;
  else if (data.age > 50) riskScore += 0.2;
  else if (data.age > 35) riskScore += 0.1;
  
  // Gender factor (males have slightly higher risk)
  if (data.sex === 1) riskScore += 0.1;
  
  // Chest pain type
  if (data.chestPainType === 0) riskScore += 0.3; // typical angina
  else if (data.chestPainType === 1) riskScore += 0.2; // atypical angina
  else if (data.chestPainType === 2) riskScore += 0.1; // non-anginal
  
  // Blood pressure
  if (data.restingBP > 180) riskScore += 0.4;
  else if (data.restingBP > 140) riskScore += 0.3;
  else if (data.restingBP > 120) riskScore += 0.1;
  
  // Cholesterol
  if (data.cholesterol > 300) riskScore += 0.3;
  else if (data.cholesterol > 200) riskScore += 0.2;
  
  // Fasting blood sugar
  if (data.fastingBS === 1) riskScore += 0.2;
  
  // ECG results
  if (data.restingECG === 2) riskScore += 0.3; // left ventricular hypertrophy
  else if (data.restingECG === 1) riskScore += 0.2; // ST-T wave abnormality
  
  // Max heart rate
  if (data.maxHR < 100) riskScore += 0.2;
  else if (data.maxHR > 200) riskScore += 0.1;
  
  // Exercise angina
  if (data.exerciseAngina === 1) riskScore += 0.3;
  
  // ST depression
  if (data.oldpeak > 2) riskScore += 0.4;
  else if (data.oldpeak > 1) riskScore += 0.3;
  else if (data.oldpeak > 0) riskScore += 0.1;
  
  // ST slope
  if (data.stSlope === 2) riskScore += 0.3; // down
  else if (data.stSlope === 1) riskScore += 0.2; // flat
  
  // Normalize to 0-1 range
  const prediction = Math.min(Math.max(riskScore, 0), 1);
  
  return {
    success: true,
    prediction: prediction,
    confidence: 0.85,
    method: 'simplified'
  };
}

// Python ML prediction function
async function pythonPrediction(data) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, '../ml'),
      args: [JSON.stringify(data)]
    };

    PythonShell.run('predict.py', options, (err, results) => {
      if (err) {
        console.error('Python prediction error:', err);
        resolve(simplePrediction(data)); // Fallback to simple prediction
      } else if (results && results.length > 0) {
        const result = results[0];
        resolve({
          success: true,
          prediction: result.prediction,
          confidence: result.confidence || 0.9,
          method: 'ml_model'
        });
      } else {
        resolve(simplePrediction(data)); // Fallback to simple prediction
      }
    });
  });
}

// Main prediction function
async function runPrediction(data) {
  try {
    // Try Python ML model first
    const result = await pythonPrediction(data);
    return result;
  } catch (error) {
    console.error('ML prediction error:', error);
    // Fallback to simple prediction
    return simplePrediction(data);
  }
}

// Validate input data
function validatePredictionData(data) {
  const required = ['age', 'sex', 'chestPainType', 'restingBP', 'cholesterol', 
                   'fastingBS', 'restingECG', 'maxHR', 'exerciseAngina', 
                   'oldpeak', 'stSlope'];
  
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Validate ranges
  if (data.age < 0 || data.age > 150) {
    return { valid: false, error: 'Age must be between 0 and 150' };
  }
  
  if (![0, 1].includes(data.sex)) {
    return { valid: false, error: 'Sex must be 0 or 1' };
  }
  
  if (![0, 1, 2, 3].includes(data.chestPainType)) {
    return { valid: false, error: 'Invalid chest pain type' };
  }
  
  if (data.restingBP < 0 || data.restingBP > 300) {
    return { valid: false, error: 'Resting BP must be between 0 and 300' };
  }
  
  if (data.cholesterol < 0 || data.cholesterol > 1000) {
    return { valid: false, error: 'Cholesterol must be between 0 and 1000' };
  }
  
  if (![0, 1].includes(data.fastingBS)) {
    return { valid: false, error: 'Fasting BS must be 0 or 1' };
  }
  
  if (![0, 1, 2].includes(data.restingECG)) {
    return { valid: false, error: 'Invalid resting ECG' };
  }
  
  if (data.maxHR < 0 || data.maxHR > 300) {
    return { valid: false, error: 'Max HR must be between 0 and 300' };
  }
  
  if (![0, 1].includes(data.exerciseAngina)) {
    return { valid: false, error: 'Exercise angina must be 0 or 1' };
  }
  
  if (data.oldpeak < -10 || data.oldpeak > 10) {
    return { valid: false, error: 'Oldpeak must be between -10 and 10' };
  }
  
  if (![0, 1, 2].includes(data.stSlope)) {
    return { valid: false, error: 'Invalid ST slope' };
  }
  
  return { valid: true };
}

module.exports = {
  runPrediction,
  validatePredictionData,
  simplePrediction
}; 