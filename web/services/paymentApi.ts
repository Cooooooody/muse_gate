import { apiGet } from './api';

export type PaymentMatchDto = {
  paymentId: string;
  paymentType: 'bank_transfer' | 'qr';
  amount: number;
  mgAccount?: string;
  occurredAt?: string;
};

export type UnmatchedPaymentDto = {
  paymentId: string;
  paymentType: 'bank_transfer' | 'qr';
  amount: number;
  mgAccount?: string;
  occurredAt?: string;
};

export const getPaymentMatches = (mgAccount: string) =>
  apiGet<PaymentMatchDto[]>(`/api/payments/matches?mgAccount=${encodeURIComponent(mgAccount)}`);

export const getUnmatchedPayments = () => apiGet<UnmatchedPaymentDto[]>('/api/payments/unmatched');
