import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Pause, d as Maximize, l as Minimize, m as ArrowLeft, n as VolumeX, r as Volume2, s as Play } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-COSF6AoY.mjs";
import { a as parseYoutubeId, i as isPlayable, n as formatClock } from "./utils-DfyWkWHU.mjs";
import { i as useLibrary } from "./library-store-CN-kVHLs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch._id-CfYClTxV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Player({ title, episodeId }) {
	const episodes = title.episodes;
	const currentEpisode = episodes.find((e) => e.id === episodeId) ?? episodes[0];
	const src = currentEpisode?.videoUrl || title.videoUrl;
	const label = currentEpisode ? `${title.name} · S${currentEpisode.season} E${currentEpisode.episode}` : title.name;
	const youtubeId = parseYoutubeId(src);
	const next = currentEpisode ? episodes.find((e) => e.season === currentEpisode.season && e.episode === currentEpisode.episode + 1) ?? episodes.find((e) => e.season === currentEpisode.season + 1 && e.episode === 1) : void 0;
	if (youtubeId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YoutubePlayer, {
		title,
		youtubeId,
		label,
		episodeName: currentEpisode?.name,
		next
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html5Player, {
		title,
		src,
		label,
		episodeId: currentEpisode?.id,
		episodeName: currentEpisode?.name,
		next
	});
}
function Chrome({ titleId, label, kicker, next }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg/80 to-transparent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto flex items-center gap-3 px-4 py-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/title/$id",
					params: { id: titleId },
					className: "grid size-11 place-items-center rounded-full bg-bg/40 text-fg",
					"aria-label": "Back",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold sm:text-base",
						children: label
					}), kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: kicker
					}) : null]
				}),
				next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/watch/$id",
					params: { id: titleId },
					search: { e: next.id },
					className: "ml-auto hidden h-9 items-center rounded-md bg-fg/15 px-3 text-xs font-semibold sm:inline-flex",
					children: "Next episode"
				}) : null
			]
		})
	});
}
function YoutubePlayer({ title, youtubeId, label, episodeName, next }) {
	const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: label,
			src,
			className: "absolute inset-0 size-full border-0",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
			allowFullScreen: true,
			referrerPolicy: "strict-origin-when-cross-origin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chrome, {
			titleId: title.id,
			label,
			kicker: episodeName ? episodeName : "Official trailer",
			next
		})]
	});
}
function Html5Player({ title, src, label, episodeId, episodeName, next }) {
	const navigate = useNavigate();
	const videoRef = (0, import_react.useRef)(null);
	const hideTimer = (0, import_react.useRef)(null);
	const setProgress = useLibrary((s) => s.setProgress);
	const saved = useLibrary((s) => s.progress[title.id]);
	const [playing, setPlaying] = (0, import_react.useState)(true);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [controls, setControls] = (0, import_react.useState)(true);
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [activeSrc, setActiveSrc] = (0, import_react.useState)(src);
	(0, import_react.useEffect)(() => {
		setActiveSrc(src);
		setFailed(false);
	}, [src]);
	(0, import_react.useEffect)(() => {
		const v = videoRef.current;
		if (!v) return;
		if (saved && (!episodeId || saved.episodeId === episodeId) && saved.position > 8) v.currentTime = saved.position;
		v.play().catch(() => setPlaying(false));
	}, [activeSrc]);
	(0, import_react.useEffect)(() => {
		const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, []);
	function bumpControls() {
		setControls(true);
		if (hideTimer.current) window.clearTimeout(hideTimer.current);
		hideTimer.current = window.setTimeout(() => {
			if (videoRef.current && !videoRef.current.paused) setControls(false);
		}, 2800);
	}
	function togglePlay() {
		const v = videoRef.current;
		if (!v) return;
		if (v.paused) {
			v.play();
			setPlaying(true);
		} else {
			v.pause();
			setPlaying(false);
		}
		bumpControls();
	}
	function persist() {
		const v = videoRef.current;
		if (!v || !v.duration) return;
		setProgress(title.id, {
			position: v.currentTime,
			duration: v.duration,
			episodeId,
			updatedAt: Date.now()
		});
	}
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const v = videoRef.current;
			if (!v) return;
			if (e.key === " " || e.key === "k") {
				e.preventDefault();
				togglePlay();
			} else if (e.key === "f") toggleFs();
			else if (e.key === "m") {
				v.muted = !v.muted;
				setMuted(v.muted);
			} else if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
			else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 10);
			else if (e.key === "Escape") navigate({
				to: "/title/$id",
				params: { id: title.id }
			});
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	async function toggleFs() {
		const root = videoRef.current?.parentElement;
		if (!root) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else await root.requestFullscreen().catch(() => void 0);
	}
	const pct = duration > 0 ? time / duration * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		onMouseMove: bumpControls,
		onTouchStart: bumpControls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: activeSrc,
				className: "size-full object-contain bg-bg",
				autoPlay: true,
				playsInline: true,
				onClick: togglePlay,
				onPlay: () => setPlaying(true),
				onPause: () => {
					setPlaying(false);
					persist();
				},
				onTimeUpdate: (e) => {
					const v = e.currentTarget;
					setTime(v.currentTime);
					if (Math.floor(v.currentTime) % 5 === 0) persist();
				},
				onLoadedMetadata: (e) => setDuration(e.currentTarget.duration || 0),
				onEnded: () => {
					persist();
					if (next) navigate({
						to: "/watch/$id",
						params: { id: title.id },
						search: { e: next.id }
					});
				},
				onError: () => setFailed(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50 transition-opacity duration-200 ${controls ? "opacity-100" : "opacity-0"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `absolute inset-x-0 top-0 z-10 transition-[opacity,transform] duration-200 ${controls ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-2"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chrome, {
					titleId: title.id,
					label,
					kicker: episodeName,
					next: void 0
				})
			}),
			!playing && controls ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: togglePlay,
				className: "absolute top-1/2 left-1/2 z-10 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-play text-play-fg",
				"aria-label": "Play",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-8 fill-current" })
			}) : null,
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 grid place-items-center bg-bg px-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "This title could not start."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: "Try another film, or come back in a moment."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/title/$id",
						params: { id: title.id },
						className: "mt-6 inline-flex h-11 items-center rounded-md bg-play px-5 font-semibold text-play-fg",
						children: "Back to details"
					})
				] })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `absolute inset-x-0 bottom-0 z-10 px-4 pb-5 transition-[opacity,transform] duration-200 sm:px-6 ${controls ? "opacity-100" : "pointer-events-none opacity-0 translate-y-2"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: duration || 0,
					step: .1,
					value: time,
					"aria-label": "Seek",
					onChange: (e) => {
						const v = videoRef.current;
						const nextT = Number(e.target.value);
						if (v) v.currentTime = nextT;
						setTime(nextT);
					},
					className: "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-fg/20 accent-accent",
					style: { background: `linear-gradient(to right, var(--color-accent) ${pct}%, rgb(245 245 245 / 0.2) ${pct}%)` }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: togglePlay,
							"aria-label": playing ? "Pause" : "Play",
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 fill-current" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: () => {
								const v = videoRef.current;
								if (!v) return;
								v.muted = !v.muted;
								setMuted(v.muted);
							},
							"aria-label": muted ? "Unmute" : "Mute",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs tabular-nums text-muted",
							children: [
								formatClock(time),
								" / ",
								formatClock(duration)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
						next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/watch/$id",
							params: { id: title.id },
							search: { e: next.id },
							className: "hidden h-9 items-center rounded-md bg-fg/15 px-3 text-xs font-semibold sm:inline-flex",
							children: "Next episode"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: () => void toggleFs(),
							"aria-label": fullscreen ? "Exit fullscreen" : "Fullscreen",
							children: fullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-5" })
						})
					]
				})]
			})
		]
	});
}
function WatchPage() {
	const title = Route.useLoaderData();
	const { e } = Route.useSearch();
	if (!isPlayable(title)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl",
				children: title.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "This title is coming soon to Velora."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/title/$id",
				params: { id: title.id },
				className: "mt-6 inline-flex h-11 items-center rounded-md bg-play px-5 font-semibold text-play-fg",
				children: "Back to details"
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
		title,
		episodeId: e
	});
}
//#endregion
export { WatchPage as component };
