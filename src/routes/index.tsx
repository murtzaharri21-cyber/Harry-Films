import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { HeroBillboard } from "@/components/media/hero";
import { CatalogRows } from "@/components/media/rows";

export const Route = createFileRoute("/")({
  loader: () => listTitles(),
  component: Home,
});

function Home() {
  const titles = Route.useLoaderData();
  const hero =
    titles.find((t) => t.featured && !t.comingSoon) ??
    titles.find((t) => !t.comingSoon) ??
    titles[0];

  return (
    <AppShell transparent>
      {hero ? <HeroBillboard title={hero} /> : <div className="h-24" />}
      <CatalogRows titles={titles} />
    </AppShell>
  );
}
