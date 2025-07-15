import React, { useState, useRef } from 'react';
import { Users, Plus, Upload, Trash2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { WalletAddress } from '../types/airdrop';
import { ethers } from 'ethers';

interface RecipientListProps {
  recipients: WalletAddress[];
  onRecipientsChange: (recipients: WalletAddress[]) => void;
}

export const RecipientList: React.FC<RecipientListProps> = ({ recipients, onRecipientsChange }) => {
  const [newAddress, setNewAddress] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidAddress = (address: string): boolean => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const addRecipient = () => {
    if (!newAddress.trim() || !newAmount.trim()) return;

    const recipient: WalletAddress = {
      id: Date.now().toString(),
      address: newAddress.trim(),
      amount: newAmount.trim(),
      isValid: isValidAddress(newAddress.trim()),
      status: 'pending'
    };

    onRecipientsChange([...recipients, recipient]);
    setNewAddress('');
    setNewAmount('');
  };

  const removeRecipient = (id: string) => {
    onRecipientsChange(recipients.filter(r => r.id !== id));
  };

  const updateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    onRecipientsChange(recipients.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'address') {
          updated.isValid = isValidAddress(value);
        }
        return updated;
      }
      return r;
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const newRecipients: WalletAddress[] = [];

        lines.forEach((line, index) => {
          const [address, amount] = line.split(',').map(s => s.trim());
          if (address && amount) {
            newRecipients.push({
              id: `${Date.now()}-${index}`,
              address,
              amount,
              isValid: isValidAddress(address),
              status: 'pending'
            });
          }
        });

        onRecipientsChange([...recipients, ...newRecipients]);
      } catch (error) {
        console.error('Failed to parse CSV:', error);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = 'address,amount\n0x1234567890123456789012345678901234567890,100\n0x0987654321098765432109876543210987654321,250';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airdrop-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalAmount = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const validRecipients = recipients.filter(r => r.isValid).length;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recipients</h3>
            <p className="text-white/70 text-sm">{validRecipients} valid addresses • Total: {totalAmount.toLocaleString()} Lilly</p>
          </div>
        </div>
        
        {/* <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors duration-200"
            title="Download CSV Template"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors duration-200"
            title="Upload CSV"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div> */}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Wallet address (0x...)"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Amount"
            className="w-32 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={addRecipient}
            disabled={!newAddress.trim() || !newAmount.trim()}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recipients.map((recipient) => (
          <div
            key={recipient.id}
            className="bg-white/5 rounded-xl p-4 flex items-center gap-3 group hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex-shrink-0">
              {recipient.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-white truncate">
                {recipient.address}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-white/70">
                  Amount: <span className="text-white font-medium">{recipient.amount} Lilly</span>
                </span>
                {recipient.status !== 'pending' && (
                  <span className={`font-medium ${
                    recipient.status === 'success' ? 'text-green-400' : 
                    recipient.status === 'failed' ? 'text-red-400' : 
                    recipient.status === 'processing' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {recipient.status === 'success' ? '✓ Success' : 
                     recipient.status === 'failed' ? '✗ Failed' : 
                     recipient.status === 'processing' ? '⏳ Processing' : 'Pending'}
                  </span>
                )}
              </div>
            </div>            
            <button
              onClick={() => removeRecipient(recipient.id)}
              className={`${
                recipient.status === 'processing' ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
              } text-red-400 hover:text-red-300 transition-all duration-200 p-1`}
              disabled={recipient.status === 'processing'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {recipients.length === 0 && (
          <div className="text-center py-12 text-white/50">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recipients added yet</p>
            <p className="text-sm">Add wallet addresses manually or upload a CSV file</p>
          </div>
        )}
      </div>
    </div>
  );
};