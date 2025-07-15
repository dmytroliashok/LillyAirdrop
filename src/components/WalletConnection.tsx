import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { hyperEVM } from '../config/wagmi';
import { useTokenBalance } from '../hooks/useTokenBalance';

const LILLY_TOKEN_ADDRESS = '0xf2E6a23B1aA09565FDb3a77AF7772709De3f4F95';

export const WalletConnection: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { balance: lillyBalance, isLoading: isBalanceLoading, refetchBalance } = useTokenBalance(LILLY_TOKEN_ADDRESS);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (id: number) => {
    switch (id) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 137: return 'Polygon';
      case 80001: return 'Mumbai Testnet';
      case 10: return 'Optimism';
      case 42161: return 'Arbitrum One';
      case 8453: return 'Base';
      case 999: return 'HyperEVM';
      default: return 'Unknown Network';
    }
  };

  const isHyperEVM = chainId === hyperEVM.id;

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/70 mb-6">Connect your wallet to start distributing tokens to your community</p>
          
          <div className="flex justify-center">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                          >
                            <Wallet className="w-5 h-5" />
                            Connect Wallet
                          </button>
                        );
                      }

                      return null;
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
            <p className="text-white/70 text-sm">{address && formatAddress(address)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ConnectButton.Custom>
            {({ openAccountModal }) => (
              <>
                <button
                  onClick={openAccountModal}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Disconnect
                </button>
              </>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Network</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">{getNetworkName(chainId)}</p>
            {isHyperEVM && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="HyperEVM Network" />
            )}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Balance</p>
          <div className="flex items-center gap-2">
            {isBalanceLoading ? (
              <p className="text-white/50 font-medium">Loading...</p>
            ) : (
              <>
                <p className="text-white font-medium">{parseFloat(lillyBalance).toLocaleString()}</p>
                <p className="text-white font-medium">Lilly</p>
              </>
            )}
            <button
              onClick={() => refetchBalance()}
              className="ml-2 text-white/50 hover:text-white/80 transition-colors duration-200"
              title="Refresh balance"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {!isHyperEVM && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-500 text-sm">
              For optimal experience, please switch to HyperEVM network.
            </p>
          </div>
          <ConnectButton.Custom>
            {({ openChainModal }) => (
              <button
                onClick={openChainModal}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline"
              >
                Switch Network
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      )}
    </div>
  );
};