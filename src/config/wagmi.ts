import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// HyperEVM Chain Configuration
export const hyperEVM = {
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'HYPE',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
    public: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: { name: 'HyperEVM Explorer', url: 'https://www.hyperscan.com' },
  },
  testnet: false,
} as const;

export const config = getDefaultConfig({
  appName: 'Token Airdrop Platform',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [hyperEVM],
  ssr: false,
});