import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Info, o as Plus, p as Check, s as Play } from "../_libs/lucide-react.mjs";
import { u as Route$9 } from "./router-COSF6AoY.mjs";
import { i as isPlayable, r as formatRuntime } from "./utils-DfyWkWHU.mjs";
import { t as Button } from "./button-DqLXBSYX.mjs";
import { i as useLibrary } from "./library-store-CN-kVHLs.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { n as CatalogRows } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-h4j98jhP.js
var import_jsx_runtime = require_jsx_runtime();
function HeroBillboard({ title }) {
	const inList = useLibrary((s) => s.myList.includes(title.id));
	const toggleList = useLibrary((s) => s.toggleList);
	const playable = isPlayable(title);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate min-h-[78vh] w-full overflow-hidden sm:min-h-[88vh]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: title.backdropUrl || title.posterUrl,
				alt: "",
				className: "absolute inset-0 size-full object-cover object-top"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[88vh] sm:px-8 sm:pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stagger-in text-xs font-semibold tracking-[0.22em] text-accent uppercase",
						children: title.comingSoon ? "Coming soon" : title.original ? "Velora Original" : title.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "stagger-in mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl",
						children: title.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "stagger-in mt-4 max-w-xl text-sm text-muted sm:text-base",
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
							title.kind === "series" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								title.seasons,
								" season",
								title.seasons > 1 ? "s" : ""
							] }) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stagger-in mt-4 max-w-xl text-pretty text-sm leading-relaxed text-fg/85 sm:text-base",
						children: title.synopsis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stagger-in mt-7 flex flex-wrap items-center gap-3",
						children: [
							playable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/watch/$id",
									params: { id: title.id },
									search: { e: void 0 },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 fill-current" }), "Play"]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "lg",
								disabled: true,
								children: "Coming soon"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/title/$id",
									params: { id: title.id },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5" }), "More info"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								"aria-label": inList ? "Remove from My List" : "Add to My List",
								onClick: () => toggleList(title.id),
								children: inList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
							})
						]
					})
				]
			})
		]
	});
}
function Home() {
	const titles = Route$9.useLoaderData();
	const hero = titles.find((t) => t.featured && !t.comingSoon) ?? titles.find((t) => !t.comingSoon) ?? titles[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		transparent: true,
		children: [hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroBillboard, { title: hero }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogRows, { titles })]
	});
}
//#endregion
export { Home as component };
