import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useLibrary } from "./library-store-CN-kVHLs.mjs";
import { n as TitleCard, r as TitleRow } from "./title-card-CoApRYso.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rows-CNsr2ytg.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogRows({ titles }) {
	const myList = useLibrary((s) => s.myList);
	const progress = useLibrary((s) => s.progress);
	const progressMap = {};
	for (const [id, entry] of Object.entries(progress)) if (entry.duration > 0) progressMap[id] = entry.position / entry.duration;
	const continueWatching = titles.filter((t) => {
		const p = progressMap[t.id];
		return p && p > .03 && p < .95;
	});
	const list = titles.filter((t) => myList.includes(t.id));
	const trending = titles.filter((t) => t.trending);
	const originals = titles.filter((t) => t.original);
	const movies = titles.filter((t) => t.kind === "movie");
	const series = titles.filter((t) => t.kind === "series");
	const dramas = titles.filter((t) => t.kind === "drama");
	const horror = titles.filter((t) => t.genres.some((g) => /horror|gothic|thriller/i.test(g)));
	const animation = titles.filter((t) => t.genres.some((g) => /animation|family/i.test(g)));
	const coming = titles.filter((t) => t.comingSoon);
	const fresh = titles.filter((t) => t.isNew);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 -mt-16 flex flex-col gap-2 pb-10 sm:-mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Continue Watching",
				titles: continueWatching,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "My List",
				titles: list,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Trending Now",
				titles: trending,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Velora Originals",
				titles: originals,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "New on Velora",
				titles: fresh,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Movies",
				titles: movies,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Series",
				titles: series,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Dramas",
				titles: dramas,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Animation",
				titles: animation,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Dark & Thrilling",
				titles: horror,
				progressMap
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
				heading: "Coming Soon",
				titles: coming,
				progressMap
			})
		]
	});
}
function BrowseGrid({ heading, kicker, titles }) {
	const progress = useLibrary((s) => s.progress);
	const progressMap = {};
	for (const [id, entry] of Object.entries(progress)) if (entry.duration > 0) progressMap[id] = entry.position / entry.duration;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-24 pb-16 sm:px-8",
		children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-[0.2em] text-accent uppercase",
				children: kicker
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl",
				children: heading
			}),
			titles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-muted",
				children: "Nothing here yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
				children: titles.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 [&_article]:w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCard, {
						title,
						progress: progressMap[title.id]
					})
				}, title.id))
			})
		]
	});
}
//#endregion
export { CatalogRows as n, BrowseGrid as t };
