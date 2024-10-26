import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { auth } from "./middleware/auth";

const app = new Hono();

app.route("/auth", authRoutes);

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
