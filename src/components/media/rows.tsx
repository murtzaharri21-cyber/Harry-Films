import type { Title } from "@/lib/types";
import { TitleCard, TitleRow } from "@/components/media/title-card";
import { useLibrary } from "@/lib/library-store";

export function CatalogRows({ titles }: { titles: Title[] }) {
  const myList = useLibrary((s) => s.myList);
  const progress = useLibrary((s) => s.progress);

  const progressMap: Record<string, number> = {};
  for (const [id, entry] of Object.entries(progress)) {
    if (entry.duration > 0) progressMap[id] = entry.position / entry.duration;
  }

  const continueWatching = titles.filter((t) => {
    const p = progressMap[t.id];
    return p && p > 0.03 && p < 0.95;
  });
  const list = titles.filter((t) => myList.includes(t.id));
  const trending = titles.filter((t) => t.trending);
  const originals = titles.filter((t) => t.original);
  const movies = titles.filter((t) => t.kind === "movie");
  const series = titles.filter((t) => t.kind === "series");
  const dramas = titles.filter((t) => t.kind === "drama");
  const horror = titles.filter((t) =>
    t.genres.some((g) => /horror|gothic|thriller/i.test(g)),
  );
  const animation = titles.filter((t) =>
    t.genres.some((g) => /animation|family/i.test(g)),
  );
  const coming = titles.filter((t) => t.comingSoon);
  const fresh = titles.filter((t) => t.isNew);

  return (
    <div className="relative z-10 -mt-16 flex flex-col gap-2 pb-10 sm:-mt-24">
      <TitleRow heading="Continue Watching" titles={continueWatching} progressMap={progressMap} />
      <TitleRow heading="My List" titles={list} progressMap={progressMap} />
      <TitleRow heading="Trending Now" titles={trending} progressMap={progressMap} />
      <TitleRow heading="Harry Originals" titles={originals} progressMap={progressMap} />
      <TitleRow heading="New on Harry Films" titles={fresh} progressMap={progressMap} />
      <TitleRow heading="Movies" titles={movies} progressMap={progressMap} />
      <TitleRow heading="Series" titles={series} progressMap={progressMap} />
      <TitleRow heading="Dramas" titles={dramas} progressMap={progressMap} />
      <TitleRow heading="Animation" titles={animation} progressMap={progressMap} />
      <TitleRow heading="Dark & Thrilling" titles={horror} progressMap={progressMap} />
      <TitleRow heading="Coming Soon" titles={coming} progressMap={progressMap} />
    </div>
  );
}

export function BrowseGrid({
  heading,
  kicker,
  titles,
}: {
  heading: string;
  kicker?: string;
  titles: Title[];
}) {
  const progress = useLibrary((s) => s.progress);
  const progressMap: Record<string, number> = {};
  for (const [id, entry] of Object.entries(progress)) {
    if (entry.duration > 0) progressMap[id] = entry.position / entry.duration;
  }

  return (
    <div className="px-4 pt-24 pb-16 sm:px-8">
      {kicker ? (
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{kicker}</p>
      ) : null}
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
        {heading}
      </h1>
      {titles.length === 0 ? (
        <p className="mt-8 text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {titles.map((title) => (
            <div key={title.id} className="min-w-0 [&_article]:w-full">
              <TitleCard title={title} progress={progressMap[title.id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
