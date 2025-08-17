import { Hono } from "hono";
import { validateSession } from "../middleware/auth.js";
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle,
  getUserFavorites,
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
// --- FAVORITES FEATURE ---
router.post(":id/favorite", validateSession, favoriteArticle);
router.delete(":id/favorite", validateSession, unfavoriteArticle);
router.get("/favorites/me", validateSession, getUserFavorites);
// --- END FAVORITES FEATURE ---

export default router;
