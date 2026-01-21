import { apiGet } from './api';

export type ReminderDto = {
  mgAccount: string;
  paymentType: 'bank_transfer' | 'qr';
  amount: number;
  occurredAt: string;
};

export const getReminders = () => apiGet<ReminderDto[]>('/api/reminders/unmatched');
