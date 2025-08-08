import React from 'react';
import { Container, Card, Button } from '../../components/ui';
import { BankAccountSetup, FinancialSummary } from '../../components/vendor';

const BankTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Account Setup Test</h1>
          <p className="text-gray-600">
            Test the bank account setup and financial management functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BankAccountSetup />
          <FinancialSummary />
        </div>

        <Card className="mt-8">
          <Card.Content>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Click "Connect Bank Account" to test the Plaid integration</p>
              <p>2. Use Plaid's sandbox credentials for testing</p>
              <p>3. Try requesting a payout to test the financial functionality</p>
              <p>4. Check the browser console for API responses</p>
            </div>
          </Card.Content>
        </Card>
      </Container>
    </div>
  );
};

export default BankTestPage; 