import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/client";
import { env } from "../config/env";
import { JWTPayload } from "../types/index";

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

    const token = jwt.sign(
      { userId: user.id, email } as JWTPayload,
      env.JWT_SECRET
    );

    const expiresAt = new Date(Date.now() + env.SESSION_DURATION);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return c.json({ token, user });
  } catch (error: any) {
    console.error(`failed to log in: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const me = async (c) => {
  const payload = c.get("jwtPayload") as JWTPayload;
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return c.json({
    user,
  });
};

export const logout = async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];

    if (token) {
      await prisma.session.delete({
        where: { token },
      });
    }

    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const users = async (c) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return c.json({
    users,
  });
};
