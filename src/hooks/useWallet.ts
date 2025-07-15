import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);

  const { data: balanceData } = useBalance({
    address: address,
  });

  const balance = balanceData ? balanceData.formatted : '0';

  const connectWallet = async () => {
    // RainbowKit handles connection through the ConnectButton
    setIsLoading(true);
    try {
      // Connection is handled by RainbowKit ConnectButton
      // This function is kept for compatibility but actual connection
      // happens through the RainbowKit modal
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const switchNetwork = async (targetChainId: number) => {
    // Network switching is handled by RainbowKit automatically
    // when user selects a different network from the dropdown
    console.log(`Switching to chain ${targetChainId}`);
  };

  return {
    isConnected,
    address: address || null,
    chainId,
    balance,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    // Additional wagmi-specific data
    provider: null, // wagmi uses viem instead of ethers provider
    signer: null, // wagmi uses different pattern for signing
  };
};