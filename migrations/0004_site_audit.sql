create table if not exists site_audit (
  id text primary key,
  at timestamptz not null default now(),
  kind text not null,
  username text not null default '',
  ip text not null default '',
  city text not null default '',
  country text not null default '',
  ok boolean,
  summary text not null default '',
  detail text not null default ''
);

create index if not exists site_audit_at_idx on site_audit (at desc);

alter table site_visit add column if not exists ip text not null default '';
alter table site_visit add column if not exists path text not null default '';
