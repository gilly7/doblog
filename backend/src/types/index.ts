import type { JWTPayload as HonoJWTPayload } from "hono/dist/types/utils/jwt/types";

export interface JWTPayload extends HonoJWTPayload {
  userId: string;
  email: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface JWTPayload extends HonoJWTPayload {
  userId: string;
  email: string;
}

export interface ArticleInput {
  title: string;
  content: string;
  categoryId: string;
  published?: boolean;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface CommentInput {
  content: string;
}
