import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge } from '../ui';
import { RootState } from '../../store/store';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';

interface FinancialData {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  totalPayouts: number;
  lastPayout: string | null;
  lastPayoutAmount: number;
  minimumPayoutAmount: number;
  commissionRate: number;
  isActive: boolean;
  bankAccount: {
    cardHolderName: string;
    bankName: string;
    isActive: boolean;
  } | null;
}

interface FinancialSummaryProps {
  className?: string;
  onPayoutRequested?: () => void;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ 
  className = '',
  onPayoutRequested 
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [isAddingEarnings, setIsAddingEarnings] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [earningsAmount, setEarningsAmount] = useState('');
  const [showAddEarnings, setShowAddEarnings] = useState(false);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      const response = await api.get('/vendor-balance/balance');
      setFinancialData(response.data.balance);
    } catch (error) {
      console.error('Error fetching financial summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      showErrorNotification('Please enter a valid payout amount');
      return;
    }

    if (!financialData?.bankAccount?.isActive) {
      showErrorNotification('Please connect an active bank account first');
      return;
    }

    if (parseFloat(payoutAmount) < financialData.minimumPayoutAmount) {
      showErrorNotification(`Minimum payout amount is $${financialData.minimumPayoutAmount.toFixed(2)}`);
      return;
    }

    if (parseFloat(payoutAmount) > financialData.availableBalance) {
      showErrorNotification('Insufficient available balance for this payout amount');
      return;
    }

    setIsProcessingPayout(true);
    try {
      const response = await api.post('/vendor-balance/payout', {
        amount: parseFloat(payoutAmount),
        description: 'Vendor payout request'
      });
      
      showSuccessNotification(`Payout of $${payoutAmount} processed successfully!`);
      setPayoutAmount('');
      await fetchFinancialSummary(); // Refresh financial data
      onPayoutRequested?.();
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to process payout');
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleAddEarnings = async () => {
    if (!earningsAmount || parseFloat(earningsAmount) <= 0) {
      showErrorNotification('Please enter a valid earnings amount');
      return;
    }

    setIsAddingEarnings(true);
    try {
      const response = await api.post('/vendor-balance/add-earnings', {
        amount: parseFloat(earningsAmount),
        description: 'Demo earnings'
      });
      
      showSuccessNotification(`Earnings of $${earningsAmount} added successfully!`);
      setEarningsAmount('');
      setShowAddEarnings(false);
      await fetchFinancialSummary(); // Refresh financial data
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to add earnings');
    } finally {
      setIsAddingEarnings(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <Card.Content>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!financialData) {
    return (
      <Card className={className}>
        <Card.Content>
          <div className="text-center text-gray-500">
            Failed to load financial data
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Content>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 text-amber-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
          </div>
          <Badge variant={financialData.bankAccount?.isActive ? "success" : "warning"}>
            {financialData.bankAccount?.isActive ? "Bank Connected" : "No Bank Account"}
          </Badge>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-900">
                  ${financialData.availableBalance.toFixed(2)}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Pending Balance</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${financialData.pendingBalance.toFixed(2)}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${financialData.totalEarnings.toFixed(2)}
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${financialData.totalPayouts.toFixed(2)}
                </p>
              </div>
              <ArrowDownTrayIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(financialData.commissionRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Platform Fee</p>
                <p className="text-sm text-gray-700">
                  You keep {(100 - financialData.commissionRate * 100).toFixed(1)}% of sales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Payout Info */}
        {financialData.lastPayout && (
          <div className="bg-amber-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Last Payout</p>
                <p className="text-lg font-semibold text-amber-900">
                  ${financialData.lastPayoutAmount.toFixed(2)}
                </p>
                <p className="text-xs text-amber-700">
                  {new Date(financialData.lastPayout).toLocaleDateString()}
                </p>
              </div>
              <ArrowDownTrayIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        )}

        {/* Demo Controls - Commented out for production */}
        {/* 
        <div className="border-t pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">Demo Controls</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddEarnings(!showAddEarnings)}
              className="flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              {showAddEarnings ? 'Hide' : 'Add Earnings'}
            </Button>
          </div>

          {showAddEarnings && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Demo Earnings
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={earningsAmount}
                      onChange={(e) => setEarningsAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddEarnings}
                  disabled={isAddingEarnings || !earningsAmount || parseFloat(earningsAmount) <= 0}
                  size="sm"
                >
                  {isAddingEarnings ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        */}

        {/* Payout Section */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Request Payout</h4>
          
          {!financialData.bankAccount?.isActive ? (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Bank account required for payouts
                  </p>
                  <p className="text-sm text-amber-700">
                    Please connect your bank account to request payouts.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    min={financialData.minimumPayoutAmount}
                    max={financialData.availableBalance}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: ${financialData.minimumPayoutAmount.toFixed(2)} | 
                  Maximum: ${financialData.availableBalance.toFixed(2)}
                </p>
              </div>

              <Button
                onClick={handlePayoutRequest}
                disabled={isProcessingPayout || !payoutAmount || parseFloat(payoutAmount) <= 0}
                className="w-full"
              >
                {isProcessingPayout ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payout...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Request Payout
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Payouts are processed within 1-3 business days
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default FinancialSummary; 