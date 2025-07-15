import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { WalletConnection } from './components/WalletConnection';
import { ParachuteTokens } from './components/ParachuteTokens';
import { RecipientList } from './components/RecipientList';
import { AirdropExecutor } from './components/AirdropExecutor';
import { WalletAddress, AirdropSettings, AirdropStats as AirdropStatsType } from './types/airdrop';
import { Zap, Github, Twitter } from 'lucide-react';

function App() {
  const [recipients, setRecipients] = useState<WalletAddress[]>([]);
  const [settings, setSettings] = useState<AirdropSettings>({
    tokenAddress: '0xf2E6a23B1aA09565FDb3a77AF7772709De3f4F95',
    tokenSymbol: 'Lilly',
    tokenDecimals: 6,
    totalAmount: '0',
    gasPrice: '20'
  });

  const stats: AirdropStatsType = useMemo(() => {
    const validRecipients = recipients.filter(r => r.isValid);
    const totalAmount = validRecipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const completed = recipients.filter(r => r.status === 'success').length;
    const failed = recipients.filter(r => r.status === 'failed').length;
    const estimatedGas = validRecipients.length * 0.0001;

    return {
      totalRecipients: validRecipients.length,
      totalAmount: totalAmount.toString(),
      completedTransactions: completed,
      failedTransactions: failed,
      estimatedGas: estimatedGas.toString()
    };
  }, [recipients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <ParachuteTokens />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Lilly Airdrop
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Distribute Lilly tokens to your community members efficiently and securely with our 
              professional airdrop platform
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Wallet Connection */}
          <WalletConnection />

          {/* Recipients & Executor Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecipientList recipients={recipients} onRecipientsChange={setRecipients} />
            <AirdropExecutor 
              recipients={recipients} 
              settings={settings}
              onRecipientsUpdate={setRecipients}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;