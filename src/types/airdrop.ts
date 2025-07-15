export interface WalletAddress {
  id: string;
  address: string;
  amount: string;
  isValid: boolean;
  status: 'pending' | 'processing' | 'success' | 'failed';
  txHash?: string;
}

export interface AirdropSettings {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  totalAmount: string;
  gasPrice: string;
}

export interface AirdropStats {
  totalRecipients: number;
  totalAmount: string;
  completedTransactions: number;
  failedTransactions: number;
  estimatedGas: string;
}