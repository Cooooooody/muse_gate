import { apiGet, apiPost } from './api';

export type SubjectInfo = {
  id: string;
  name: string;
  taxId?: string;
  address?: string;
  source: 'bank' | 'client_entry' | 'contract_history';
};

export type SubjectVerifyRequest = {
  name: string;
  taxId?: string;
  address?: string;
};

export type SubjectVerifyResponse = {
  name: string;
  taxId: string;
  address: string;
  verified: boolean;
};

export const getBankHistory = (query?: string) => {
  const q = query ? `?query=${encodeURIComponent(query)}` : '';
  return apiGet<SubjectInfo[]>(`/api/subjects/bank-history${q}`);
};

export const getClientSubjects = () => apiGet<SubjectInfo[]>('/api/subjects/client');

export const verifySubject = (payload: SubjectVerifyRequest) =>
  apiPost<SubjectVerifyResponse>('/api/subjects/verify', payload);
