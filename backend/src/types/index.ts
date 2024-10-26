export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
}

export interface ArticleInput {
  title: string;
  content: string;
  published?: boolean;
}

export interface CommentInput {
  content: string;
}
