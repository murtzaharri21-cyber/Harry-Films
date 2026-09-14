import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseGrid } from "@/components/media/rows";

export const Route = createFileRoute("/dramas")({
  loader: () => listTitles(),
  component: DramasPage,
});

function DramasPage() {
  const titles = Route.useLoaderData().filter((t) => t.kind === "drama");
  return (
    <AppShell>
      <BrowseGrid heading="Dramas" kicker="Story" titles={titles} />
    </AppShell>
  );
}
