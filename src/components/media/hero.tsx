import { Link } from "@tanstack/react-router";
import { Info, Play, Plus, Check } from "lucide-react";
import type { Title } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatRuntime, isPlayable } from "@/lib/utils";
import { useLibrary } from "@/lib/library-store";

export function HeroBillboard({ title }: { title: Title }) {
  const inList = useLibrary((s) => s.myList.includes(title.id));
  const toggleList = useLibrary((s) => s.toggleList);
  const playable = isPlayable(title);

  return (
    <section className="relative isolate min-h-[78vh] w-full overflow-hidden sm:min-h-[88vh]">
      <img
        src={title.backdropUrl || title.posterUrl}
        alt=""
        className="absolute inset-0 size-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[88vh] sm:px-8 sm:pb-24">
        <p className="stagger-in text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {title.comingSoon
            ? "Coming soon"
            : title.original
              ? "Harry Original"
              : title.kind}
        </p>
        <h1 className="stagger-in mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          {title.name}
        </h1>
        <p className="stagger-in mt-4 max-w-xl text-sm text-muted sm:text-base">
          <span className="font-semibold text-fg">{title.matchScore}% Match</span>
          <span className="mx-2">{title.year}</span>
          <span className="rounded-sm border border-fg/30 px-1.5 py-0.5 text-xs">
            {title.rating}
          </span>
          <span className="mx-2">{formatRuntime(title.durationMin)}</span>
          {title.kind === "series" ? (
            <span>
              {title.seasons} season{title.seasons > 1 ? "s" : ""}
            </span>
          ) : null}
        </p>
        <p className="stagger-in mt-4 max-w-xl text-pretty text-sm leading-relaxed text-fg/85 sm:text-base">
          {title.synopsis}
        </p>
        <div className="stagger-in mt-7 flex flex-wrap items-center gap-3">
          {playable ? (
            <Button asChild size="lg">
              <Link to="/watch/$id" params={{ id: title.id }} search={{ e: undefined }}>
                <Play className="size-5 fill-current" />
                Play
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="lg" disabled>
              Coming soon
            </Button>
          )}
          <Button asChild variant="ghost" size="lg">
            <Link to="/title/$id" params={{ id: title.id }}>
              <Info className="size-5" />
              More info
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={inList ? "Remove from My List" : "Add to My List"}
            onClick={() => toggleList(title.id)}
          >
            {inList ? <Check /> : <Plus />}
          </Button>
        </div>
      </div>
    </section>
  );
}
