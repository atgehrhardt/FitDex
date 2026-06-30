-- FitDex Supabase schema
-- Run this in Supabase Dashboard → SQL Editor (one time per project)

-- Player save data (one row per user)
create table if not exists public.player_saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{"name":"Trainer","totalWorkouts":0,"totalRolls":0,"battlesWon":0,"battlesLost":0,"xp":0}'::jsonb,
  workouts jsonb not null default '[]'::jsonb,
  collection jsonb not null default '[]'::jsonb,
  pending_rolls integer not null default 0 check (pending_rolls >= 0),
  updated_at timestamptz not null default now()
);

alter table public.player_saves enable row level security;

-- Users can only read their own save
create policy "player_saves_select_own"
  on public.player_saves
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can only insert their own save
create policy "player_saves_insert_own"
  on public.player_saves
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can only update their own save
create policy "player_saves_update_own"
  on public.player_saves
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create save row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.player_saves (user_id, profile)
  values (
    new.id,
    jsonb_build_object(
      'name', coalesce(new.raw_user_meta_data ->> 'display_name', 'Trainer'),
      'totalWorkouts', 0,
      'totalRolls', 0,
      'battlesWon', 0,
      'battlesLost', 0,
      'xp', 0
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Recommended Supabase Auth settings (configure in Dashboard):
-- 1. Authentication → Providers → Email: enable, require email confirmation ON
-- 2. Authentication → URL Configuration:
--    Site URL: https://YOUR_USERNAME.github.io/FitDex/
--    Redirect URLs: https://YOUR_USERNAME.github.io/FitDex/** , http://localhost:5173/**
-- 3. NEVER put the service_role key in this repo — only the anon key belongs in the client
