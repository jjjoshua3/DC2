create table if not exists site_admin (
  email text primary key,
  name text not null,
  role text not null,
  created_at timestamptz not null default now()
);

insert into site_admin (email, name, role) values
  ('joshua.bosma@kpnmail.nl', 'Joshua Bosma', 'Webdeveloper'),
  ('stefanie@deconnectors.com', 'Stefanie Vermeulen', 'Eigenaar')
on conflict (email) do update set name = excluded.name, role = excluded.role;
