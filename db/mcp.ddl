-- Initial Supabase/Postgres schema (minimal)

create extension if not exists pgcrypto;

create type user_role as enum ('admin', 'sales', 'supervisor', 'finance', 'client');
create type subject_source as enum ('bank', 'client_entry', 'contract_history');
create type payment_type as enum ('bank_transfer', 'qr');
create type contract_status as enum ('draft', 'pending_approval', 'approved', 'executed', 'void');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles: select own"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles: insert own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Profiles: update own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  address text,
  source subject_source not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id),
  amount numeric(12, 2) not null,
  address text,
  main_account_name text,
  main_account_phone text,
  items jsonb not null default '[]'::jsonb,
  bonus_items jsonb not null default '[]'::jsonb,
  document_content text,
  status contract_status not null default 'draft',
  created_by uuid references profiles(id),
  approved_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  approved_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists bank_transfers (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_account text,
  amount numeric(12, 2) not null,
  received_at date not null,
  mg_account text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists qr_payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text,
  amount numeric(12, 2) not null,
  paid_at timestamptz,
  mg_account text,
  created_at timestamptz not null default now()
);

create table if not exists contract_payments (
  contract_id uuid not null references contracts(id) on delete cascade,
  payment_id uuid not null,
  payment_type payment_type not null,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  primary key (contract_id, payment_id, payment_type)
);

create table if not exists muse_points_ledger (
  id uuid primary key default gen_random_uuid(),
  mg_account text not null,
  amount numeric(12, 2) not null,
  source_type payment_type not null,
  source_id uuid not null,
  created_at timestamptz not null default now()
);
