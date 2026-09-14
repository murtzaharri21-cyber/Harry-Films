import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Plus, p as Check, s as Play } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-COSF6AoY.mjs";
import { i as isPlayable, r as formatRuntime } from "./utils-DfyWkWHU.mjs";
import { t as Button } from "./button-DqLXBSYX.mjs";
import { i as useLibrary } from "./library-store-CN-kVHLs.mjs";
import { r as TitleRow, t as AppShell } from "./title-card-CoApRYso.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/title._id-BkzYMMNh.js
var import_jsx_runtime = require_jsx_runtime();
function TitlePage() {
	const { title, all } = Route$1.useLoaderData();
	const inList = useLibrary((s) => s.myList.includes(title.id));
	const toggleList = useLibrary((s) => s.toggleList);
	const playable = isPlayable(title);
	const similar = all.filter((t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g))).slice(0, 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		transparent: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate min-h-[62vh] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: title.backdropUrl || title.posterUrl,
						alt: "",
						className: "absolute inset-0 size-full object-cover object-top"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto flex max-w-[1600px] flex-col gap-8 px-4 pt-28 pb-12 sm:flex-row sm:items-end sm:px-8 sm:pt-36",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: title.posterUrl,
							alt: "",
							className: "hidden w-44 rounded-sm shadow-[var(--shadow-card)] sm:block"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								title.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-[0.22em] text-accent uppercase",
									children: "Coming soon"
								}) : title.original ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-[0.22em] text-accent uppercase",
									children: "Velora Original"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl",
									children: title.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-fg",
											children: [title.matchScore, "% Match"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-2",
											children: title.year
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-sm border border-fg/30 px-1.5 py-0.5 text-xs",
											children: title.rating
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-2",
											children: formatRuntime(title.durationMin)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: title.kind
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-2xl text-pretty text-fg/90",
									children: title.synopsis
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-subtle",
									children: title.genres.join(" · ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-3",
									children: [playable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/watch/$id",
											params: { id: title.id },
											search: { e: void 0 },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "fill-current" }), "Play"]
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "lg",
										disabled: true,
										children: "Coming soon"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "ghost",
										size: "lg",
										onClick: () => toggleList(title.id),
										children: [inList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), inList ? "On My List" : "My List"]
									})]
								})
							]
						})]
					})
				]
			}),
			title.episodes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-[1600px] px-4 py-8 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold",
					children: "Episodes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface",
					children: title.episodes.map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/watch/$id",
						params: { id: title.id },
						search: { e: ep.id },
						className: "flex gap-4 px-4 py-4 hover:bg-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 shrink-0 text-lg font-semibold text-subtle tabular-nums",
							children: ep.episode
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [ep.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs font-normal text-muted",
									children: formatRuntime(ep.durationMin)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: ep.synopsis
							})]
						})]
					}) }, ep.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleRow, {
					heading: "More like this",
					titles: similar
				})
			})
		]
	});
}
//#endregion
export { TitlePage as component };
