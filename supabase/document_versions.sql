-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  title text,
  content jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists document_versions_document_id_created_at
  on document_versions (document_id, created_at desc);

alter table document_versions enable row level security;

create policy "Allow public read on document_versions"
  on document_versions for select
  using (true);

create policy "Allow public insert on document_versions"
  on document_versions for insert
  with check (true);

create policy "Allow public delete on document_versions"
  on document_versions for delete
  using (true);
