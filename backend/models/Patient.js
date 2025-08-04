const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'P' + Date.now().toString().slice(-8);
    }
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: {
    conditions: [String],
    medications: [String],
    allergies: [String],
    surgeries: [String]
  },
  lifestyle: {
    smoking: {
      type: Boolean,
      default: false
    },
    alcohol: {
      type: Boolean,
      default: false
    },
    exercise: {
      type: String,
      enum: ['none', 'light', 'moderate', 'heavy'],
      default: 'none'
    },
    diet: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'fair'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
patientSchema.index({ patientId: 1 });
patientSchema.index({ name: 1 });
patientSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Patient', patientSchema); 