-- Run this once in Supabase Dashboard > SQL Editor.
-- It creates one private archive row per authenticated user.

create table if not exists public.user_archives (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_archives enable row level security;

drop policy if exists "Users can read their own archive" on public.user_archives;
create policy "Users can read their own archive"
on public.user_archives
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own archive" on public.user_archives;
create policy "Users can create their own archive"
on public.user_archives
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own archive" on public.user_archives;
create policy "Users can update their own archive"
on public.user_archives
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own archive" on public.user_archives;
create policy "Users can delete their own archive"
on public.user_archives
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_archives to authenticated;
