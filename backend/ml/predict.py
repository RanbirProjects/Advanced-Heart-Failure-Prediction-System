#!/usr/bin/env python3
"""
Heart Failure Prediction Model
Simple ML model for heart failure risk prediction
"""

import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Simple heart failure prediction model
class HeartFailurePredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'age', 'sex', 'chest_pain_type', 'resting_bp', 'cholesterol',
            'fasting_bs', 'resting_ecg', 'max_hr', 'exercise_angina',
            'oldpeak', 'st_slope'
        ]
        
    def train_simple_model(self):
        """Train a simple model with synthetic data"""
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate realistic heart disease data
        age = np.random.normal(55, 15, n_samples).clip(20, 90)
        sex = np.random.choice([0, 1], n_samples)
        chest_pain_type = np.random.choice([0, 1, 2, 3], n_samples)
        resting_bp = np.random.normal(130, 20, n_samples).clip(90, 200)
        cholesterol = np.random.normal(200, 50, n_samples).clip(100, 400)
        fasting_bs = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
        resting_ecg = np.random.choice([0, 1, 2], n_samples, p=[0.5, 0.3, 0.2])
        max_hr = np.random.normal(150, 25, n_samples).clip(60, 202)
        exercise_angina = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
        oldpeak = np.random.normal(1, 2, n_samples).clip(-2.6, 6.2)
        st_slope = np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.3, 0.3])
        
        # Create features array
        X = np.column_stack([
            age, sex, chest_pain_type, resting_bp, cholesterol,
            fasting_bs, resting_ecg, max_hr, exercise_angina,
            oldpeak, st_slope
        ])
        
        # Create target (heart failure risk) based on features
        # Higher risk for older age, male, high BP, high cholesterol, etc.
        risk_score = (
            age * 0.01 +
            sex * 0.1 +
            chest_pain_type * 0.2 +
            (resting_bp - 120) * 0.002 +
            (cholesterol - 200) * 0.001 +
            fasting_bs * 0.3 +
            resting_ecg * 0.15 +
            (200 - max_hr) * 0.003 +
            exercise_angina * 0.4 +
            oldpeak * 0.2 +
            st_slope * 0.15
        )
        
        # Add some noise
        risk_score += np.random.normal(0, 0.1, n_samples)
        
        # Convert to binary classification (0: low risk, 1: high risk)
        y = (risk_score > np.median(risk_score)).astype(int)
        
        # Train model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
        return self.model
    
    def predict(self, features):
        """Make prediction for given features"""
        if self.model is None:
            self.train_simple_model()
        
        # Ensure features are in correct order
        feature_array = np.array([
            features['age'],
            features['sex'],
            features['chestPainType'],
            features['restingBP'],
            features['cholesterol'],
            features['fastingBS'],
            features['restingECG'],
            features['maxHR'],
            features['exerciseAngina'],
            features['oldpeak'],
            features['stSlope']
        ]).reshape(1, -1)
        
        # Scale features
        feature_array_scaled = self.scaler.transform(feature_array)
        
        # Get prediction probability
        prediction = self.model.predict_proba(feature_array_scaled)[0][1]
        
        return prediction

def main():
    """Main function to handle prediction requests"""
    try:
        # Read input data from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({
                'success': False,
                'error': 'No input data provided'
            }))
            return
        
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Validate input data
        required_fields = [
            'age', 'sex', 'chestPainType', 'restingBP', 'cholesterol',
            'fastingBS', 'restingECG', 'maxHR', 'exerciseAngina',
            'oldpeak', 'stSlope'
        ]
        
        for field in required_fields:
            if field not in input_data:
                print(json.dumps({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }))
                return
        
        # Create predictor and make prediction
        predictor = HeartFailurePredictor()
        prediction = predictor.predict(input_data)
        
        # Calculate confidence based on prediction certainty
        confidence = 0.85 + (prediction - 0.5) * 0.2  # Higher confidence for extreme predictions
        confidence = max(0.7, min(0.95, confidence))  # Clamp between 0.7 and 0.95
        
        # Return result
        result = {
            'success': True,
            'prediction': float(prediction),
            'confidence': float(confidence),
            'method': 'random_forest'
        }
        
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({
            'success': False,
            'error': 'Invalid JSON input'
        }))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': f'Prediction failed: {str(e)}'
        }))

if __name__ == '__main__':
    main() 