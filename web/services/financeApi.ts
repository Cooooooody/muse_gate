import { apiPost } from './api';

export type CreateBankTransferRequest = {
  senderName: string;
  senderAccount?: string;
  amount: number;
  receivedAt: string;
  mgAccount?: string;
  createdBy?: string;
};

export const createBankTransfer = (payload: CreateBankTransferRequest) =>
  apiPost<string>('/api/finance/bank-transfers', payload);
