const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { runPrediction, validatePredictionData } = require('../utils/mlPredictor');

const router = express.Router();

// @route   POST /api/ml/predict
// @desc    Get heart failure prediction from ML model
// @access  Private
router.post('/predict', protect, [
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('sex').isIn(['male', 'female']).withMessage('Sex must be male or female'),
  body('chestPainType').isIn(['typical angina', 'atypical angina', 'non-anginal pain', 'asymptomatic']).withMessage('Invalid chest pain type'),
  body('restingBP').isInt({ min: 0, max: 300 }).withMessage('Resting BP must be between 0 and 300'),
  body('cholesterol').isInt({ min: 0, max: 1000 }).withMessage('Cholesterol must be between 0 and 1000'),
  body('fastingBS').isIn([0, 1]).withMessage('Fasting BS must be 0 or 1'),
  body('restingECG').isIn(['normal', 'ST-T wave abnormality', 'left ventricular hypertrophy']).withMessage('Invalid resting ECG'),
  body('maxHR').isInt({ min: 0, max: 300 }).withMessage('Max HR must be between 0 and 300'),
  body('exerciseAngina').isBoolean().withMessage('Exercise angina must be boolean'),
  body('oldpeak').isFloat({ min: -10, max: 10 }).withMessage('Oldpeak must be between -10 and 10'),
  body('stSlope').isIn(['up', 'flat', 'down']).withMessage('ST slope must be up, flat, or down')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const {
      age,
      sex,
      chestPainType,
      restingBP,
      cholesterol,
      fastingBS,
      restingECG,
      maxHR,
      exerciseAngina,
      oldpeak,
      stSlope
    } = req.body;

    // Prepare data for ML prediction
    const predictionData = {
      age,
      sex: sex === 'male' ? 1 : 0,
      chestPainType: ['typical angina', 'atypical angina', 'non-anginal pain', 'asymptomatic'].indexOf(chestPainType),
      restingBP,
      cholesterol,
      fastingBS,
      restingECG: ['normal', 'ST-T wave abnormality', 'left ventricular hypertrophy'].indexOf(restingECG),
      maxHR,
      exerciseAngina: exerciseAngina ? 1 : 0,
      oldpeak,
      stSlope: ['up', 'flat', 'down'].indexOf(stSlope)
    };

    // Validate data
    const validation = validatePredictionData(predictionData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Get prediction from ML model
    const result = await runPrediction(predictionData);
    
    if (!result.success) {
      return res.status(500).json({ error: 'Prediction failed', details: result.error });
    }

    // Calculate risk level
    let riskLevel = 'low';
    if (result.prediction >= 0.75) {
      riskLevel = 'critical';
    } else if (result.prediction >= 0.5) {
      riskLevel = 'high';
    } else if (result.prediction >= 0.25) {
      riskLevel = 'medium';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(result.prediction, predictionData);

    res.json({
      success: true,
      prediction: {
        probability: result.prediction,
        percentage: Math.round(result.prediction * 100),
        riskLevel,
        confidence: result.confidence,
        method: result.method,
        recommendations,
        inputData: {
          age,
          sex,
          chestPainType,
          restingBP,
          cholesterol,
          fastingBS,
          restingECG,
          maxHR,
          exerciseAngina,
          oldpeak,
          stSlope
        }
      }
    });
  } catch (error) {
    console.error('ML prediction error:', error);
    res.status(500).json({ error: 'Server error during prediction' });
  }
});

// @route   GET /api/ml/model-info
// @desc    Get information about the ML model
// @access  Private
router.get('/model-info', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      model: {
        name: 'Heart Failure Prediction Model',
        version: '1.0.0',
        description: 'Machine learning model for predicting heart failure risk based on clinical parameters',
        algorithm: 'Random Forest Classifier',
        accuracy: '0.89',
        features: [
          'Age',
          'Sex',
          'Chest Pain Type',
          'Resting Blood Pressure',
          'Cholesterol',
          'Fasting Blood Sugar',
          'Resting ECG',
          'Maximum Heart Rate',
          'Exercise Angina',
          'ST Depression',
          'ST Slope'
        ],
        riskLevels: {
          low: '0-24%',
          medium: '25-49%',
          high: '50-74%',
          critical: '75-100%'
        },
        lastUpdated: '2024-01-15',
        dataSource: 'Clinical heart disease dataset'
      }
    });
  } catch (error) {
    console.error('Model info error:', error);
    res.status(500).json({ error: 'Server error fetching model information' });
  }
});

// @route   POST /api/ml/batch-predict
// @desc    Get predictions for multiple patients
// @access  Private (Admin/Doctor only)
router.post('/batch-predict', protect, authorize('admin', 'doctor'), [
  body('patients').isArray({ min: 1, max: 50 }).withMessage('Must provide 1-50 patients'),
  body('patients.*.age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('patients.*.sex').isIn(['male', 'female']).withMessage('Sex must be male or female'),
  body('patients.*.chestPainType').isIn(['typical angina', 'atypical angina', 'non-anginal pain', 'asymptomatic']).withMessage('Invalid chest pain type'),
  body('patients.*.restingBP').isInt({ min: 0, max: 300 }).withMessage('Resting BP must be between 0 and 300'),
  body('patients.*.cholesterol').isInt({ min: 0, max: 1000 }).withMessage('Cholesterol must be between 0 and 1000'),
  body('patients.*.fastingBS').isIn([0, 1]).withMessage('Fasting BS must be 0 or 1'),
  body('patients.*.restingECG').isIn(['normal', 'ST-T wave abnormality', 'left ventricular hypertrophy']).withMessage('Invalid resting ECG'),
  body('patients.*.maxHR').isInt({ min: 0, max: 300 }).withMessage('Max HR must be between 0 and 300'),
  body('patients.*.exerciseAngina').isBoolean().withMessage('Exercise angina must be boolean'),
  body('patients.*.oldpeak').isFloat({ min: -10, max: 10 }).withMessage('Oldpeak must be between -10 and 10'),
  body('patients.*.stSlope').isIn(['up', 'flat', 'down']).withMessage('ST slope must be up, flat, or down')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { patients } = req.body;
    const results = [];

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      
      const predictionData = {
        age: patient.age,
        sex: patient.sex === 'male' ? 1 : 0,
        chestPainType: ['typical angina', 'atypical angina', 'non-anginal pain', 'asymptomatic'].indexOf(patient.chestPainType),
        restingBP: patient.restingBP,
        cholesterol: patient.cholesterol,
        fastingBS: patient.fastingBS,
        restingECG: ['normal', 'ST-T wave abnormality', 'left ventricular hypertrophy'].indexOf(patient.restingECG),
        maxHR: patient.maxHR,
        exerciseAngina: patient.exerciseAngina ? 1 : 0,
        oldpeak: patient.oldpeak,
        stSlope: ['up', 'flat', 'down'].indexOf(patient.stSlope)
      };

      const result = await runPrediction(predictionData);
      
      let riskLevel = 'low';
      if (result.prediction >= 0.75) {
        riskLevel = 'critical';
      } else if (result.prediction >= 0.5) {
        riskLevel = 'high';
      } else if (result.prediction >= 0.25) {
        riskLevel = 'medium';
      }

      results.push({
        patientIndex: i,
        patientId: patient.patientId || `patient_${i}`,
        prediction: {
          probability: result.prediction,
          percentage: Math.round(result.prediction * 100),
          riskLevel,
          confidence: result.confidence,
          method: result.method
        },
        success: result.success,
        error: result.error || null
      });
    }

    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        riskDistribution: {
          low: results.filter(r => r.success && r.prediction.riskLevel === 'low').length,
          medium: results.filter(r => r.success && r.prediction.riskLevel === 'medium').length,
          high: results.filter(r => r.success && r.prediction.riskLevel === 'high').length,
          critical: results.filter(r => r.success && r.prediction.riskLevel === 'critical').length
        }
      }
    });
  } catch (error) {
    console.error('Batch prediction error:', error);
    res.status(500).json({ error: 'Server error during batch prediction' });
  }
});

// Helper function to generate recommendations
function generateRecommendations(prediction, data) {
  const recommendations = [];

  if (prediction >= 0.75) {
    recommendations.push('🚨 Immediate medical consultation required');
    recommendations.push('🏥 Consider emergency care if symptoms worsen');
    recommendations.push('📞 Contact cardiologist immediately');
  } else if (prediction >= 0.5) {
    recommendations.push('👨‍⚕️ Schedule follow-up with cardiologist');
    recommendations.push('📊 Monitor symptoms closely');
    recommendations.push('💊 Review current medications');
  } else if (prediction >= 0.25) {
    recommendations.push('🏥 Regular health check-ups recommended');
    recommendations.push('💪 Maintain healthy lifestyle habits');
    recommendations.push('🥗 Focus on heart-healthy diet');
  } else {
    recommendations.push('✅ Continue with preventive care');
    recommendations.push('🏃‍♂️ Regular exercise and healthy diet');
    recommendations.push('🚭 Avoid smoking and excessive alcohol');
  }

  // Specific recommendations based on data
  if (data.restingBP > 140) {
    recommendations.push('🩺 Blood pressure management needed');
  }
  if (data.cholesterol > 200) {
    recommendations.push('🧬 Cholesterol management recommended');
  }
  if (data.fastingBS === 1) {
    recommendations.push('🩸 Blood sugar monitoring advised');
  }
  if (data.exerciseAngina === 1) {
    recommendations.push('💓 Exercise stress test recommended');
  }

  return recommendations;
}

module.exports = router; 