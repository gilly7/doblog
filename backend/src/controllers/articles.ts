import prisma from "../db/client";
import { ArticleInput, JWTPayload } from "../types/index";

export const createArticle = async (c) => {
  try {
    const payload = c.get("jwtPayload") as JWTPayload;
    const {
      title,
      content,
      published = true,
    }: ArticleInput = await c.req.json();

    const article = await prisma.article.create({
      data: {
        title,
        content,
        published,
        authorId: payload.userId,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return c.json(article);
  } catch (error: any) {
    console.log(`failed to create article: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const getArticles = async (c) => {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json(articles);
  } catch (error) {
    console.log(`failed to get articles: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const getArticle = async (c) => {
  try {
    const id = c.req.param("id");
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!article) {
      c.status(404);
      return c.json({ error: "Article not found" });
    }

    return c.json(article);
  } catch (error: any) {
    console.log(`failed to get article: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const updateArticle = async (c) => {
  try {
    const id = c.req.param("id");
    const payload = c.get("jwtPayload") as JWTPayload;
    const { title, content, published }: ArticleInput = await c.req.json();

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      c.status(404);
      return c.json({ error: "Article not found" });
    }

    if (article.authorId !== payload.userId) {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { title, content, published },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return c.json(updatedArticle);
  } catch (error: any) {
    console.log(`failed to update article: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const deleteArticle = async (c) => {
  try {
    const id = c.req.param("id");
    const payload = c.get("jwtPayload") as JWTPayload;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      c.status(404);
      return c.json({ error: "Article not found" });
    }

    if (article.authorId !== payload.userId) {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }

    await prisma.article.delete({
      where: { id },
    });

    return c.json({ message: "Article deleted successfully" });
  } catch (error: any) {
    console.log(`failed to delete article: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};
