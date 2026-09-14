import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseGrid } from "@/components/media/rows";

export const Route = createFileRoute("/series")({
  loader: () => listTitles(),
  component: SeriesPage,
});

function SeriesPage() {
  const titles = Route.useLoaderData().filter((t) => t.kind === "series");
  return (
    <AppShell>
      <BrowseGrid heading="Series" kicker="Binge" titles={titles} />
    </AppShell>
  );
}
