import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseGrid } from "@/components/media/rows";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  loader: () => listTitles(),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const titles = Route.useLoaderData();
  const needle = q.trim().toLowerCase();
  const matches = needle
    ? titles.filter((t) => {
        const hay = `${t.name} ${t.synopsis} ${t.genres.join(" ")} ${t.kind}`.toLowerCase();
        return hay.includes(needle);
      })
    : titles;

  return (
    <AppShell>
      <BrowseGrid
        heading={needle ? `Results for “${q}”` : "Search the catalog"}
        kicker="Find"
        titles={matches}
      />
    </AppShell>
  );
}
