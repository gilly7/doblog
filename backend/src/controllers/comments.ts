import { Context } from "hono";
import prisma from "../db/client.js";
import { CommentInput, JWTPayload } from "../types/index.js";

export const createComment = async (c: Context) => {
  try {
    const articleId = c.req.param("articleId");
    const payload = c.get("jwtPayload") as JWTPayload;
    const { content }: CommentInput = await c.req.json();

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      c.status(404);
      return c.json({ error: "Article not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId: payload.userId,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return c.json(comment);
  } catch (error: any) {
    console.log(`failed to create comment: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};

export const deleteComment = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const payload = c.get("jwtPayload") as JWTPayload;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      c.status(404);
      return c.json({ error: "Comment not found" });
    }

    if (comment.authorId !== payload.userId) {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return c.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    console.log(`failed to delete comment: ${error.message}`);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
};
