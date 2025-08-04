import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Activity,
  Clock,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms provide accurate heart failure risk assessments with 89% accuracy.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your patient data is encrypted and secure. HIPAA compliant with enterprise-grade security.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Get instant predictions and recommendations. No waiting, immediate results for better patient care.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Perfect for hospitals, clinics, and healthcare providers. Role-based access control.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Detailed reports, trends, and insights to track patient progress and outcomes.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Globe,
      title: 'Cloud-Based',
      description: 'Access from anywhere, anytime. No installation required, works on all devices.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const benefits = [
    'Early detection of heart failure risk',
    'Personalized treatment recommendations',
    'Reduced healthcare costs',
    'Improved patient outcomes',
    'Evidence-based decision making',
    '24/7 availability'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">HeartCare</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 px-3 py-2 text-sm font-medium">Welcome to HeartCare</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Advanced{' '}
                <span className="text-primary-600">Heart Failure</span>
                <br />
                Prediction System
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                Leverage the power of machine learning to predict heart failure risk with unprecedented accuracy. 
                Our AI-powered system helps healthcare providers make informed decisions and improve patient outcomes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="btn-outline text-lg px-8 py-3"
              >
                View Demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>89% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 opacity-10"
        >
          <Heart className="h-32 w-32 text-primary-500" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-10 opacity-10"
        >
          <Activity className="h-24 w-24 text-secondary-500" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose HeartCare?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our comprehensive solution combines cutting-edge technology with healthcare expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="card hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="card-body">
                      <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Transform Your Healthcare Practice
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of healthcare providers who trust HeartCare for accurate, 
                reliable heart failure predictions and improved patient care.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card bg-white shadow-xl">
                <div className="card-body p-8">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Welcome to HeartCare
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Advanced heart failure prediction system
                    </p>
                  </div>
                  <div className="space-y-4">
                    <button
                      className="btn-primary w-full justify-center"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Learn More
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Helping healthcare providers make better decisions
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold">HeartCare</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Advanced heart failure prediction system powered by machine learning. 
                Helping healthcare providers make better decisions for their patients.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HeartCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;