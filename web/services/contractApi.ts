import { apiGet, apiPost } from './api';

export type PaymentMatchInput = {
  paymentId: string;
  paymentType: 'bank_transfer' | 'qr';
  amount: number;
};

export type SubjectInput = {
  name: string;
  taxId?: string;
  address?: string;
  source: 'bank' | 'client_entry' | 'contract_history';
  createdBy?: string;
};

export type CreateContractRequest = {
  subjectId?: string;
  subject?: SubjectInput;
  amount: number;
  address?: string;
  mainAccountName?: string;
  mainAccountPhone?: string;
  items?: string;
  bonusItems?: string;
  documentContent?: string;
  createdBy?: string;
  payments?: PaymentMatchInput[];
};

export type ContractResponse = {
  contractId: string;
  subjectId?: string;
  status: string;
};

export type PendingContractDto = {
  contractId: string;
  subjectName?: string;
  amount: number;
  status: string;
  createdAt?: string;
  documentContent?: string;
};

export type ConfirmContractResponse = {
  contractId: string;
  status: string;
};

export const createContract = (payload: CreateContractRequest) =>
  apiPost<ContractResponse>('/api/contracts', payload);

export const confirmContract = (contractId: string) =>
  apiPost<ConfirmContractResponse>(`/api/contracts/${contractId}/confirm`);

export const submitContract = (contractId: string) =>
  apiPost<void>(`/api/contracts/${contractId}/submit`);

export const getPendingContracts = () =>
  apiGet<PendingContractDto[]>('/api/contracts/pending');
