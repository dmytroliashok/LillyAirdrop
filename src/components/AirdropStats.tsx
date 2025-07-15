import React from 'react';
import { BarChart3, TrendingUp, Users, Coins } from 'lucide-react';
import { AirdropStats as AirdropStatsType } from '../types/airdrop';

interface AirdropStatsProps {
  stats: AirdropStatsType;
}

export const AirdropStats: React.FC<AirdropStatsProps> = ({ stats }) => {
  const successRate = stats.totalRecipients > 0 
    ? (stats.completedTransactions / stats.totalRecipients) * 100 
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Airdrop Statistics</h3>
          <p className="text-white/70 text-sm">Overview of your distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white/70 text-sm">Recipients</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalRecipients.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-green-400" />
            <span className="text-white/70 text-sm">Total Amount</span>
          </div>
          <p className="text-2xl font-bold text-white">{parseFloat(stats.totalAmount).toLocaleString()}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-white/70 text-sm">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span className="text-white/70 text-sm">Est. Gas</span>
          </div>
          <p className="text-2xl font-bold text-white">{parseFloat(stats.estimatedGas).toFixed(4)}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-300 text-sm font-medium mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-400">{stats.completedTransactions}</p>
        </div>
        
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300 text-sm font-medium mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-400">{stats.failedTransactions}</p>
        </div>
      </div>
    </div>
  );
};