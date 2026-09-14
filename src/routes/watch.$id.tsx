import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTitle } from "@/lib/catalog.functions";
import { Player } from "@/components/media/player";
import { isPlayable } from "@/lib/utils";

export const Route = createFileRoute("/watch/$id")({
  validateSearch: (s: Record<string, unknown>) => ({
    e: typeof s.e === "string" ? s.e : undefined,
  }),
  loader: async ({ params }) => {
    const title = await getTitle({ data: { id: params.id } });
    if (!title) throw notFound();
    return title;
  },
  component: WatchPage,
});

function WatchPage() {
  const title = Route.useLoaderData();
  const { e } = Route.useSearch();

  if (!isPlayable(title)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div>
          <p className="font-display text-3xl">{title.name}</p>
          <p className="mt-2 text-muted">This title is coming soon to Harry Films.</p>
          <Link
            to="/title/$id"
            params={{ id: title.id }}
            className="mt-6 inline-flex h-11 items-center rounded-md bg-play px-5 font-semibold text-play-fg"
          >
            Back to details
          </Link>
        </div>
      </div>
    );
  }

  return <Player title={title} episodeId={e} />;
}
