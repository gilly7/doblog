import { jwt, verify } from "hono/jwt";
import { env } from "../config/env.js";
import prisma from "../db/client.js";
export const auth = jwt({
    secret: env.JWT_SECRET,
});
export const validateSession = async (c, next) => {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }
    try {
        const payload = (await verify(token, env.JWT_SECRET));
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!session || session.expiresAt < new Date()) {
            c.status(401);
            return c.json({ error: "Session expired" });
        }
        c.set("user", session.user);
        c.set("jwtPayload", payload);
        await next();
    }
    catch (error) {
        console.log(`failed to validate session: ${error.message}`);
        c.status(401);
        return c.json({ error: "Invalid token" });
    }
};
