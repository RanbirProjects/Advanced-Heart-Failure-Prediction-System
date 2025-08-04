const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/patients
// @desc    Create a new patient
// @access  Private
router.post('/', protect, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
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
      name,
      age,
      gender,
      email,
      phone,
      address,
      emergencyContact,
      medicalHistory,
      lifestyle
    } = req.body;

    // Check if patient with same email already exists (if email provided)
    if (email) {
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({ error: 'Patient with this email already exists' });
      }
    }

    const patient = new Patient({
      name,
      age,
      gender,
      email,
      phone,
      address,
      emergencyContact,
      medicalHistory,
      lifestyle,
      createdBy: req.user.id
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Patient creation error:', error);
    res.status(500).json({ error: 'Server error creating patient' });
  }
});

// @route   GET /api/patients
// @desc    Get all patients for the user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user.id, isActive: true };

    // Add search filter
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { patientId: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add gender filter
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      patients,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Patients fetch error:', error);
    res.status(500).json({ error: 'Server error fetching patients' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get specific patient
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if user owns this patient or is admin/doctor
    if (patient.createdBy.toString() !== req.user.id && 
        !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    console.error('Patient fetch error:', error);
    res.status(500).json({ error: 'Server error fetching patient' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if user owns this patient or is admin/doctor
    if (patient.createdBy.toString() !== req.user.id && 
        !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if email is being updated and if it conflicts
    if (req.body.email && req.body.email !== patient.email) {
      const existingPatient = await Patient.findOne({ email: req.body.email });
      if (existingPatient) {
        return res.status(400).json({ error: 'Patient with this email already exists' });
      }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Patient update error:', error);
    res.status(500).json({ error: 'Server error updating patient' });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if user owns this patient or is admin
    if (patient.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    patient.isActive = false;
    await patient.save();

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Patient delete error:', error);
    res.status(500).json({ error: 'Server error deleting patient' });
  }
});

// @route   GET /api/patients/:id/predictions
// @desc    Get all predictions for a specific patient
// @access  Private
router.get('/:id/predictions', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if user owns this patient or is admin/doctor
    if (patient.createdBy.toString() !== req.user.id && 
        !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const Prediction = require('../models/Prediction');
    const predictions = await Prediction.find({
      patient: req.params.id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email');

    const total = await Prediction.countDocuments({
      patient: req.params.id,
      isActive: true
    });

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
    console.error('Patient predictions fetch error:', error);
    res.status(500).json({ error: 'Server error fetching patient predictions' });
  }
});

// @route   GET /api/patients/stats/overview
// @desc    Get patient statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgAge: { $avg: '$age' },
          maleCount: {
            $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] }
          },
          femaleCount: {
            $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] }
          }
        }
      }
    ]);

    const ageGroupStats = await Patient.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: {
            $cond: [
              { $lt: ['$age', 30] },
              '18-29',
              {
                $cond: [
                  { $lt: ['$age', 50] },
                  '30-49',
                  {
                    $cond: [
                      { $lt: ['$age', 70] },
                      '50-69',
                      '70+'
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Patient.aggregate([
      { $match: { createdBy: req.user._id, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        avgAge: 0,
        maleCount: 0,
        femaleCount: 0
      },
      ageGroupStats,
      monthlyStats
    });
  } catch (error) {
    console.error('Patient stats fetch error:', error);
    res.status(500).json({ error: 'Server error fetching patient statistics' });
  }
});

module.exports = router; 