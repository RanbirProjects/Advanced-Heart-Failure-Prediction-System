import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'heart' | 'dots';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  if (variant === 'heart') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-primary-500"
        >
          <Heart className={sizeClasses[size]} fill="currentColor" />
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${textSizes[size]} text-gray-600 font-medium`}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-primary-500 rounded-full"
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${textSizes[size]} text-gray-600 font-medium`}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} relative`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-500 rounded-full`}
        />
        {size === 'lg' || size === 'xl' ? (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`${sizeClasses[size]} absolute inset-0 border-4 border-transparent border-r-secondary-500 rounded-full`}
          />
        ) : null}
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${textSizes[size]} text-gray-600 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner; 