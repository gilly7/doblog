import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { auth } from "./middleware/auth.js";
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/auth", authRoutes);
app.route("/articles", articleRoutes);
app.route("/categories", categoryRoutes);

app.get("/protected", auth, (c: Context) => {
  const user = c.get("jwtPayload");
  return c.json({
    message: "This is a protected route",
    user,
  });
});

app.get("/", (c: Context) => {
  return c.json({
    mssage: "Buckle up and let's make some magic happen, DuBlog! ✨!",
  });
});

app.get("/healthz", (c: Context) => {
  return c.json({ message: "Healthy!", app: "backend", env: env.ENV });
});

const port = Number(env.PORT);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
