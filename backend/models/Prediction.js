const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Medical parameters for heart failure prediction
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  chestPainType: {
    type: String,
    enum: ['typical angina', 'atypical angina', 'non-anginal pain', 'asymptomatic'],
    required: true
  },
  restingBP: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  cholesterol: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  fastingBS: {
    type: Number,
    enum: [0, 1], // 0: <= 120 mg/dl, 1: > 120 mg/dl
    required: true
  },
  restingECG: {
    type: String,
    enum: ['normal', 'ST-T wave abnormality', 'left ventricular hypertrophy'],
    required: true
  },
  maxHR: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  exerciseAngina: {
    type: Boolean,
    required: true
  },
  oldpeak: {
    type: Number,
    required: true,
    min: -10,
    max: 10
  },
  stSlope: {
    type: String,
    enum: ['up', 'flat', 'down'],
    required: true
  },
  // Prediction results
  prediction: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  // Additional metadata
  notes: {
    type: String,
    maxlength: 1000
  },
  recommendations: [{
    type: String,
    maxlength: 500
  }],
  followUpDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate risk level based on prediction probability
predictionSchema.pre('save', function(next) {
  if (this.prediction !== undefined) {
    if (this.prediction < 0.25) {
      this.riskLevel = 'low';
    } else if (this.prediction < 0.5) {
      this.riskLevel = 'medium';
    } else if (this.prediction < 0.75) {
      this.riskLevel = 'high';
    } else {
      this.riskLevel = 'critical';
    }
  }
  next();
});

// Indexes for better query performance
predictionSchema.index({ patient: 1, createdAt: -1 });
predictionSchema.index({ createdBy: 1, createdAt: -1 });
predictionSchema.index({ riskLevel: 1 });
predictionSchema.index({ prediction: 1 });

// Virtual for formatted prediction percentage
predictionSchema.virtual('predictionPercentage').get(function() {
  return Math.round(this.prediction * 100);
});

// Ensure virtuals are included in JSON output
predictionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Prediction', predictionSchema); 