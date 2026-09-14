-- Seed revision tracker so catalog updates can reseed known titles
create table if not exists catalog_meta (
  key text primary key,
  value text not null
);
