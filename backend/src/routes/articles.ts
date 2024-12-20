import { Hono } from "hono";
import { validateSession } from "../middleware/auth.js";
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.js";
import { createComment, deleteComment } from "../controllers/comments.js";

const router = new Hono();

router.get("/", getArticles);
router.get("/:id", getArticle);

router.post("/", validateSession, createArticle);
router.put("/:id", validateSession, updateArticle);
router.delete("/:id", validateSession, deleteArticle);

router.post("/:articleId/comments", validateSession, createComment);
router.delete("/comments/:id", validateSession, deleteComment);

export default router;
