import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Title, TitleInput, TitleKind } from "@/lib/types";

const kindSchema = z.enum(["movie", "series", "drama"]);

const titleInputSchema = z.object({
  name: z.string().min(1).max(120),
  synopsis: z.string().min(1).max(2000),
  kind: kindSchema,
  genres: z.string().min(1).max(200),
  year: z.number().int().min(1888).max(2100),
  rating: z.string().min(1).max(16),
  durationMin: z.number().int().min(1).max(600),
  seasons: z.number().int().min(1).max(40),
  posterUrl: z.string().max(500),
  backdropUrl: z.string().max(500),
  videoUrl: z.string().max(1000),
  featured: z.boolean(),
  trending: z.boolean(),
  isNew: z.boolean(),
  comingSoon: z.boolean(),
  original: z.boolean(),
});

export const listTitles = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchTitles } = await import("./catalog.server");
  return fetchTitles();
});

export const getTitle = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<Title | null> => {
    const { fetchTitle } = await import("./catalog.server");
    return fetchTitle(data.id);
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const { checkAdminCredentials, signAdminToken } = await import("./catalog.server");
    if (!checkAdminCredentials(data.username, data.password)) {
      throw new Error("Invalid admin credentials");
    }
    const token = await signAdminToken();
    return { token };
  });

export const createTitle = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), title: titleInputSchema }))
  .handler(async ({ data }) => {
    const { verifyAdminToken, createTitleRow } = await import("./catalog.server");
    await verifyAdminToken(data.token);
    return createTitleRow(data.title as TitleInput);
  });

export const updateTitle = createServerFn({ method: "POST" })
  .validator(
    z.object({ token: z.string(), id: z.string().min(1), title: titleInputSchema }),
  )
  .handler(async ({ data }) => {
    const { verifyAdminToken, updateTitleRow } = await import("./catalog.server");
    await verifyAdminToken(data.token);
    const next = await updateTitleRow(data.id, data.title as TitleInput);
    if (!next) throw new Error("Title not found");
    return next;
  });

export const removeTitle = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { verifyAdminToken, deleteTitleRow } = await import("./catalog.server");
    await verifyAdminToken(data.token);
    await deleteTitleRow(data.id);
    return { ok: true };
  });

export type { TitleKind };
