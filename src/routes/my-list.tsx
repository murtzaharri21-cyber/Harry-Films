import { createFileRoute } from "@tanstack/react-router";
import { listTitles } from "@/lib/catalog.functions";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseGrid } from "@/components/media/rows";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/my-list")({
  loader: () => listTitles(),
  component: MyListPage,
});

function MyListPage() {
  const titles = Route.useLoaderData();
  const myList = useLibrary((s) => s.myList);
  const mine = myList
    .map((id) => titles.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <AppShell>
      <BrowseGrid
        heading="My List"
        kicker="Saved"
        titles={mine}
      />
      {mine.length === 0 ? (
        <p className="px-4 text-muted sm:px-8">
          Add titles from any row — they live here on this device.
        </p>
      ) : null}
    </AppShell>
  );
}
