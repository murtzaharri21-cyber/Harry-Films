import { o as slugify } from "./utils-DfyWkWHU.mjs";
import { n as jwtVerify, t as SignJWT } from "../_libs/jose.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.server-CYUxlA1i.js
var _0002_catalog_default = "-- Velora shared catalog (unowned rows — world-readable; writes gated by admin token)\ncreate table if not exists titles (\n  id text primary key,\n  name text not null,\n  synopsis text not null,\n  kind text not null,\n  genres text not null,\n  year integer not null,\n  rating text not null,\n  duration_min integer not null,\n  seasons integer not null default 1,\n  poster_url text not null,\n  backdrop_url text not null,\n  video_url text not null default '',\n  match_score integer not null default 97,\n  featured integer not null default 0,\n  trending integer not null default 0,\n  is_new integer not null default 0,\n  coming_soon integer not null default 0,\n  original integer not null default 0,\n  episodes_json text not null default '[]',\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists titles_kind_idx on titles (kind);\ncreate index if not exists titles_featured_idx on titles (featured);\n";
var _0003_catalog_meta_default = "-- Seed revision tracker so catalog updates can reseed known titles\ncreate table if not exists catalog_meta (\n  key text primary key,\n  value text not null\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_catalog.sql": _0002_catalog_default,
			"/migrations/0003_catalog_meta.sql": _0003_catalog_meta_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var yt = (id) => `youtube:${id}`;
/** Bump this to force a catalog reseed of known titles. */
var CATALOG_REVISION = "2026-09-13-latest";
var RETIRED_SEED_IDS = [
	"sintel",
	"big-buck-bunny",
	"tears-of-steel",
	"elephants-dream",
	"his-girl-friday",
	"nosferatu",
	"carnival-of-souls",
	"house-on-haunted-hill",
	"abraham-lincoln",
	"dressed-to-kill",
	"suddenly",
	"pied-piper",
	"chaplin-festival",
	"sita-sings-the-blues",
	"three-stooges",
	"chrome-reels",
	"open-worlds",
	"night-of-the-living-dead",
	"plan-9",
	"charade",
	"the-general",
	"onenight",
	"digger",
	"dogstars",
	"jumanji",
	"insidious",
	"motu"
];
function title({ ytId, seasons, episodes, original, ...rest }) {
	return {
		...rest,
		posterUrl: `/posters/${rest.id}.jpg`,
		backdropUrl: `/backdrops/${rest.id}.jpg`,
		videoUrl: yt(ytId),
		seasons: seasons ?? 1,
		original: original ?? false,
		episodes: episodes ?? []
	};
}
var SEED_TITLES = [
	title({
		id: "odyssey",
		name: "The Odyssey",
		synopsis: "Christopher Nolan’s IMAX epic of Homer — a warrior’s long road home across gods, monsters, and the wine-dark sea.",
		kind: "drama",
		genres: [
			"Epic",
			"Adventure",
			"Fantasy"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 173,
		matchScore: 99,
		featured: true,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "f_bKjZeJBBI"
	}),
	title({
		id: "spiderman",
		name: "Spider-Man: Brand New Day",
		synopsis: "The world forgot Peter Parker. He has not forgotten them — and a new threat is one he cannot even see.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Adventure"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 145,
		matchScore: 98,
		featured: true,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "62bIsvRcPv0"
	}),
	title({
		id: "doomsday",
		name: "Avengers: Doomsday",
		synopsis: "Heroes from three universes collide as Doctor Doom arrives. Earth’s mightiest may not be enough.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Sci-Fi"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 150,
		matchScore: 97,
		featured: true,
		trending: true,
		isNew: true,
		comingSoon: true,
		ytId: "irVNGjRFZGk"
	}),
	title({
		id: "hailmary",
		name: "Project Hail Mary",
		synopsis: "A junior-high science teacher wakes up 11.9 light-years from home with one job: save every sun like ours.",
		kind: "movie",
		genres: [
			"Sci-Fi",
			"Adventure",
			"Drama"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 140,
		matchScore: 98,
		featured: true,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "m08TxIsFTRI"
	}),
	title({
		id: "superman",
		name: "Superman",
		synopsis: "James Gunn’s new DCU begins: Clark Kent must choose who he is — not just what he can do — as a darker world looks up.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Sci-Fi"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 129,
		matchScore: 96,
		featured: true,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "Ox8ZLF6cGM0"
	}),
	title({
		id: "avatar",
		name: "Avatar: Fire and Ash",
		synopsis: "James Cameron returns to Pandora. Jake and Neytiri face a people who answer fire with fire.",
		kind: "movie",
		genres: [
			"Sci-Fi",
			"Adventure",
			"Action"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 197,
		matchScore: 97,
		featured: true,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "nb_fFj_0rq8"
	}),
	title({
		id: "f1",
		name: "F1",
		synopsis: "Brad Pitt is a Formula 1 legend pulled out of exile to save a collapsing team — shot during real Grand Prix weekends.",
		kind: "drama",
		genres: [
			"Sports",
			"Action",
			"Drama"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 155,
		matchScore: 97,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "CT2_P2DZBR0"
	}),
	title({
		id: "sinners",
		name: "Sinners",
		synopsis: "Ryan Coogler and Michael B. Jordan. Twin brothers go home to start again — and something older follows them back.",
		kind: "drama",
		genres: [
			"Horror",
			"Drama",
			"Thriller"
		],
		year: 2025,
		rating: "R",
		durationMin: 137,
		matchScore: 99,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "bKGxHflevuk"
	}),
	title({
		id: "fantasticfour",
		name: "The Fantastic Four: First Steps",
		synopsis: "Marvel’s first family in a retro-future world — and a hungry god named Galactus at the door.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Sci-Fi"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 115,
		matchScore: 94,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "pAsmrKyMqaA"
	}),
	title({
		id: "toystory5",
		name: "Toy Story 5",
		synopsis: "The toys return as a new kind of play — screens, not shelves — threatens what it means to be a child’s favorite.",
		kind: "movie",
		genres: [
			"Animation",
			"Family",
			"Comedy"
		],
		year: 2026,
		rating: "G",
		durationMin: 100,
		matchScore: 95,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "n41enLMUrgU"
	}),
	title({
		id: "mario",
		name: "The Super Mario Galaxy Movie",
		synopsis: "Mario and Luigi are launched past the Mushroom Kingdom into a cosmos of stars, gravity, and Bowser’s biggest plan yet.",
		kind: "movie",
		genres: [
			"Animation",
			"Family",
			"Adventure"
		],
		year: 2026,
		rating: "PG",
		durationMin: 100,
		matchScore: 96,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "vFeJf5QMzJU"
	}),
	title({
		id: "supergirl",
		name: "Supergirl",
		synopsis: "Kara Zor-El is not her cousin. A jaded survivor of Krypton cuts a violent path across the stars.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Sci-Fi"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 130,
		matchScore: 94,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "mlfzhW4tq5Q"
	}),
	title({
		id: "wicked",
		name: "Wicked: For Good",
		synopsis: "Elphaba and Glinda finish the story — friendship, power, and the making of a wicked legend.",
		kind: "drama",
		genres: [
			"Musical",
			"Fantasy",
			"Romance"
		],
		year: 2025,
		rating: "PG",
		durationMin: 137,
		matchScore: 98,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "vt98AlBDI9Y"
	}),
	title({
		id: "jurassic",
		name: "Jurassic World Rebirth",
		synopsis: "A new expedition sails toward dinosaurs that have grown rarer, smarter, and much less interested in being studied.",
		kind: "movie",
		genres: [
			"Action",
			"Sci-Fi",
			"Adventure"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 133,
		matchScore: 93,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "jan5CFWs9ic"
	}),
	title({
		id: "mi",
		name: "Mission: Impossible – The Final Reckoning",
		synopsis: "Every choice Ethan Hunt has ever made lands here. The IMF’s last mission may also be its last day.",
		kind: "movie",
		genres: [
			"Action",
			"Spy",
			"Thriller"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 169,
		matchScore: 97,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "fsQgc9pCyDU"
	}),
	title({
		id: "zootopia2",
		name: "Zootopia 2",
		synopsis: "Judy and Nick follow a venomous new case into parts of the city no mammal was meant to see.",
		kind: "movie",
		genres: [
			"Animation",
			"Family",
			"Comedy"
		],
		year: 2025,
		rating: "PG",
		durationMin: 108,
		matchScore: 95,
		featured: false,
		trending: false,
		isNew: false,
		comingSoon: false,
		ytId: "BjkIOU5PhyQ"
	}),
	title({
		id: "httyd",
		name: "How to Train Your Dragon",
		synopsis: "A live-action Berk: Hiccup befriends a Night Fury and tries to end a war his father was born to fight.",
		kind: "movie",
		genres: [
			"Adventure",
			"Family",
			"Fantasy"
		],
		year: 2025,
		rating: "PG",
		durationMin: 125,
		matchScore: 94,
		featured: false,
		trending: false,
		isNew: false,
		comingSoon: false,
		ytId: "22w7z_lT6YM"
	}),
	title({
		id: "minecraft",
		name: "A Minecraft Movie",
		synopsis: "Four misfits fall through a portal into the Overworld, where imagination is the only way out.",
		kind: "movie",
		genres: [
			"Adventure",
			"Family",
			"Comedy"
		],
		year: 2025,
		rating: "PG",
		durationMin: 101,
		matchScore: 91,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "wJO_vIDZn-I"
	}),
	title({
		id: "years28",
		name: "28 Years Later",
		synopsis: "Danny Boyle and Alex Garland return. The rage virus still holds Britain — and the infected have changed.",
		kind: "movie",
		genres: [
			"Horror",
			"Thriller",
			"Sci-Fi"
		],
		year: 2025,
		rating: "R",
		durationMin: 115,
		matchScore: 95,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "mcvLKldPM08"
	}),
	title({
		id: "tron",
		name: "Tron: Ares",
		synopsis: "A program is sent from the Grid into the real world. Humankind’s first encounter with a being of code.",
		kind: "movie",
		genres: [
			"Sci-Fi",
			"Action",
			"Thriller"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 119,
		matchScore: 90,
		featured: false,
		trending: false,
		isNew: false,
		comingSoon: false,
		ytId: "YShVEXb7-ic"
	}),
	title({
		id: "thunderbolts",
		name: "Thunderbolts*",
		synopsis: "Not super. Not heroes. Marvel’s antiheroes get one last shot at redemption — or at each other.",
		kind: "movie",
		genres: [
			"Action",
			"Superhero",
			"Drama"
		],
		year: 2025,
		rating: "PG-13",
		durationMin: 126,
		matchScore: 93,
		featured: false,
		trending: true,
		isNew: false,
		comingSoon: false,
		ytId: "-sAOWhvheK8"
	}),
	title({
		id: "hunger",
		name: "The Hunger Games: Sunrise on the Reaping",
		synopsis: "Twenty-four years before Katniss — Haymitch Abernathy walks into the Second Quarter Quell.",
		kind: "drama",
		genres: [
			"Dystopia",
			"Action",
			"Drama"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 140,
		matchScore: 96,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: true,
		ytId: "fS35YSjopjE"
	}),
	title({
		id: "mk2",
		name: "Mortal Kombat II",
		synopsis: "Earthrealm’s champions return as the tournament spills off the island and into a war of realms.",
		kind: "movie",
		genres: [
			"Action",
			"Fantasy",
			"Martial Arts"
		],
		year: 2026,
		rating: "R",
		durationMin: 122,
		matchScore: 91,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "-TjLBB5Ny6k"
	}),
	title({
		id: "scream7",
		name: "Scream 7",
		synopsis: "Ghostface is back, and this time the rules of the franchise are the weapon.",
		kind: "movie",
		genres: [
			"Horror",
			"Thriller",
			"Mystery"
		],
		year: 2026,
		rating: "R",
		durationMin: 118,
		matchScore: 90,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "UEzhbCUTxlM"
	}),
	title({
		id: "prada2",
		name: "The Devil Wears Prada 2",
		synopsis: "Andy is back in Miranda’s orbit — older, sharper, and still not dressed for the weather.",
		kind: "drama",
		genres: [
			"Comedy",
			"Drama",
			"Fashion"
		],
		year: 2026,
		rating: "PG-13",
		durationMin: 118,
		matchScore: 93,
		featured: false,
		trending: false,
		isNew: true,
		comingSoon: false,
		ytId: "e9HXmMnUEdE"
	}),
	title({
		id: "stranger",
		name: "Stranger Things",
		synopsis: "The final season. Hawkins is locked down, Eleven is in hiding, and Vecna is done playing campaigns.",
		kind: "series",
		genres: [
			"Sci-Fi",
			"Horror",
			"Drama"
		],
		year: 2025,
		rating: "TV-14",
		durationMin: 70,
		seasons: 5,
		matchScore: 99,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "PssKpzB0Ah0",
		episodes: [{
			id: "st-1",
			season: 5,
			episode: 1,
			name: "The Crawl",
			synopsis: "The party hunts Vecna as Hawkins collapses inward.",
			durationMin: 70,
			videoUrl: yt("PssKpzB0Ah0")
		}, {
			id: "st-2",
			season: 5,
			episode: 2,
			name: "Chapter Two",
			synopsis: "One last fight for the days on the other side of this.",
			durationMin: 80,
			videoUrl: yt("AfQ13jsLDms")
		}]
	}),
	title({
		id: "severance",
		name: "Severance",
		synopsis: "Season two: Mark and his innies learn what it costs to touch the barrier between work and the rest of a life.",
		kind: "series",
		genres: [
			"Thriller",
			"Drama",
			"Mystery"
		],
		year: 2025,
		rating: "TV-MA",
		durationMin: 55,
		seasons: 2,
		matchScore: 98,
		featured: false,
		trending: true,
		isNew: true,
		comingSoon: false,
		ytId: "_UXKlYvLGJY",
		episodes: [{
			id: "sev-1",
			season: 2,
			episode: 1,
			name: "Good News About Hell",
			synopsis: "Hope this finds you well.",
			durationMin: 55,
			videoUrl: yt("_UXKlYvLGJY")
		}]
	})
];
var ADMIN_USER = "admin";
var ADMIN_PASS = "velora2026";
var TOKEN_SECRET = new TextEncoder().encode("velora-admin-hs256-preview-key-do-not-reuse");
function asInt(v) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : 0;
}
function parseEpisodes(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(Boolean);
	} catch {
		return [];
	}
}
function rowToTitle(row) {
	const kind = row.kind === "series" || row.kind === "drama" ? row.kind : "movie";
	return {
		id: row.id,
		name: row.name,
		synopsis: row.synopsis,
		kind,
		genres: row.genres.split(",").map((g) => g.trim()).filter(Boolean),
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
		episodes: parseEpisodes(row.episodes_json || "[]")
	};
}
async function insertTitle(sql, t) {
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
async function ensureSeeded() {
	const sql = await getSql();
	await sql`
    create table if not exists catalog_meta (
      key text primary key,
      value text not null
    )
  `;
	if ((await sql`
    select value from catalog_meta where key = 'revision' limit 1
  `)[0]?.value === "2026-09-13-latest") return;
	const retire = [.../* @__PURE__ */ new Set([...RETIRED_SEED_IDS, ...SEED_TITLES.map((t) => t.id)])];
	for (const id of retire) await sql`delete from titles where id = ${id}`;
	for (const title of SEED_TITLES) await insertTitle(sql, title);
	await sql`
    insert into catalog_meta (key, value)
    values ('revision', ${CATALOG_REVISION})
    on conflict (key) do update set value = ${CATALOG_REVISION}
  `;
}
async function fetchTitles() {
	await ensureSeeded();
	return (await (await getSql())`
    select * from titles
    order by featured desc, trending desc, year desc, name asc
  `).map(rowToTitle);
}
async function fetchTitle(id) {
	await ensureSeeded();
	const rows = await (await getSql())`select * from titles where id = ${id} limit 1`;
	return rows[0] ? rowToTitle(rows[0]) : null;
}
async function signAdminToken() {
	return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject(ADMIN_USER).setIssuedAt().setExpirationTime("7d").sign(TOKEN_SECRET);
}
async function verifyAdminToken(token) {
	const { payload } = await jwtVerify(token, TOKEN_SECRET);
	if (payload.role !== "admin") throw new Error("Forbidden");
	return true;
}
function checkAdminCredentials(username, password) {
	return username.trim() === ADMIN_USER && password === ADMIN_PASS;
}
async function createTitleRow(input) {
	const sql = await getSql();
	const title = {
		id: `${slugify(input.name) || "title"}-${Date.now().toString(36)}`,
		name: input.name.trim(),
		synopsis: input.synopsis.trim(),
		kind: input.kind,
		genres: input.genres.split(",").map((g) => g.trim()).filter(Boolean),
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
		episodes: []
	};
	await insertTitle(sql, title);
	return title;
}
async function updateTitleRow(id, input) {
	if (!await fetchTitle(id)) return null;
	const sql = await getSql();
	const genres = input.genres.split(",").map((g) => g.trim()).filter(Boolean).join(", ");
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
async function deleteTitleRow(id) {
	await (await getSql())`delete from titles where id = ${id}`;
}
//#endregion
export { checkAdminCredentials, createTitleRow, deleteTitleRow, fetchTitle, fetchTitles, signAdminToken, updateTitleRow, verifyAdminToken };
