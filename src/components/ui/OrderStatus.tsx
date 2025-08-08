import { CheckIcon, ClockIcon, TruckIcon, HomeIcon } from '@heroicons/react/24/outline';

interface OrderStatusProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  className?: string;
}

const OrderStatus = ({ status, className = '' }: OrderStatusProps) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: ClockIcon
    },
    processing: {
      label: 'Processing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: ClockIcon
    },
    shipped: {
      label: 'Shipped',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: TruckIcon
    },
    delivered: {
      label: 'Delivered',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: HomeIcon
    },
    cancelled: {
      label: 'Cancelled',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: CheckIcon
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </div>
  );
};

export default OrderStatus; 