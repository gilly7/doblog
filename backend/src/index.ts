import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello From Do Blog" });
});

const port = 7069;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
