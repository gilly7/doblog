import { jwt } from "hono/jwt";
import { env } from "../config/env";

export const auth = jwt({
  secret: env.JWT_SECRET,
});
