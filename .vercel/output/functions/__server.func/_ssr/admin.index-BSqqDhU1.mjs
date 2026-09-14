import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useRouter, v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as removeTitle, n as createTitle, o as updateTitle } from "./catalog.functions-DyBmflEa.mjs";
import { i as Route$3 } from "./router-COSF6AoY.mjs";
import { t as Button } from "./button-DqLXBSYX.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-D5AKDuAS.mjs";
import { n as getAdminToken, t as clearAdminToken } from "./library-store-CN-kVHLs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BSqqDhU1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	name: "",
	synopsis: "",
	kind: "movie",
	genres: "Drama",
	year: (/* @__PURE__ */ new Date()).getFullYear(),
	rating: "PG-13",
	durationMin: 90,
	seasons: 1,
	posterUrl: "/posters/odyssey.jpg",
	backdropUrl: "/backdrops/odyssey.jpg",
	videoUrl: "",
	featured: false,
	trending: false,
	isNew: true,
	comingSoon: false,
	original: true
};
function toInput(t) {
	return {
		name: t.name,
		synopsis: t.synopsis,
		kind: t.kind,
		genres: t.genres.join(", "),
		year: t.year,
		rating: t.rating,
		durationMin: t.durationMin,
		seasons: t.seasons,
		posterUrl: t.posterUrl,
		backdropUrl: t.backdropUrl,
		videoUrl: t.videoUrl,
		featured: t.featured,
		trending: t.trending,
		isNew: t.isNew,
		comingSoon: t.comingSoon,
		original: t.original
	};
}
function AdminDesk() {
	const titles = Route$3.useLoaderData();
	const router = useRouter();
	const navigate = useNavigate();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const token = (0, import_react.useMemo)(() => getAdminToken(), [editing, titles.length]);
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl",
				children: "Admin desk is locked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Sign in with the house credentials."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/login",
				className: "mt-6 inline-flex h-11 items-center rounded-md bg-accent px-5 font-semibold text-accent-fg",
				children: "Sign in"
			})
		] })
	});
	function startNew() {
		setForm(emptyForm);
		setEditing("new");
		setError("");
	}
	function startEdit(t) {
		setForm(toInput(t));
		setEditing(t.id);
		setError("");
	}
	async function save() {
		if (!token) return;
		setPending(true);
		setError("");
		try {
			if (editing === "new") await createTitle({ data: {
				token,
				title: form
			} });
			else if (editing) await updateTitle({ data: {
				token,
				id: editing,
				title: form
			} });
			setEditing(null);
			await router.invalidate({ sync: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setPending(false);
		}
	}
	async function remove(id) {
		if (!token) return;
		if (!window.confirm("Remove this title from the catalog?")) return;
		await removeTitle({ data: {
			token,
			id
		} });
		await router.invalidate({ sync: true });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-4 border-b border-border px-4 py-4 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-xl",
					children: "Velora"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: "Admin desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "mute",
					size: "sm",
					onClick: () => {
						clearAdminToken();
						navigate({ to: "/admin/login" });
					},
					children: "Sign out"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold",
						children: "Catalog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [titles.length, " titles · add a film or mark something as featured"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "accent",
						onClick: startNew,
						children: "Add title"
					})]
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 grid gap-4 rounded-xl border border-border bg-surface p-5",
					onSubmit: (e) => {
						e.preventDefault();
						save();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: editing === "new" ? "New title" : "Edit title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Kind",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm",
									value: form.kind,
									onChange: (e) => setForm({
										...form,
										kind: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "movie",
											children: "Movie"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "series",
											children: "Series"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "drama",
											children: "Drama"
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Synopsis",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								required: true,
								value: form.synopsis,
								onChange: (e) => setForm({
									...form,
									synopsis: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Year",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.year,
										onChange: (e) => setForm({
											...form,
											year: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Rating",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.rating,
										onChange: (e) => setForm({
											...form,
											rating: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Runtime (min)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.durationMin,
										onChange: (e) => setForm({
											...form,
											durationMin: Number(e.target.value)
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Genres (comma separated)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.genres,
								onChange: (e) => setForm({
									...form,
									genres: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Poster URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.posterUrl,
								onChange: (e) => setForm({
									...form,
									posterUrl: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Backdrop URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.backdropUrl,
								onChange: (e) => setForm({
									...form,
									backdropUrl: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Video URL (youtube:ID, YouTube link, or mp4)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.videoUrl,
								onChange: (e) => setForm({
									...form,
									videoUrl: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-4 text-sm",
							children: [
								["featured", "Featured hero"],
								["trending", "Trending"],
								["isNew", "New"],
								["comingSoon", "Coming soon"],
								["original", "Velora original"]
							].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-11 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form[key],
									onChange: (e) => setForm({
										...form,
										[key]: e.target.checked
									})
								}), label]
							}, key))
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-accent",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "accent",
								disabled: pending,
								children: pending ? "Saving…" : "Save"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setEditing(null),
								children: "Cancel"
							})]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface",
					children: titles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-3 py-3 sm:px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: t.posterUrl,
								alt: "",
								className: "h-16 w-11 rounded-sm object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										t.year,
										" · ",
										t.kind,
										" · ",
										t.comingSoon ? "coming soon" : "live"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "mute",
								size: "sm",
								onClick: () => startEdit(t),
								children: "Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "mute",
								size: "sm",
								onClick: () => void remove(t.id),
								children: "Remove"
							})
						]
					}, t.id))
				})
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminDesk as component };
