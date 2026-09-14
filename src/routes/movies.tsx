import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseGrid } from "@/components/media/rows";

export const Route = createFileRoute("/movies")({
  loader: () => listTitles(),
  component: MoviesPage,
});

function MoviesPage() {
  const titles = Route.useLoaderData().filter((t) => t.kind === "movie");
  return (
    <AppShell>
      <BrowseGrid heading="Movies" kicker="Film" titles={titles} />
    </AppShell>
  );
}
