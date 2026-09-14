import { Link } from "@tanstack/react-router";
import { Play, Plus, Check } from "lucide-react";
import type { Title } from "@/lib/types";
import { formatRuntime, isPlayable } from "@/lib/utils";
import { useLibrary } from "@/lib/library-store";

export function TitleCard({
  title,
  progress,
}: {
  title: Title;
  progress?: number;
}) {
  const inList = useLibrary((s) => s.myList.includes(title.id));
  const toggleList = useLibrary((s) => s.toggleList);
  const playable = isPlayable(title);

  return (
    <article className="group relative w-[42vw] shrink-0 sm:w-[28vw] md:w-[18vw] lg:w-[14.5vw] xl:w-[13vw]">
      <Link
        to="/title/$id"
        params={{ id: title.id }}
        className="block overflow-hidden rounded-sm bg-elevated shadow-[var(--shadow-card)]"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={title.posterUrl}
            alt=""
            className="size-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
          {title.comingSoon ? (
            <span className="absolute top-2 left-2 rounded-sm bg-bg/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
              Coming soon
            </span>
          ) : title.isNew ? (
            <span className="absolute top-2 left-2 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-fg uppercase">
              New
            </span>
          ) : null}
          {title.original ? (
            <span className="absolute top-2 right-2 font-display text-[11px] tracking-wide text-accent">
              H
            </span>
          ) : null}
          {progress && progress > 0.03 && progress < 0.95 ? (
            <span className="absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-fg/25">
              <span
                className="block h-full bg-accent"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          ) : null}
        </div>
      </Link>
      <div className="pointer-events-none absolute inset-x-0 -bottom-2 z-10 translate-y-2 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
        <div className="rounded-md border border-border bg-surface p-3 shadow-[var(--shadow-card)]">
          <p className="truncate text-sm font-semibold">{title.name}</p>
          <p className="mt-1 text-xs text-muted">
            <span className="font-semibold text-fg/80">{title.matchScore}% Match</span>
            <span className="mx-2">{title.year}</span>
            {title.comingSoon ? "Soon" : formatRuntime(title.durationMin)}
          </p>
          <div className="mt-2 flex gap-2">
            {playable ? (
              <Link
                to="/watch/$id"
                params={{ id: title.id }}
                search={{ e: undefined }}
                className="inline-flex size-9 items-center justify-center rounded-full bg-play text-play-fg"
                aria-label={`Play ${title.name}`}
              >
                <Play className="size-4 fill-current" />
              </Link>
            ) : (
              <Link
                to="/title/$id"
                params={{ id: title.id }}
                className="inline-flex size-9 items-center justify-center rounded-full bg-play text-play-fg"
                aria-label={`Details for ${title.name}`}
              >
                <Play className="size-4 fill-current" />
              </Link>
            )}
            <button
              type="button"
              aria-label={inList ? "Remove from My List" : "Add to My List"}
              onClick={() => toggleList(title.id)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-fg/30 bg-elevated text-fg"
            >
              {inList ? <Check className="size-4" /> : <Plus className="size-4" />}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-medium md:hidden">{title.name}</p>
    </article>
  );
}

export function TitleRow({
  heading,
  titles,
  progressMap,
}: {
  heading: string;
  titles: Title[];
  progressMap?: Record<string, number>;
}) {
  if (titles.length === 0) return null;
  return (
    <section className="relative z-0 hover:z-20">
      <h2 className="mb-3 px-4 text-lg font-semibold tracking-tight sm:px-8 sm:text-xl">
        {heading}
      </h2>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-8 sm:gap-3 sm:px-8">
        {titles.map((title) => (
          <TitleCard
            key={title.id}
            title={title}
            progress={progressMap?.[title.id]}
          />
        ))}
      </div>
    </section>
  );
}
