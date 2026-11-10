-- Supabase Schema for Jobgen Marketing OS & Team CRM
-- Run this in the Supabase SQL Editor

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Workspaces table
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Jobgen Marketing Workspace',
  created_at timestamptz default now()
);

-- 3. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'member' check (role in ('admin', 'member')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  company text not null,
  email text,
  phone text,
  stage text not null default 'New' check (stage in ('New', 'Contacted', 'Qualified', 'Won', 'Lost')),
  value numeric not null default 0,
  probability integer default 20,
  source text default 'Website',
  notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  follow_up_date date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Lead Timeline / Notes table
create table if not exists public.lead_timeline (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  note text,
  type text default 'note' check (type in ('note', 'status_change', 'automation', 'call', 'email')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 6. Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  status text not null default 'todo' check (status in ('backlog', 'todo', 'in_progress', 'review', 'done')),
  assignee text default 'You',
  assigned_to uuid references public.profiles(id) on delete set null,
  due date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Events (Calendar) table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  platform text not null default 'LinkedIn',
  date date not null,
  time text not null default '09:00',
  caption text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Campaigns table
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  platform text not null default 'LinkedIn',
  status text not null default 'Draft' check (status in ('Draft', 'Active', 'Paused', 'Completed')),
  budget numeric not null default 0,
  spent numeric not null default 0,
  progress integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Competitors table
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  url text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. Automation Rules table
create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  trigger text not null,
  action text not null,
  enabled boolean not null default true,
  runs integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_timeline enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.campaigns enable row level security;
alter table public.competitors enable row level security;
alter table public.automation_rules enable row level security;

-- Helper function to get current user workspace_id
create or replace function public.current_user_workspace()
returns uuid language sql stable security definer as $$
  select workspace_id from public.profiles where id = auth.uid() limit 1;
$$;

-- RLS Policies
-- Profiles: Users can view profiles in their workspace, update own profile
create policy "View profiles in same workspace" on public.profiles
  for select using (workspace_id = public.current_user_workspace() or id = auth.uid());

create policy "Update own profile" on public.profiles
  for update using (id = auth.uid());

create policy "Admin can update profiles in workspace" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin' and workspace_id = public.profiles.workspace_id
    )
  );

-- Workspaces
create policy "View own workspace" on public.workspaces
  for select using (id = public.current_user_workspace());

-- Leads
create policy "Workspace leads select" on public.leads
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace leads insert" on public.leads
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace leads update" on public.leads
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace leads delete" on public.leads
  for delete using (workspace_id = public.current_user_workspace());

-- Lead Timeline
create policy "Workspace timeline select" on public.lead_timeline
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace timeline insert" on public.lead_timeline
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace timeline delete" on public.lead_timeline
  for delete using (workspace_id = public.current_user_workspace());

-- Tasks
create policy "Workspace tasks select" on public.tasks
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace tasks insert" on public.tasks
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace tasks update" on public.tasks
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace tasks delete" on public.tasks
  for delete using (workspace_id = public.current_user_workspace());

-- Events
create policy "Workspace events select" on public.events
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace events insert" on public.events
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace events update" on public.events
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace events delete" on public.events
  for delete using (workspace_id = public.current_user_workspace());

-- Campaigns
create policy "Workspace campaigns select" on public.campaigns
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace campaigns insert" on public.campaigns
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace campaigns update" on public.campaigns
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace campaigns delete" on public.campaigns
  for delete using (workspace_id = public.current_user_workspace());

-- Competitors
create policy "Workspace competitors select" on public.competitors
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace competitors insert" on public.competitors
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace competitors update" on public.competitors
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace competitors delete" on public.competitors
  for delete using (workspace_id = public.current_user_workspace());

-- Automations
create policy "Workspace automations select" on public.automation_rules
  for select using (workspace_id = public.current_user_workspace());
create policy "Workspace automations insert" on public.automation_rules
  for insert with check (workspace_id = public.current_user_workspace());
create policy "Workspace automations update" on public.automation_rules
  for update using (workspace_id = public.current_user_workspace());
create policy "Workspace automations delete" on public.automation_rules
  for delete using (workspace_id = public.current_user_workspace());

-- Trigger to create profile and default workspace on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  default_ws uuid;
  user_count int;
  user_role text;
begin
  select count(*) into user_count from public.profiles;
  user_role := case when user_count = 0 then 'admin' else 'member' end;

  select id into default_ws from public.workspaces order by created_at asc limit 1;
  if default_ws is null then
    insert into public.workspaces (name) values ('Jobgen Marketing Workspace') returning id into default_ws;
  end if;

  insert into public.profiles (id, workspace_id, full_name, email, role)
  values (
    new.id,
    default_ws,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    user_role
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for Leads, Tasks, Campaigns, Events
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.campaigns;
alter publication supabase_realtime add table public.events;
