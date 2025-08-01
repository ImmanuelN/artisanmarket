import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  ChartBarIcon,
  CogIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Badge } from '../../components/ui';
import BankAccountSetup from '../../components/vendor/BankAccountSetup';
import FinancialSummary from '../../components/vendor/FinancialSummary';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';

const VendorBankDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'bank-setup' | 'payouts'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'bank-setup', name: 'Bank Setup', icon: BanknotesIcon },
    { id: 'payouts', name: 'Payouts', icon: CreditCardIcon },
  ];

  const handlePayoutRequested = () => {
    // Refresh data or show success message
    console.log('Payout requested successfully');
  };

  const handleBankSetupComplete = () => {
    setActiveTab('overview');
    // Refresh financial data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Management</h1>
              <p className="text-gray-600">
                Manage your bank account and payouts for {user?.name}
              </p>
            </div>
            <Badge variant="success" className="text-sm">
              Vendor Account
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FinancialSummary 
                onPayoutRequested={handlePayoutRequested}
                className="lg:col-span-1"
              />
              <BankAccountSetup 
                onSetupComplete={handleBankSetupComplete}
                className="lg:col-span-1"
              />
            </div>
          )}

          {/* Bank Setup Tab */}
          {activeTab === 'bank-setup' && (
            <div className="max-w-2xl mx-auto">
              <BankAccountSetup 
                onSetupComplete={handleBankSetupComplete}
              />
              
              {/* Additional Information */}
              <Card className="mt-8">
                <Card.Content>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About Bank Account Setup
                  </h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>
                        We use Plaid to securely connect your bank account. Plaid is trusted by thousands of financial institutions.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>
                        Your bank credentials are never stored on our servers. Plaid handles all authentication securely.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>
                        You can disconnect your bank account at any time from your account settings.
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="max-w-4xl mx-auto">
              <FinancialSummary 
                onPayoutRequested={handlePayoutRequested}
              />
              
              {/* Payout History */}
              <Card className="mt-8">
                <Card.Content>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payout History
                  </h3>
                  <div className="text-center py-8 text-gray-500">
                    <CreditCardIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No payout history yet</p>
                    <p className="text-sm">Your payout history will appear here once you make your first payout request.</p>
                  </div>
                </Card.Content>
              </Card>

              {/* Payout Information */}
              <Card className="mt-8">
                <Card.Content>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payout Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Processing Time</h4>
                      <p className="text-sm text-gray-600">
                        Payouts are typically processed within 1-3 business days after approval.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Minimum Payout</h4>
                      <p className="text-sm text-gray-600">
                        Minimum payout amount is $10.00. You can request payouts as often as needed.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fees</h4>
                      <p className="text-sm text-gray-600">
                        No fees for receiving payouts. Standard bank transfer fees may apply.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tax Information</h4>
                      <p className="text-sm text-gray-600">
                        You are responsible for reporting and paying taxes on your earnings.
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <Card>
            <Card.Content>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('bank-setup')}
                  className="flex items-center justify-center"
                >
                  <BanknotesIcon className="w-4 h-4 mr-2" />
                  Setup Bank Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('payouts')}
                  className="flex items-center justify-center"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendor/dashboard')}
                  className="flex items-center justify-center"
                >
                  <CogIcon className="w-4 h-4 mr-2" />
                  Vendor Settings
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default VendorBankDashboard; 