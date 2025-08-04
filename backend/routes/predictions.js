const express = require('express');
const { body, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');
const Patient = require('../models/Patient');
const { protect, authorize } = require('../middleware/auth');
const { runPrediction } = require('../utils/mlPredictor');

const router = express.Router();

// @route   POST /api/predictions
// @desc    Create a new heart failure prediction
// @access  Private
router.post('/', protect, [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
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
      patientId,
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
      stSlope,
      notes
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

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

    // Get prediction from ML model
    const mlResult = await runPrediction(predictionData);
    
    if (!mlResult.success) {
      return res.status(500).json({ error: 'Prediction failed', details: mlResult.error });
    }

    // Create prediction record
    const prediction = new Prediction({
      patient: patientId,
      createdBy: req.user.id,
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
      stSlope,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence || 0.85,
      notes,
      recommendations: generateRecommendations(mlResult.prediction, predictionData)
    });

    await prediction.save();

    // Populate patient info
    await prediction.populate('patient', 'name patientId age gender');

    res.status(201).json({
      success: true,
      message: 'Prediction created successfully',
      prediction
    });
  } catch (error) {
    console.error('Prediction creation error:', error);
    res.status(500).json({ error: 'Server error creating prediction' });
  }
});

// @route   GET /api/predictions
// @desc    Get all predictions for the user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user.id, isActive: true };

    // Add filters
    if (req.query.riskLevel) {
      query.riskLevel = req.query.riskLevel;
    }
    if (req.query.patientId) {
      query.patient = req.query.patientId;
    }

    const predictions = await Prediction.find(query)
      .populate('patient', 'name patientId age gender')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Prediction.countDocuments(query);

    res.json({
      success: true,
      predictions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Predictions fetch error:', error);
    res.status(500).json({ error: 'Server error fetching predictions' });
  }
});

// @route   GET /api/predictions/:id
// @desc    Get specific prediction
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate('patient', 'name patientId age gender')
      .populate('createdBy', 'name email');

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    // Check if user owns this prediction or is admin/doctor
    if (prediction.createdBy._id.toString() !== req.user.id && 
        !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Prediction fetch error:', error);
    res.status(500).json({ error: 'Server error fetching prediction' });
  }
});

// @route   PUT /api/predictions/:id
// @desc    Update prediction notes and recommendations
// @access  Private
router.put('/:id', protect, [
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes too long'),
  body('recommendations').optional().isArray().withMessage('Recommendations must be an array'),
  body('followUpDate').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    // Check if user owns this prediction or is admin/doctor
    if (prediction.createdBy.toString() !== req.user.id && 
        !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { notes, recommendations, followUpDate } = req.body;
    const updateFields = {};

    if (notes !== undefined) updateFields.notes = notes;
    if (recommendations !== undefined) updateFields.recommendations = recommendations;
    if (followUpDate !== undefined) updateFields.followUpDate = followUpDate;

    const updatedPrediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('patient', 'name patientId age gender');

    res.json({
      success: true,
      message: 'Prediction updated successfully',
      prediction: updatedPrediction
    });
  } catch (error) {
    console.error('Prediction update error:', error);
    res.status(500).json({ error: 'Server error updating prediction' });
  }
});

// @route   DELETE /api/predictions/:id
// @desc    Delete prediction (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    // Check if user owns this prediction or is admin
    if (prediction.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    prediction.isActive = false;
    await prediction.save();

    res.json({
      success: true,
      message: 'Prediction deleted successfully'
    });
  } catch (error) {
    console.error('Prediction delete error:', error);
    res.status(500).json({ error: 'Server error deleting prediction' });
  }
});

// @route   GET /api/predictions/stats/overview
// @desc    Get prediction statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Prediction.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgPrediction: { $avg: '$prediction' },
          highRisk: {
            $sum: { $cond: [{ $gte: ['$prediction', 0.5] }, 1, 0] }
          },
          criticalRisk: {
            $sum: { $cond: [{ $gte: ['$prediction', 0.75] }, 1, 0] }
          }
        }
      }
    ]);

    const riskLevelStats = await Prediction.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Prediction.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          avgPrediction: { $avg: '$prediction' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        avgPrediction: 0,
        highRisk: 0,
        criticalRisk: 0
      },
      riskLevelStats,
      monthlyStats
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

// Helper function to generate recommendations based on prediction
function generateRecommendations(prediction, data) {
  const recommendations = [];

  if (prediction >= 0.75) {
    recommendations.push('Immediate medical consultation required');
    recommendations.push('Consider emergency care if symptoms worsen');
  } else if (prediction >= 0.5) {
    recommendations.push('Schedule follow-up with cardiologist');
    recommendations.push('Monitor symptoms closely');
  } else if (prediction >= 0.25) {
    recommendations.push('Regular health check-ups recommended');
    recommendations.push('Maintain healthy lifestyle habits');
  } else {
    recommendations.push('Continue with preventive care');
    recommendations.push('Regular exercise and healthy diet');
  }

  // Specific recommendations based on data
  if (data.restingBP > 140) {
    recommendations.push('Blood pressure management needed');
  }
  if (data.cholesterol > 200) {
    recommendations.push('Cholesterol management recommended');
  }
  if (data.fastingBS === 1) {
    recommendations.push('Blood sugar monitoring advised');
  }

  return recommendations;
}

module.exports = router; 