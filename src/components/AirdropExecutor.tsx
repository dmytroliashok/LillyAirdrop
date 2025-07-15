import React, { useState } from 'react';
import { Send, Zap, AlertTriangle, CheckCircle, Loader2, TrendingUp, XCircle } from 'lucide-react';
import { WalletAddress, AirdropSettings } from '../types/airdrop';
import { useAccount, useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';
import { useTokenBalance } from '../hooks/useTokenBalance';

const LILLY_TOKEN_ADDRESS = '0xf2E6a23B1aA09565FDb3a77AF7772709De3f4F95';

interface AirdropExecutorProps {
  recipients: WalletAddress[];
  settings: AirdropSettings;
  onRecipientsUpdate: (recipients: WalletAddress[]) => void;
}

export const AirdropExecutor: React.FC<AirdropExecutorProps> = ({
  recipients,
  settings,
  onRecipientsUpdate
}) => {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(0);
  const { balance: lillyBalance, isLoading: isBalanceLoading, refetchBalance } = useTokenBalance(LILLY_TOKEN_ADDRESS);

  const validRecipients = recipients.filter(r => r.isValid);
  const totalAmount = validRecipients.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const hasInsufficientBalance = parseFloat(lillyBalance) < totalAmount;
  const canExecute = isConnected && walletClient && validRecipients.length > 0 && !hasInsufficientBalance;
  
  // Calculate success and failed counts
  const successCount = recipients.filter(r => r.status === 'success').length;
  const failedCount = recipients.filter(r => r.status === 'failed').length;
  const hasCompletedTransactions = successCount > 0 || failedCount > 0;

  const executeAirdrop = async () => {
    if (!canExecute || !walletClient) return;

    setIsExecuting(true);
    setCurrentRecipient(0);

    try {
      // Import viem for contract interactions
      const { parseUnits, encodeFunctionData } = await import('viem');
      
      // ERC20 transfer function ABI
      const transferAbi = {
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable'
      } as const;

      let tempRecipients = [...recipients];

      // Process recipients one by one
      for (let i = 0; i < validRecipients.length; i++) {
        setCurrentRecipient(i + 1);
        const recipient = validRecipients[i];

        try {
          // Update status to processing

          tempRecipients = tempRecipients.map(r => 
            r.id === recipient.id ? { ...r, status: 'processing' } : r
          );

          onRecipientsUpdate(tempRecipients);

          const amount = parseUnits(
            recipient.amount,
            settings.tokenDecimals
          );

          // Encode the transfer function call
          const data = encodeFunctionData({
            abi: [transferAbi],
            functionName: 'transfer',
            args: [recipient.address as `0x${string}`, amount]
          });

          // Send the transaction using wagmi/viem
          const hash = await walletClient.sendTransaction({
            to: LILLY_TOKEN_ADDRESS as `0x${string}`,
            data,
          });

          tempRecipients = tempRecipients.map(r => 
            r.id === recipient.id 
              ? { ...r, status: 'success', txHash: hash } 
              : r
          );

          // Update status to success
          onRecipientsUpdate(tempRecipients);

          toast.success(`Successfully sent ${recipient.amount} Lilly to ${recipient.address.slice(0, 6)}...`);
        } catch (error) {
          console.error(`Failed to send to ${recipient.address}:`, error);
          
          // Update status to failed
          onRecipientsUpdate(recipients.map(r => 
            r.id === recipient.id ? { ...r, status: 'failed' } : r
          ));

          toast.error(`Failed to send Lilly to ${recipient.address.slice(0, 6)}...`);
        }
        
        // Small delay between transactions to avoid overwhelming the network
        if (i < validRecipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast.success('Airdrop completed!');
      
      // Refresh the balance after completing the airdrop
      setTimeout(() => {
        refetchBalance();
      }, 2000); // Wait 2 seconds for blockchain to update
    } catch (error) {
      console.error('Airdrop execution failed:', error);
      toast.error('Airdrop execution failed. Please try again.');
    } finally {
      setIsExecuting(false);
      setCurrentRecipient(0);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Send className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Execute Airdrop</h3>
          <p className="text-white/70 text-sm">Distribute tokens to your community</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Recipients:</span>
              <span className="text-white font-medium ml-2">{validRecipients.length}</span>
            </div>
            <div>
              <span className="text-white/70">Total Amount:</span>
              <span className="text-white font-medium ml-2">{totalAmount.toLocaleString()} {settings.tokenSymbol}</span>
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-yellow-500 text-sm">Please connect your wallet to execute the airdrop</p>
          </div>
        )}

        {isConnected && validRecipients.length === 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-blue-500 text-sm">Add valid recipient addresses to execute the airdrop</p>
          </div>
        )}

        {isConnected && hasInsufficientBalance && validRecipients.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-500 text-sm font-medium mb-1">Insufficient Balance</p>
              <p className="text-red-400 text-sm">
                You need {totalAmount.toLocaleString()} Lilly tokens but only have {parseFloat(lillyBalance).toLocaleString()} Lilly tokens.
                Please acquire more tokens before executing the airdrop.
              </p>
            </div>
          </div>
        )}

        {hasCompletedTransactions && (
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Airdrop Results</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm font-medium">Success</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{successCount}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm font-medium">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{failedCount}</div>
              </div>
            </div>
            {(successCount + failedCount) > 0 && (
              <div className="mt-3 text-center">
                <span className="text-white/70 text-sm">
                  Success Rate: <span className="text-white font-medium">
                    {((successCount / (successCount + failedCount)) * 100).toFixed(1)}%
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

      </div>

      <button
        onClick={executeAirdrop}
        disabled={!canExecute || isExecuting}
        className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 ${
          hasInsufficientBalance 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
        }`}
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Executing Airdrop... ({currentRecipient}/{validRecipients.length})
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            {hasInsufficientBalance && validRecipients.length > 0 
              ? `Insufficient Balance (Need ${(totalAmount - parseFloat(lillyBalance)).toLocaleString()} more)` 
              : 'Execute Airdrop'
            }
          </>
        )}
      </button>

      {isExecuting && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>Progress</span>
            <span>{Math.round((currentRecipient / validRecipients.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentRecipient / validRecipients.length) * 100}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};