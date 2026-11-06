-- Close the Supabase Data API. The site uses the Postgres connection, which is
-- not affected. With RLS on and no policies, anon and authenticated get nothing.
do $$
declare
  rec record;
begin
  for rec in
    select c.relname as table_name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and c.relname not like 'pg_%'
  loop
    execute format('alter table public.%I enable row level security', rec.table_name);
    execute format('alter table public.%I force row level security', rec.table_name);
  end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
