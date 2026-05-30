create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Vault User',
  avatar_url text not null default '',
  bio text not null default '',
  default_city text not null default '',
  default_account_type text not null default 'business' check (default_account_type in ('personal', 'business')),
  default_theme text not null default 'light' check (default_theme in ('light', 'dark')),
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  account_type text not null check (account_type in ('personal', 'business')),
  platform text not null,
  status text not null check (status in ('drafted', 'posted', 'reposted', 'archived')),
  category text not null,
  campaign text not null default '',
  city text not null default '',
  media_references text[] not null default '{}',
  cross_posted_to text[] not null default '{}',
  tags text[] not null default '{}',
  caption text not null,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_row_updated_at();

drop trigger if exists social_posts_set_updated_at on public.social_posts;
create trigger social_posts_set_updated_at
before update on public.social_posts
for each row
execute function public.set_row_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

alter table public.social_posts enable row level security;

drop policy if exists "Users can read their own social posts" on public.social_posts;
create policy "Users can read their own social posts"
on public.social_posts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own social posts" on public.social_posts;
create policy "Users can insert their own social posts"
on public.social_posts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own social posts" on public.social_posts;
create policy "Users can update their own social posts"
on public.social_posts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own social posts" on public.social_posts;
create policy "Users can delete their own social posts"
on public.social_posts
for delete
using (auth.uid() = user_id);
