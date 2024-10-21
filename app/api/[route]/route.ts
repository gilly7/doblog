import { Hono } from "hono";
import { handle } from "hono/vercel";
import prisma from "@/lib/prisma";
import { SignJWT, jwtVerify } from "jose";
import { cors } from "hono/cors";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST"],
  })
);

function encode(text: string) {
  return new TextEncoder().encode(text);
}

async function generateRandomSalt(length = 16) {
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const rawKey = await crypto.subtle.exportKey("raw", derivedKey);
  return Buffer.from(rawKey).toString("hex");
}

async function verifyPassword(password: string, hash: string, salt: string) {
  const hashedPassword = await hashPassword(password, salt);
  return hashedPassword === hash;
}

app.get("/healthz", (c) => {
  return c.text("Healthy");
});

app.post("/register", async (c) => {
  const { name, email, password } = await c.req.json();

  if (!name || !email || !password) {
    return c.json({ message: "User already exists" }, 400);
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return c.json({ message: "User already exists" }, 400);
    }

    const salt = await generateRandomSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, salt },
    });

    const token = await new SignJWT({ userId: newUser.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    return c.json({ token });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const isValidPassword = await verifyPassword(
      password,
      user.password,
      user.salt
    );
    if (!isValidPassword) {
      return c.json({ message: "Invalid password" }, 401);
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    return c.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

app.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ message: "No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const decoded = payload as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(user);
  } catch (error) {
    return c.json({ message: "Invalid token" }, 401);
  }
});

export const GET = handle(app);
export const POST = handle(app);
