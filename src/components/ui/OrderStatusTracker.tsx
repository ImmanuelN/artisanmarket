import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CogIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PhotoIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import Modal from './Modal';

interface DeliveryProof {
  _id: string;
  order: string; // ObjectId reference to Order
  vendor: string; // ObjectId reference to Vendor
  imageUrl: string;
  imageId: string;
  arrivalNotes?: string;
  processingLocation?: {
    section?: string;
    bay?: string;
    warehouse?: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'requires_review';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

interface OrderStatusTrackerProps {
  order: OrderStatus;
  orderNumber: string;
  deliveryProof?: DeliveryProof | null;
}

const statusSteps = [
  {
    key: 'pending',
    label: 'Order Pending',
    description: 'Order has been placed and is awaiting processing',
    icon: ClockIcon,
    color: 'yellow'
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Order is being prepared and processed',
    icon: CogIcon,
    color: 'blue'
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Order has been shipped and is on its way',
    icon: TruckIcon,
    color: 'purple'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Order has been delivered successfully',
    icon: CheckCircleIcon,
    color: 'green'
  }
];

const getStatusColors = (status: string, isActive: boolean, isCompleted: boolean) => {
  if (status === 'cancelled') {
    return {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: 'text-red-600'
    };
  }
  
  if (isCompleted) {
    return {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: 'text-green-600'
    };
  }
  
  if (isActive) {
    return {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-700',
      icon: 'text-blue-600'
    };
  }
  
  return {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-500',
    icon: 'text-gray-400'
  };
};

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order, orderNumber, deliveryProof }) => {
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
    title: string;
  }>({
    isOpen: false,
    imageUrl: null,
    title: ''
  });

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'cancelled';

  const getStepStatus = (stepIndex: number) => {
    if (isCancelled && stepIndex > 0) {
      return 'cancelled';
    }
    if (stepIndex < currentStatusIndex) {
      return 'completed';
    }
    if (stepIndex === currentStatusIndex) {
      return 'active';
    }
    return 'pending';
  };

  const renderStatusIcon = (step: any, stepStatus: string) => {
    const IconComponent = step.icon;
    const colors = getStatusColors(step.key, stepStatus === 'active', stepStatus === 'completed');

    if (stepStatus === 'completed') {
      return (
        <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
          <CheckCircleIconSolid className={`w-5 h-5 ${colors.icon}`} />
        </div>
      );
    }

    if (stepStatus === 'cancelled') {
      return (
        <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
          <XCircleIcon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      );
    }

    return (
      <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
      </div>
    );
  };

  const renderConnector = (stepIndex: number) => {
    if (stepIndex === statusSteps.length - 1) return null;

    const isCompleted = stepIndex < currentStatusIndex && !isCancelled;
    const isCancelledSection = isCancelled && stepIndex >= currentStatusIndex;

    return (
      <div className="flex-1 flex items-center px-2">
        <div
          className={`h-0.5 w-full ${
            isCompleted 
              ? 'bg-green-400' 
              : isCancelledSection 
                ? 'bg-red-300' 
                : 'bg-gray-300'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status Tracking</h3>
        <p className="text-sm text-gray-600">
          Track your order progress from placement to delivery
        </p>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <div className="flex items-center">
          {statusSteps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const colors = getStatusColors(step.key, stepStatus === 'active', stepStatus === 'completed');

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {renderStatusIcon(step, stepStatus)}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${colors.text}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
                {renderConnector(index)}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current Status Description */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          {isCancelled ? (
            <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
          ) : (
            (() => {
              const currentStep = statusSteps[currentStatusIndex];
              const IconComponent = currentStep?.icon || ClockIcon;
              return <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />;
            })()
          )}
          <div>
            <h4 className="font-medium text-gray-900">
              {isCancelled ? 'Order Cancelled' : statusSteps[currentStatusIndex]?.label}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {isCancelled 
                ? 'This order has been cancelled and will not be processed further.'
                : statusSteps[currentStatusIndex]?.description
              }
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        {/* Tracking Information */}
        {order.trackingNumber && order.status === 'shipped' && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Tracking Number</p>
                <p className="text-sm text-blue-700">{order.trackingNumber}</p>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Track Package
                </a>
              )}
            </div>
          </div>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDelivery && !isCancelled && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900">Estimated Delivery</p>
            <p className="text-sm text-green-700">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Delivery Proof */}
        {deliveryProof && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <PhotoIcon className="w-5 h-5 text-purple-600" />
                <p className="font-medium text-purple-900">Delivery Proof</p>
                {deliveryProof.verificationStatus === 'approved' && (
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Approved</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setImageModal({
                  isOpen: true,
                  imageUrl: deliveryProof.imageUrl,
                  title: `Delivery Proof - Order #${orderNumber}`
                })}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                <span>View Proof</span>
              </button>
            </div>
            <div className="text-sm text-purple-700 space-y-1">
              <p>Status: <span className="font-medium">{deliveryProof.verificationStatus}</span></p>
              <p>Uploaded: {new Date(deliveryProof.uploadedAt || deliveryProof.createdAt).toLocaleString()}</p>
              {deliveryProof.processingLocation && (
                <p>Location: <span className="font-medium">
                  {[
                    deliveryProof.processingLocation.warehouse,
                    deliveryProof.processingLocation.section,
                    deliveryProof.processingLocation.bay
                  ].filter(Boolean).join(', ')}
                </span></p>
              )}
              {deliveryProof.arrivalNotes && (
                <div className="mt-2 p-2 bg-purple-100 rounded text-xs">
                  <p className="font-medium">Notes:</p>
                  <p>{deliveryProof.arrivalNotes}</p>
                </div>
              )}
              {deliveryProof.adminNotes && (
                <div className="mt-2 p-2 bg-purple-100 rounded text-xs">
                  <p className="font-medium">Admin Notes:</p>
                  <p>{deliveryProof.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ isOpen: false, imageUrl: null, title: '' })}
        title={imageModal.title}
        size="3xl"
      >
        <div className="flex justify-center">
          <img
            src={imageModal.imageUrl || ''}
            alt="Delivery proof"
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrderStatusTracker;
