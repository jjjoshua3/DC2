create table if not exists site_media (
  id text primary key,
  content_type text not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
);

alter table site_media enable row level security;
alter table site_media force row level security;
revoke all on table site_media from anon, authenticated;

