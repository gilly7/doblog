import { Context } from "hono";
import prisma from "../db/client.js";
import { CategoryInput } from "../types/index.js";

export const createCategory = async (c: Context) => {
  try {
    const { name, description }: CategoryInput = await c.req.json();

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      c.status(400);
      return c.json({ error: "Category name already exists" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return c.json(category);
  } catch (error: any) {
    console.log(`failed to create a category: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const getCategories = async (c: Context) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return c.json(categories);
  } catch (error: any) {
    console.log(`failed to get categories: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const getCategory = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        articles: {
          where: { published: true },
          include: {
            author: {
              select: { id: true, name: true },
            },
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });

    if (!category) {
      c.status(404);
      return c.json({ error: "Category not found" });
    }

    return c.json(category);
  } catch (error: any) {
    console.log(`failed to get category: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const updateCategory = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { name, description }: CategoryInput = await c.req.json();

    const existingCategory = await prisma.category.findUnique({
      where: { name, NOT: { id } },
    });

    if (existingCategory) {
      c.status(400);
      return c.json({ error: "Category name already exists" });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });

    return c.json(category);
  } catch (error: any) {
    console.log(`failed to update category: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      c.status(404);
      return c.json({ error: "Category not found" });
    }

    if (category._count.articles > 0) {
      c.status(400);
      return c.json({ error: "Cannot delete category with existing articles" });
    }

    await prisma.category.delete({
      where: { id },
    });

    return c.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.log(`failed to delete category: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};
