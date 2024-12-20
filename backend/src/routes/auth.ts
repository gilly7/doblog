import { Hono } from "hono";
import { register, login, me, users, logout } from "../controllers/auth.js";
import { auth, validateSession } from "../middleware/auth.js";

const router = new Hono();

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, me);

router.delete("/logout", validateSession, logout);
router.get("/users", validateSession, users);

export default router;
