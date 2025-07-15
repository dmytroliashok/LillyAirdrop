import React, { useState } from 'react';
import { Settings, Coins, Info } from 'lucide-react';
import { AirdropSettings } from '../types/airdrop';

interface TokenSettingsProps {
  settings: AirdropSettings;
  onSettingsChange: (settings: AirdropSettings) => void;
}

export const TokenSettings: React.FC<TokenSettingsProps> = ({ settings, onSettingsChange }) => {
  const handleInputChange = (field: keyof AirdropSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      <div 
        className="p-6 cursor-pointer transition-colors duration-200 hover:bg-white/5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Token</h3>
              <p className="text-white/70 text-sm">Input your token details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Token Contract Address
              </label>
              <input
                type="text"
                value={settings.tokenAddress}
                onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
                placeholder="0x..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                value={settings.tokenSymbol}
                onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                placeholder="TOKEN"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Token Decimals
              </label>
              <input
                type="number"
                value={settings.tokenDecimals}
                onChange={(e) => handleInputChange('tokenDecimals', parseInt(e.target.value) || 18)}
                placeholder="18"
                min="0"
                max="18"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Gas Price (Gwei)
              </label>
              <input
                type="number"
                value={settings.gasPrice}
                onChange={(e) => handleInputChange('gasPrice', e.target.value)}
                placeholder="20"
                min="1"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-blue-300 text-sm">
              <p className="font-medium mb-1">Token Configuration Tips:</p>
              <ul className="space-y-1 text-blue-300/80">
                <li>• Make sure you have the correct token contract address</li>
                <li>• Most tokens use 18 decimals, but some use different values</li>
                <li>• Higher gas prices lead to faster transaction confirmation</li>
                <li>• You must have sufficient tokens approved for the airdrop contract</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};