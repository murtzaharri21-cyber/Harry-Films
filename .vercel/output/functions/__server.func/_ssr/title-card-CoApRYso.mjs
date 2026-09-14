import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, o as Plus, p as Check, s as Play, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { i as isPlayable, r as formatRuntime, t as cn } from "./utils-DfyWkWHU.mjs";
import { i as useLibrary, n as getAdminToken } from "./library-store-CN-kVHLs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/title-card-CoApRYso.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Logo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2 text-fg no-underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative grid size-7 place-items-center rounded-sm bg-accent",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-0.5 size-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-accent-fg" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-display text-2xl font-semibold tracking-tight", compact && "hidden sm:inline"),
			children: "Velora"
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/movies",
		label: "Movies"
	},
	{
		to: "/series",
		label: "Series"
	},
	{
		to: "/dramas",
		label: "Dramas"
	},
	{
		to: "/my-list",
		label: "My List"
	}
];
function AppShell({ children, transparent = false }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsAdmin(Boolean(getAdminToken()));
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	function submitSearch(e) {
		e.preventDefault();
		const q = query.trim();
		navigate({
			to: "/search",
			search: { q }
		});
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-200", !transparent || scrolled || open ? "bg-bg/95 shadow-[0_1px_0_0] shadow-border/80 backdrop-blur-md" : "bg-gradient-to-b from-bg/80 to-transparent"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:h-[68px] sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-4 hidden items-center gap-5 md:flex",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("text-sm transition-colors duration-150", active ? "font-semibold text-fg" : "text-muted hover:text-fg"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
									onSubmit: submitSearch,
									className: "hidden items-center sm:flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex h-10 items-center overflow-hidden rounded-md border transition-[width,border-color,background-color] duration-200", searchOpen ? "w-52 border-border bg-elevated" : "w-10 border-transparent bg-transparent"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Search",
											className: "grid size-10 place-items-center text-fg",
											onClick: () => setSearchOpen((v) => !v),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: query,
											onChange: (e) => setQuery(e.target.value),
											placeholder: "Titles, genres",
											className: cn("h-10 bg-transparent text-sm text-fg outline-none placeholder:text-subtle", searchOpen ? "w-full pr-3" : "w-0 p-0")
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: isAdmin ? "/admin" : "/admin/login",
									className: "hidden h-9 items-center rounded-md px-3 text-xs font-semibold uppercase tracking-wider text-muted hover:text-fg sm:inline-flex",
									children: isAdmin ? "Admin" : "Sign in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center rounded-md text-fg md:hidden",
									"aria-label": open ? "Close menu" : "Open menu",
									onClick: () => setOpen((v) => !v),
									children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							]
						})
					]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border bg-bg px-4 py-4 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-col gap-1",
						children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: "flex h-11 items-center rounded-md px-2 text-base text-fg",
							children: item.label
						}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: isAdmin ? "/admin" : "/admin/login",
							onClick: () => setOpen(false),
							className: "flex h-11 items-center rounded-md px-2 text-base text-muted",
							children: isAdmin ? "Admin desk" : "Admin sign in"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submitSearch,
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search titles",
							className: "h-11 flex-1 rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "grid size-11 place-items-center rounded-md bg-elevated",
							"aria-label": "Search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
						})]
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border px-6 py-10 text-sm text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-pretty",
						children: "The latest movies, series, and dramas — official trailers and coming-soon premieres, in a cinematic house."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Velora · Watch something unforgettable" })]
				})
			})
		]
	});
}
function TitleCard({ title, progress }) {
	const inList = useLibrary((s) => s.myList.includes(title.id));
	const toggleList = useLibrary((s) => s.toggleList);
	const playable = isPlayable(title);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative w-[42vw] shrink-0 sm:w-[28vw] md:w-[18vw] lg:w-[14.5vw] xl:w-[13vw]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/title/$id",
				params: { id: title.id },
				className: "block overflow-hidden rounded-sm bg-elevated shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[2/3] overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: title.posterUrl,
							alt: "",
							className: "size-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" }),
						title.comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-2 left-2 rounded-sm bg-bg/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
							children: "Coming soon"
						}) : title.isNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-2 left-2 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-fg uppercase",
							children: "New"
						}) : null,
						title.original ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-2 right-2 font-display text-[11px] tracking-wide text-accent",
							children: "V"
						}) : null,
						progress && progress > .03 && progress < .95 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-fg/25",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block h-full bg-accent",
								style: { width: `${Math.round(progress * 100)}%` }
							})
						}) : null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 -bottom-2 z-10 translate-y-2 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-surface p-3 shadow-[var(--shadow-card)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: title.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-fg/80",
									children: [title.matchScore, "% Match"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: title.year
								}),
								title.comingSoon ? "Soon" : formatRuntime(title.durationMin)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [playable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/watch/$id",
								params: { id: title.id },
								search: { e: void 0 },
								className: "inline-flex size-9 items-center justify-center rounded-full bg-play text-play-fg",
								"aria-label": `Play ${title.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/title/$id",
								params: { id: title.id },
								className: "inline-flex size-9 items-center justify-center rounded-full bg-play text-play-fg",
								"aria-label": `Details for ${title.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": inList ? "Remove from My List" : "Add to My List",
								onClick: () => toggleList(title.id),
								className: "inline-flex size-9 items-center justify-center rounded-full border border-fg/30 bg-elevated text-fg",
								children: inList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 truncate text-sm font-medium md:hidden",
				children: title.name
			})
		]
	});
}
function TitleRow({ heading, titles, progressMap }) {
	if (titles.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative z-0 hover:z-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 px-4 text-lg font-semibold tracking-tight sm:px-8 sm:text-xl",
			children: heading
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-8 sm:gap-3 sm:px-8",
			children: titles.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCard, {
				title,
				progress: progressMap?.[title.id]
			}, title.id))
		})]
	});
}
//#endregion
export { TitleCard as n, TitleRow as r, AppShell as t };
