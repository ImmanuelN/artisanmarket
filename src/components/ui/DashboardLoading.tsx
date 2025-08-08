import React from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingStorefrontIcon, 
  UserIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface DashboardLoadingProps {
  userType: 'vendor' | 'customer';
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ userType }) => {
  const loadingSteps = userType === 'vendor' 
    ? [
        { icon: BuildingStorefrontIcon, text: 'Loading store profile...', delay: 0 },
        { icon: ShoppingBagIcon, text: 'Fetching products...', delay: 0.5 },
        { icon: ChartBarIcon, text: 'Gathering analytics...', delay: 1 },
        { icon: CreditCardIcon, text: 'Connecting services...', delay: 1.5 },
      ]
    : [
        { icon: UserIcon, text: 'Loading profile...', delay: 0 },
        { icon: ShoppingBagIcon, text: 'Fetching order history...', delay: 0.5 },
        { icon: CreditCardIcon, text: 'Loading preferences...', delay: 1 },
        { icon: SparklesIcon, text: 'Connecting services...', delay: 1.5 },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Main loading spinner */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto"
            >
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full"></div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <SparklesIcon className="w-6 h-6 text-amber-500" />
            </motion.div>
          </div>

          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Setting up your {userType} dashboard...
            </p>
          </motion.div>

          {/* Loading steps */}
          <div className="space-y-4">
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                className="flex items-center space-x-3 text-left"
              >
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-gray-700 text-sm">{step.text}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step.delay + 0.3 }}
                  className="ml-auto"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
              ></motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-xs text-gray-500 mt-2"
            >
              Almost ready...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLoading;
