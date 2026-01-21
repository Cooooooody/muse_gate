
export enum PaymentType {
  QR = 'QR',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UNPAID = 'UNPAID'
}

export enum ContractStatus {
  DRAFT = '草稿',
  PENDING_APPROVAL = '待审核',
  APPROVED = '已审核',
  EXECUTED = '已执行'
}

export interface Subject {
  id: string;
  name: string;
  taxId?: string;
  address?: string;
  source: 'BANK' | 'CLIENT_ENTRY' | 'CONTRACT_HISTORY';
}

export interface PaymentRecord {
  id: string;
  type: PaymentType;
  amount: number;
  senderName: string;
  senderAccount?: string;
  date: string;
  isMatched: boolean;
  mgAccount?: string;
}

export interface Contract {
  id: string;
  subjectName: string;
  taxId?: string;
  address: string;
  amount: number;
  paymentIds: string[]; // Linked payments
  status: ContractStatus;
  mainAccountName: string;
  mainAccountPhone: string;
  items: string[];
  bonusItems: string[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  paymentId: string;
  subjectName: string;
  amount: number;
  status: 'PENDING' | 'ISSUED';
  date: string;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = '管理员',
  SALES = '销售',
  SUPERVISOR = '主管',
  FINANCE = '财务',
  CLIENT = '客户'
}
