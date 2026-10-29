create table if not exists site_visit (
  id text primary key,
  visitor_id text not null,
  country text not null default 'Onbekend',
  city text not null default '',
  region text not null default '',
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  duration_seconds integer not null default 0
);

create index if not exists site_visit_visitor_idx on site_visit (visitor_id);
create index if not exists site_visit_started_idx on site_visit (started_at);
