import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Play, Plus } from "lucide-react";
import { getTitle, listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { TitleRow } from "@/components/media/title-card";
import { formatRuntime, isPlayable } from "@/lib/utils";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/title/$id")({
  loader: async ({ params }) => {
    const [title, all] = await Promise.all([
      getTitle({ data: { id: params.id } }),
      listTitles(),
    ]);
    if (!title) throw notFound();
    return { title, all };
  },
  component: TitlePage,
});

function TitlePage() {
  const { title, all } = Route.useLoaderData();
  const inList = useLibrary((s) => s.myList.includes(title.id));
  const toggleList = useLibrary((s) => s.toggleList);
  const playable = isPlayable(title);
  const similar = all
    .filter((t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g)))
    .slice(0, 12);

  return (
    <AppShell transparent>
      <section className="relative isolate min-h-[62vh] overflow-hidden">
        <img
          src={title.backdropUrl || title.posterUrl}
          alt=""
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-8 px-4 pt-28 pb-12 sm:flex-row sm:items-end sm:px-8 sm:pt-36">
          <img
            src={title.posterUrl}
            alt=""
            className="hidden w-44 rounded-sm shadow-[var(--shadow-card)] sm:block"
          />
          <div className="min-w-0">
            {title.comingSoon ? (
              <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                Coming soon
              </p>
            ) : title.original ? (
              <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                Harry Original
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              {title.name}
            </h1>
            <p className="mt-3 text-sm text-muted">
              <span className="font-semibold text-fg">{title.matchScore}% Match</span>
              <span className="mx-2">{title.year}</span>
              <span className="rounded-sm border border-fg/30 px-1.5 py-0.5 text-xs">
                {title.rating}
              </span>
              <span className="mx-2">{formatRuntime(title.durationMin)}</span>
              <span className="capitalize">{title.kind}</span>
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-fg/90">{title.synopsis}</p>
            <p className="mt-3 text-sm text-subtle">{title.genres.join(" · ")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {playable ? (
                <Button asChild size="lg">
                  <Link to="/watch/$id" params={{ id: title.id }} search={{ e: undefined }}>
                    <Play className="fill-current" />
                    Play
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="lg" disabled>
                  Coming soon
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => toggleList(title.id)}
              >
                {inList ? <Check /> : <Plus />}
                {inList ? "On My List" : "My List"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {title.episodes.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
          <h2 className="text-xl font-semibold">Episodes</h2>
          <ol className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {title.episodes.map((ep) => (
              <li key={ep.id}>
                <Link
                  to="/watch/$id"
                  params={{ id: title.id }}
                  search={{ e: ep.id }}
                  className="flex gap-4 px-4 py-4 hover:bg-elevated"
                >
                  <span className="w-8 shrink-0 text-lg font-semibold text-subtle tabular-nums">
                    {ep.episode}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {ep.name}
                      <span className="ml-2 text-xs font-normal text-muted">
                        {formatRuntime(ep.durationMin)}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{ep.synopsis}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="pb-10">
        <TitleRow heading="More like this" titles={similar} />
      </div>
    </AppShell>
  );
}
