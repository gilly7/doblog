import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/healthz", (c) => {
  return c.text("Healthy");
});

export const GET = handle(app);
