import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Title } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number) {
  if (minutes < 1) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

const YT_ID = /^[\w-]{11}$/;

export function parseYoutubeId(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;
  if (raw.startsWith("youtube:")) {
    const id = raw.slice("youtube:".length).trim();
    return YT_ID.test(id) ? id : null;
  }
  try {
    const u = new URL(raw);
    if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0] ?? "";
      return YT_ID.test(id) ? id : null;
    }
    if (u.hostname.includes("youtube")) {
      const v = u.searchParams.get("v");
      if (v && YT_ID.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      const id = embedIdx >= 0 ? parts[embedIdx + 1] : parts.at(-1);
      return id && YT_ID.test(id) ? id : null;
    }
  } catch {
    /* not a URL */
  }
  return YT_ID.test(raw) ? raw : null;
}

export function isPlayable(title: Pick<Title, "videoUrl" | "episodes">) {
  return Boolean(title.videoUrl) || title.episodes.some((e) => Boolean(e.videoUrl));
}
