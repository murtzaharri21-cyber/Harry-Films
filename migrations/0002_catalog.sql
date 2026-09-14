-- Velora shared catalog (unowned rows — world-readable; writes gated by admin token)
create table if not exists titles (
  id text primary key,
  name text not null,
  synopsis text not null,
  kind text not null,
  genres text not null,
  year integer not null,
  rating text not null,
  duration_min integer not null,
  seasons integer not null default 1,
  poster_url text not null,
  backdrop_url text not null,
  video_url text not null default '',
  match_score integer not null default 97,
  featured integer not null default 0,
  trending integer not null default 0,
  is_new integer not null default 0,
  coming_soon integer not null default 0,
  original integer not null default 0,
  episodes_json text not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists titles_kind_idx on titles (kind);
create index if not exists titles_featured_idx on titles (featured);
