import { Hono } from "hono";
import { register, login, verify } from "../controllers/auth";
import { auth } from "../middleware/auth";

const router = new Hono();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", auth, verify);

export default router;
