import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  createTitle,
  listTitles,
  removeTitle,
  updateTitle,
} from "@/lib/catalog.functions";
import type { Title, TitleInput, TitleKind } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { clearAdminToken, getAdminToken } from "@/lib/library-store";

export const Route = createFileRoute("/admin/")({
  loader: () => listTitles(),
  component: AdminDesk,
});

const emptyForm: TitleInput = {
  name: "",
  synopsis: "",
  kind: "movie",
  genres: "Drama",
  year: new Date().getFullYear(),
  rating: "PG-13",
  durationMin: 90,
  seasons: 1,
  posterUrl: "/posters/odyssey.jpg",
  backdropUrl: "/backdrops/odyssey.jpg",
  videoUrl: "",
  featured: false,
  trending: false,
  isNew: true,
  comingSoon: false,
  original: true,
};

function toInput(t: Title): TitleInput {
  return {
    name: t.name,
    synopsis: t.synopsis,
    kind: t.kind,
    genres: t.genres.join(", "),
    year: t.year,
    rating: t.rating,
    durationMin: t.durationMin,
    seasons: t.seasons,
    posterUrl: t.posterUrl,
    backdropUrl: t.backdropUrl,
    videoUrl: t.videoUrl,
    featured: t.featured,
    trending: t.trending,
    isNew: t.isNew,
    comingSoon: t.comingSoon,
    original: t.original,
  };
}

function AdminDesk() {
  const titles = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<TitleInput>(emptyForm);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const token = useMemo(() => getAdminToken(), [editing, titles.length]);

  if (!token) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div>
          <p className="font-display text-3xl">Admin desk is locked</p>
          <p className="mt-2 text-muted">Sign in with the house credentials.</p>
          <Link
            to="/admin/login"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-accent px-5 font-semibold text-accent-fg"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  function startNew() {
    setForm(emptyForm);
    setEditing("new");
    setError("");
  }

  function startEdit(t: Title) {
    setForm(toInput(t));
    setEditing(t.id);
    setError("");
  }

  async function save() {
    if (!token) return;
    setPending(true);
    setError("");
    try {
      if (editing === "new") {
        await createTitle({ data: { token, title: form } });
      } else if (editing) {
        await updateTitle({ data: { token, id: editing, title: form } });
      }
      setEditing(null);
      await router.invalidate({ sync: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    if (!token) return;
    if (!window.confirm("Remove this title from the catalog?")) return;
    await removeTitle({ data: { token, id } });
    await router.invalidate({ sync: true });
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="flex items-center gap-4 border-b border-border px-4 py-4 sm:px-8">
        <Link to="/" className="font-display text-xl">
          Harry Films
        </Link>
        <span className="text-sm text-muted">Admin desk</span>
        <span className="ml-auto" />
        <Button
          variant="mute"
          size="sm"
          onClick={() => {
            clearAdminToken();
            void navigate({ to: "/admin/login" });
          }}
        >
          Sign out
        </Button>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Catalog</h1>
            <p className="mt-1 text-sm text-muted">
              {titles.length} titles · add a film or mark something as featured
            </p>
          </div>
          <Button variant="accent" onClick={startNew}>
            Add title
          </Button>
        </div>

        {editing ? (
          <form
            className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-5"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <p className="font-semibold">{editing === "new" ? "New title" : "Edit title"}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Kind">
                <select
                  className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
                  value={form.kind}
                  onChange={(e) =>
                    setForm({ ...form, kind: e.target.value as TitleKind })
                  }
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                  <option value="drama">Drama</option>
                </select>
              </Field>
            </div>
            <Field label="Synopsis">
              <Textarea
                required
                value={form.synopsis}
                onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Year">
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                />
              </Field>
              <Field label="Rating">
                <Input
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </Field>
              <Field label="Runtime (min)">
                <Input
                  type="number"
                  value={form.durationMin}
                  onChange={(e) =>
                    setForm({ ...form, durationMin: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            <Field label="Genres (comma separated)">
              <Input
                value={form.genres}
                onChange={(e) => setForm({ ...form, genres: e.target.value })}
              />
            </Field>
            <Field label="Poster URL">
              <Input
                value={form.posterUrl}
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
              />
            </Field>
            <Field label="Backdrop URL">
              <Input
                value={form.backdropUrl}
                onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
              />
            </Field>
            <Field label="Video URL (youtube:ID, YouTube link, or mp4)">
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </Field>
            <div className="flex flex-wrap gap-4 text-sm">
              {(
                [
                  ["featured", "Featured hero"],
                  ["trending", "Trending"],
                  ["isNew", "New"],
                  ["comingSoon", "Coming soon"],
                  ["original", "Harry original"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex h-11 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
            {error ? <p className="text-sm text-accent">{error}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" variant="accent" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {titles.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
              <img src={t.posterUrl} alt="" className="h-16 w-11 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{t.name}</p>
                <p className="text-xs text-muted">
                  {t.year} · {t.kind} · {t.comingSoon ? "coming soon" : "live"}
                </p>
              </div>
              <Button variant="mute" size="sm" onClick={() => startEdit(t)}>
                Edit
              </Button>
              <Button variant="mute" size="sm" onClick={() => void remove(t.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
