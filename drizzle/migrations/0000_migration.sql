create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  nome text,
  contato text,
  perfil text,
  status text not null default 'Interessado na versão Beta',
  entregas_pendentes text,
  lembrete_retorno text,
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "anyone insert leads" on public.leads for insert to anon, authenticated with check (char_length(coalesce(nome,'')) <= 200 and char_length(coalesce(contato,'')) <= 200);
create policy "admin read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update leads" on public.leads for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  perfil text,
  recurso text not null,
  created_at timestamptz not null default now()
);
grant insert on public.interactions to anon, authenticated;
grant select on public.interactions to authenticated;
grant all on public.interactions to service_role;
alter table public.interactions enable row level security;
create policy "anyone insert interactions" on public.interactions for insert to anon, authenticated with check (char_length(recurso) <= 100);
create policy "admin read interactions" on public.interactions for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- first signed-up user becomes admin
create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();