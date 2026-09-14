import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminToken } from "@/lib/library-store";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 text-fg no-underline">
      <span className="relative grid size-7 place-items-center rounded-sm bg-accent">
        <span className="ml-0.5 size-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-accent-fg" />
      </span>
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight sm:text-2xl",
          compact && "hidden sm:inline",
        )}
      >
        Harry Films
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/series", label: "Series" },
  { to: "/dramas", label: "Dramas" },
  { to: "/my-list", label: "My List" },
] as const;

export function AppShell({
  children,
  transparent = false,
}: {
  children: ReactNode;
  transparent?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(Boolean(getAdminToken()));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    void navigate({ to: "/search", search: { q } });
    setOpen(false);
  }

  const solid = !transparent || scrolled || open;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-200",
          solid
            ? "bg-bg/95 shadow-[0_1px_0_0] shadow-border/80 backdrop-blur-md"
            : "bg-gradient-to-b from-bg/80 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:h-[68px] sm:px-8">
          <Logo />
          <nav className="ml-4 hidden items-center gap-5 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-sm transition-colors duration-150",
                    active ? "font-semibold text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={submitSearch} className="hidden items-center sm:flex">
              <div
                className={cn(
                  "flex h-10 items-center overflow-hidden rounded-md border transition-[width,border-color,background-color] duration-200",
                  searchOpen
                    ? "w-52 border-border bg-elevated"
                    : "w-10 border-transparent bg-transparent",
                )}
              >
                <button
                  type="button"
                  aria-label="Search"
                  className="grid size-10 place-items-center text-fg"
                  onClick={() => setSearchOpen((v) => !v)}
                >
                  <Search className="size-5" />
                </button>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Titles, genres"
                  className={cn(
                    "h-10 bg-transparent text-sm text-fg outline-none placeholder:text-subtle",
                    searchOpen ? "w-full pr-3" : "w-0 p-0",
                  )}
                />
              </div>
            </form>
            <Link
              to={isAdmin ? "/admin" : "/admin/login"}
              className="hidden h-9 items-center rounded-md px-3 text-xs font-semibold uppercase tracking-wider text-muted hover:text-fg sm:inline-flex"
            >
              {isAdmin ? "Admin" : "Sign in"}
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md text-fg md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border bg-bg px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-md px-2 text-base text-fg"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to={isAdmin ? "/admin" : "/admin/login"}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center rounded-md px-2 text-base text-muted"
              >
                {isAdmin ? "Admin desk" : "Admin sign in"}
              </Link>
            </nav>
            <form onSubmit={submitSearch} className="mt-3 flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles"
                className="h-11 flex-1 rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none"
              />
              <button
                type="submit"
                className="grid size-11 place-items-center rounded-md bg-elevated"
                aria-label="Search"
              >
                <Search className="size-4" />
              </button>
            </form>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border px-6 py-10 text-sm text-subtle">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo compact />
            <p className="mt-3 max-w-md text-pretty">
              The latest movies, series, and dramas — official trailers and
              coming-soon premieres, in a cinematic house.
            </p>
          </div>
          <p>Harry Films · Watch something unforgettable</p>
        </div>
      </footer>
    </div>
  );
}
