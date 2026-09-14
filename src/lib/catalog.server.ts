import { SignJWT, jwtVerify } from "jose";
import { getSql } from "@/lib/db";
import { SEED_TITLES, RETIRED_SEED_IDS, CATALOG_REVISION } from "@/lib/seed-data";
import { slugify } from "@/lib/utils";
import type { Episode, Title, TitleInput, TitleKind } from "@/lib/types";

const ADMIN_USER = "admin";
const ADMIN_PASS = "velora2026";
const TOKEN_SECRET = new TextEncoder().encode(
  "velora-admin-hs256-preview-key-do-not-reuse",
);

type TitleRow = {
  id: string;
  name: string;
  synopsis: string;
  kind: string;
  genres: string;
  year: number;
  rating: string;
  duration_min: number;
  seasons: number;
  poster_url: string;
  backdrop_url: string;
  video_url: string;
  match_score: number;
  featured: number;
  trending: number;
  is_new: number;
  coming_soon: number;
  original: number;
  episodes_json: string;
};

function asInt(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parseEpisodes(raw: string): Episode[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as Episode[];
  } catch {
    return [];
  }
}

function rowToTitle(row: TitleRow): Title {
  const kind = (row.kind === "series" || row.kind === "drama" ? row.kind : "movie") as TitleKind;
  return {
    id: row.id,
    name: row.name,
    synopsis: row.synopsis,
    kind,
    genres: row.genres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean),
    year: asInt(row.year),
    rating: row.rating,
    durationMin: asInt(row.duration_min),
    seasons: asInt(row.seasons) || 1,
    posterUrl: row.poster_url,
    backdropUrl: row.backdrop_url,
    videoUrl: row.video_url ?? "",
    matchScore: asInt(row.match_score) || 90,
    featured: asInt(row.featured) === 1,
    trending: asInt(row.trending) === 1,
    isNew: asInt(row.is_new) === 1,
    comingSoon: asInt(row.coming_soon) === 1,
    original: asInt(row.original) === 1,
    episodes: parseEpisodes(row.episodes_json || "[]"),
  };
}

async function insertTitle(sql: Awaited<ReturnType<typeof getSql>>, t: Title) {
  await sql`
    insert into titles (
      id, name, synopsis, kind, genres, year, rating, duration_min, seasons,
      poster_url, backdrop_url, video_url, match_score, featured, trending,
      is_new, coming_soon, original, episodes_json
    ) values (
      ${t.id}, ${t.name}, ${t.synopsis}, ${t.kind}, ${t.genres.join(", ")},
      ${t.year}, ${t.rating}, ${t.durationMin}, ${t.seasons},
      ${t.posterUrl}, ${t.backdropUrl}, ${t.videoUrl}, ${t.matchScore},
      ${t.featured ? 1 : 0}, ${t.trending ? 1 : 0}, ${t.isNew ? 1 : 0},
      ${t.comingSoon ? 1 : 0}, ${t.original ? 1 : 0},
      ${JSON.stringify(t.episodes)}
    )
  `;
}

export async function ensureSeeded() {
  const sql = await getSql();
  await sql`
    create table if not exists catalog_meta (
      key text primary key,
      value text not null
    )
  `;
  const rows = await sql<{ value: string }>`
    select value from catalog_meta where key = 'revision' limit 1
  `;
  if (rows[0]?.value === CATALOG_REVISION) return;

  const retire = [...new Set([...RETIRED_SEED_IDS, ...SEED_TITLES.map((t) => t.id)])];
  for (const id of retire) {
    await sql`delete from titles where id = ${id}`;
  }
  for (const title of SEED_TITLES) {
    await insertTitle(sql, title);
  }
  await sql`
    insert into catalog_meta (key, value)
    values ('revision', ${CATALOG_REVISION})
    on conflict (key) do update set value = ${CATALOG_REVISION}
  `;
}

export async function fetchTitles(): Promise<Title[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<TitleRow>`
    select * from titles
    order by featured desc, trending desc, year desc, name asc
  `;
  return rows.map(rowToTitle);
}

export async function fetchTitle(id: string): Promise<Title | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<TitleRow>`select * from titles where id = ${id} limit 1`;
  return rows[0] ? rowToTitle(rows[0]) : null;
}

export async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(ADMIN_USER)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(TOKEN_SECRET);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, TOKEN_SECRET);
  if (payload.role !== "admin") throw new Error("Forbidden");
  return true;
}

export function checkAdminCredentials(username: string, password: string) {
  return username.trim() === ADMIN_USER && password === ADMIN_PASS;
}

export async function createTitleRow(input: TitleInput): Promise<Title> {
  const sql = await getSql();
  const id = `${slugify(input.name) || "title"}-${Date.now().toString(36)}`;
  const title: Title = {
    id,
    name: input.name.trim(),
    synopsis: input.synopsis.trim(),
    kind: input.kind,
    genres: input.genres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean),
    year: input.year,
    rating: input.rating,
    durationMin: input.durationMin,
    seasons: input.seasons || 1,
    posterUrl: input.posterUrl.trim() || "/posters/odyssey.jpg",
    backdropUrl: input.backdropUrl.trim() || input.posterUrl.trim() || "/backdrops/odyssey.jpg",
    videoUrl: input.videoUrl.trim(),
    matchScore: 90,
    featured: input.featured,
    trending: input.trending,
    isNew: input.isNew,
    comingSoon: input.comingSoon || !input.videoUrl.trim(),
    original: input.original,
    episodes: [],
  };
  await insertTitle(sql, title);
  return title;
}

export async function updateTitleRow(id: string, input: TitleInput): Promise<Title | null> {
  const existing = await fetchTitle(id);
  if (!existing) return null;
  const sql = await getSql();
  const genres = input.genres
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean)
    .join(", ");
  await sql`
    update titles set
      name = ${input.name.trim()},
      synopsis = ${input.synopsis.trim()},
      kind = ${input.kind},
      genres = ${genres},
      year = ${input.year},
      rating = ${input.rating},
      duration_min = ${input.durationMin},
      seasons = ${input.seasons || 1},
      poster_url = ${input.posterUrl.trim()},
      backdrop_url = ${input.backdropUrl.trim() || input.posterUrl.trim()},
      video_url = ${input.videoUrl.trim()},
      featured = ${input.featured ? 1 : 0},
      trending = ${input.trending ? 1 : 0},
      is_new = ${input.isNew ? 1 : 0},
      coming_soon = ${input.comingSoon ? 1 : 0},
      original = ${input.original ? 1 : 0}
    where id = ${id}
  `;
  return fetchTitle(id);
}

export async function deleteTitleRow(id: string) {
  const sql = await getSql();
  await sql`delete from titles where id = ${id}`;
}
