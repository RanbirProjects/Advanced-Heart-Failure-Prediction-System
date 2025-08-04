import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">Manage patient records</p>
        </div>
        <Link to="/patients/new" className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
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
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
            <p className="text-gray-600 mb-6">Add your first patient to get started.</p>
            <Link to="/patients/new" className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Add Patient
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientsPage; 