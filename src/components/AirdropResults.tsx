import React from 'react';
import { CheckCircle, XCircle, ExternalLink, Copy, BarChart3 } from 'lucide-react';
import { WalletAddress } from '../types/airdrop';
import toast from 'react-hot-toast';

interface AirdropResultsProps {
  recipients: WalletAddress[];
  isVisible: boolean;
  onClose: () => void;
}

export const AirdropResults: React.FC<AirdropResultsProps> = ({ recipients, isVisible, onClose }) => {
  if (!isVisible) return null;

  const successCount = recipients.filter(r => r.status === 'success').length;
  const failedCount = recipients.filter(r => r.status === 'failed').length;
  const totalProcessed = successCount + failedCount;
  const successRate = totalProcessed > 0 ? (successCount / totalProcessed) * 100 : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Airdrop Results</h2>
                <p className="text-white/70">Distribution completed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors duration-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{totalProcessed}</div>
              <div className="text-white/70 text-sm">Total Processed</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{successCount}</div>
              <div className="text-green-300 text-sm">Successful</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{failedCount}</div>
              <div className="text-red-300 text-sm">Failed</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{successRate.toFixed(1)}%</div>
              <div className="text-blue-300 text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-6">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recipients
              .filter(r => r.status === 'success' || r.status === 'failed')
              .map((recipient) => (
                <div
                  key={recipient.id}
                  className={`bg-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 ${
                    recipient.status === 'success' 
                      ? 'border-l-4 border-green-500' 
                      : 'border-l-4 border-red-500'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(recipient.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-mono text-sm">
                        {formatAddress(recipient.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(recipient.address)}
                        className="text-white/50 hover:text-white/80 transition-colors duration-200"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/70">
                        Amount: <span className="text-white font-medium">{recipient.amount} Lilly</span>
                      </span>
                      <span className={`font-medium ${getStatusColor(recipient.status)}`}>
                        {getStatusText(recipient.status)}
                      </span>
                    </div>
                  </div>
                  
                  {recipient.txHash && (
                    <div className="flex-shrink-0">
                      <a
                        href={`https://www.hyperscan.com/tx/${recipient.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                        title="View transaction"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
          </div>
          
          {recipients.filter(r => r.status === 'success' || r.status === 'failed').length === 0 && (
            <div className="text-center py-12 text-white/50">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No completed transactions to display</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              Airdrop completed at {new Date().toLocaleString()}
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};