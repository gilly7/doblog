import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/articles.js";
import categoryRoutes from "./routes/categories.js";
import { auth } from "./middleware/auth.js";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
const app = new Hono();
app.use("*", logger());
app.use("*", cors());
app.route("/auth", authRoutes);
app.route("/articles", articleRoutes);
app.route("/categories", categoryRoutes);
app.get("/protected", auth, (c) => {
    const user = c.get("jwtPayload");
    return c.json({
        message: "This is a protected route",
        user,
    });
});
app.get("/", (c) => {
    return c.json({ mssage: "Buckle up and let’s make some magic happen! ✨!" });
});
app.get("/healthz", (c) => {
    return c.json({ message: "Healthy!" });
});
const port = 7069;
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port,
});
