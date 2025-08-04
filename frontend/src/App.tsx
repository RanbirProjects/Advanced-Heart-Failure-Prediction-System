import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Activity, Users, BarChart3, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-20 flex flex-col items-center text-center"
      >
        <div className="mb-6 flex items-center justify-center">
          <Heart className="h-10 w-10 text-red-500 mr-2" />
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">HeartCare</h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 max-w-3xl">
          Advanced Heart Failure Prediction System
        </h2>
        
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Empowering healthcare providers with AI-driven insights for better patient outcomes
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Explore System <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Activity className="h-6 w-6 text-blue-600" />}
            title="AI-Powered Predictions"
            description="Leverage advanced machine learning algorithms to predict heart failure risks with high accuracy."
          />
          
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-blue-600" />}
            title="Secure & Private"
            description="Your patient data is protected with enterprise-grade security and encryption protocols."
          />
          
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
            title="Comprehensive Analytics"
            description="Gain valuable insights through detailed reports and visual analytics dashboards."
          />
          
          <FeatureCard 
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Multi-user Support"
            description="Collaborate with your healthcare team through role-based access controls."
          />
          
          <FeatureCard 
            icon={<Activity className="h-6 w-6 text-blue-600" />}
            title="Real-time Analysis"
            description="Get instant predictions and analysis to make timely clinical decisions."
          />
          
          <FeatureCard 
            icon={<Heart className="h-6 w-6 text-blue-600" />}
            title="Patient-Centric Care"
            description="Focus on delivering personalized care based on individual risk profiles."
          />
        </div>
      </motion.div>
      
      {/* Testimonial Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-blue-600 py-16 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Healthcare Professionals</h2>
          <div className="max-w-4xl mx-auto p-6 bg-blue-700 rounded-xl shadow-lg">
            <p className="text-xl italic mb-6">
              "HeartCare has revolutionized how we approach cardiac risk assessment. The predictive accuracy and intuitive interface have made it an indispensable tool in our practice."
            </p>
            <p className="font-semibold">Dr. Sarah Johnson</p>
            <p className="text-blue-200">Cardiologist, Memorial Hospital</p>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-2xl font-bold">HeartCare</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Advanced heart failure prediction system powered by machine learning, helping healthcare providers make better decisions.  
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HeartCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  );
};

export default App;
