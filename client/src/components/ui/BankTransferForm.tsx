import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useSelector } from 'react-redux';
import { Button, Card, Input } from './index';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';
import { RootState } from '../../store/store';

interface BankTransferFormProps {
  amount: number;
  onTransferSuccess: (transferId: string) => void;
  onTransferError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  className?: string;
}

interface BankAccount {
  account_id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({
  amount,
  onTransferSuccess,
  onTransferError,
  isProcessing,
  setIsProcessing,
  className = ''
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [linkToken, setLinkToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLinkLoading, setIsLinkLoading] = useState(false);

  useEffect(() => {
    if (user) {
      createLinkToken();
    }
  }, [user]);

  const createLinkToken = async () => {
    try {
      setIsLinkLoading(true);
      const response = await api.post('/payments/create-link-token', {
        userId: user?.id || user?._id || 'default_user'
      });

      if (response.data.success) {
        setLinkToken(response.data.linkToken);
      } else {
        setError('Failed to initialize bank transfer');
      }
    } catch (error) {
      console.error('Error creating link token:', error);
      setError('Failed to initialize bank transfer');
    } finally {
      setIsLinkLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        // Exchange public token for access token
        const response = await api.post('/payments/exchange-token', {
          publicToken: public_token
        });

        if (response.data.success) {
          setAccessToken(response.data.accessToken);
          
          // Get bank accounts
          const accountsResponse = await api.post('/payments/get-accounts', {
            accessToken: response.data.accessToken
          });

          if (accountsResponse.data.success) {
            setAccounts(accountsResponse.data.accounts);
            if (accountsResponse.data.accounts.length > 0) {
              setSelectedAccount(accountsResponse.data.accounts[0].account_id);
            }
          }
        }
      } catch (error) {
        console.error('Error exchanging token:', error);
        setError('Failed to connect bank account');
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        setError('Failed to connect bank account');
      }
    },
  });

  const handleTransfer = async () => {
    if (!selectedAccount || !accessToken) {
      setError('Please connect a bank account first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await api.post('/payments/create-transfer', {
        accessToken,
        accountId: selectedAccount,
        amount,
        description: `ArtisanMarket order payment - $${amount.toFixed(2)}`
      });

      if (response.data.success) {
        showSuccessNotification('Bank transfer initiated successfully!');
        onTransferSuccess(response.data.transfer.id);
      } else {
        setError('Failed to initiate transfer');
        onTransferError('Failed to initiate transfer');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setError('Failed to initiate transfer');
      onTransferError('Failed to initiate transfer');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={className}>
      <Card.Content>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bank Transfer
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Total Amount: <span className="font-semibold">${amount.toFixed(2)}</span>
            </p>
          </div>

          {!user ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please log in to use bank transfer
              </p>
            </div>
          ) : !accessToken ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect your bank account to make a secure transfer
              </p>
              
              <Button
                onClick={() => open()}
                disabled={!ready || isLinkLoading}
                isLoading={isLinkLoading}
                className="w-full"
              >
                {isLinkLoading ? 'Connecting...' : 'Connect Bank Account'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {accounts.map((account) => (
                    <option key={account.account_id} value={account.account_id}>
                      {account.name} - {account.mask} ({account.subtype})
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleTransfer}
                disabled={!selectedAccount || isProcessing}
                isLoading={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing Transfer...' : `Transfer $${amount.toFixed(2)}`}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Bank transfers are secure and typically process within 1-3 business days</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default BankTransferForm; 