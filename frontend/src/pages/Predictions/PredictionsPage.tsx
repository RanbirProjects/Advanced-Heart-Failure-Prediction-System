import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PredictionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600 mt-2">Manage heart failure predictions</p>
        </div>
        <Link to="/predictions/new" className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          New Prediction
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="card-body">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
            <p className="text-gray-600 mb-6">Create your first heart failure prediction to get started.</p>
            <Link to="/predictions/new" className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Create Prediction
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionsPage; 