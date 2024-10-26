import { Hono } from "hono";
import { validateSession } from "../middleware/auth";
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles";
import { createComment, deleteComment } from "../controllers/comments";

const router = new Hono();

// Public routes
router.get("/", getArticles);
router.get("/:id", getArticle);

// Protected routes
router.post("/", validateSession, createArticle);
router.put("/:id", validateSession, updateArticle);
router.delete("/:id", validateSession, deleteArticle);

// Comments
router.post("/:articleId/comments", validateSession, createComment);
router.delete("/comments/:id", validateSession, deleteComment);

export default router;
