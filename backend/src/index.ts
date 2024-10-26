import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth";
import articleRoutes from "./routes/articles";
import { auth } from "./middleware/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/auth", authRoutes);
app.route("/articles", articleRoutes);

app.get("/protected", auth, (c) => {
  const user = c.get("jwtPayload");
  return c.json({
    message: "This is a protected route",
    user,
  });
});

app.get("/", (c) => {
  return c.text("Hello from DuBlog!");
});

app.get("/healthz", (c) => {
  return c.text("Healthy!");
});

const port = 7069;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
