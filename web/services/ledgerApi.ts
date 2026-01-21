import { apiGet } from './api';

export type LedgerEntry = {
  id: string;
  mgAccount?: string;
  amount: number;
  sourceType: 'bank_transfer' | 'qr';
  sourceId?: string;
  createdAt?: string;
};

export const getLedgerEntries = () => apiGet<LedgerEntry[]>('/api/ledger');
