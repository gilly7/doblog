import { Hono } from "hono";
import { validateSession } from "../middleware/auth.js";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.js";

const router = new Hono();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", validateSession, createCategory);
router.put("/:id", validateSession, updateCategory);
router.delete("/:id", validateSession, deleteCategory);

export default router;
