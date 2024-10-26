import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/client.ts";
import { env } from "../config/env";

export const register = async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      c.status(400);
      return c.json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return c.json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.log(`failed to register: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const login = async (c) => {
  try {
    const { email, password } = await c.req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email }, env.JWT_SECRET);
    return c.json({ token, user });
  } catch (error: any) {
    console.error(`failed to log in: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const verify = async (c) => {
  const payload = c.get("jwtPayload");
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return c.json({
    message: "Token is valid",
    user,
  });
};
