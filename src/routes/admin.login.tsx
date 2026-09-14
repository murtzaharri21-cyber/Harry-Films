import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { adminLogin } from "@/lib/catalog.functions";
import { setAdminToken } from "@/lib/library-store";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const { token } = await adminLogin({ data: { username, password } });
      setAdminToken(token);
      await navigate({ to: "/admin" });
    } catch {
      setError("Those credentials do not match.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
        <Link to="/" className="font-display text-2xl text-fg">
          Harry Films
        </Link>
        <h1 className="mt-6 text-xl font-semibold">Admin desk</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to add, feature, or retire titles.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit" variant="accent" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <div className="mt-6 rounded-md bg-elevated px-3 py-3 text-xs text-muted">
          <p className="font-semibold text-fg">Demo credentials</p>
          <p className="mt-1">
            Username <span className="text-fg">admin</span>
            <span className="mx-2">·</span>
            Password <span className="text-fg">velora2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
