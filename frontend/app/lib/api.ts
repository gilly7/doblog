import { getSession } from "next-auth/react";
import { apiUrl } from "../utils/env";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();

  const headers = new Headers(options.headers);
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "An error occurred");
  }

  return response.json();
}

export const login = async (username: string, password: string) => {
  return fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const register = async (username: string, password: string) => {
  return fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const verifyToken = async (token: string) => {
  return fetchWithAuth("/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArticles = async () => {
  return fetchWithAuth("/articles");
};

export const getArticle = async (id: string) => {
  return fetchWithAuth(`/articles/${id}`);
};

export const createArticle = async (data: {
  title: string;
  content: string;
  categoryId: string;
  published?: boolean;
}) => {
  return fetchWithAuth("/articles", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateArticle = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    categoryId?: string;
    published?: boolean;
  }
) => {
  return fetchWithAuth(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteArticle = async (id: string) => {
  return fetchWithAuth(`/articles/${id}`, {
    method: "DELETE",
  });
};

export const createComment = async (articleId: string, content: string) => {
  return fetchWithAuth(`/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = async (commentId: string) => {
  return fetchWithAuth(`/comments/${commentId}`, {
    method: "DELETE",
  });
};

export const createCategory = async (data: {
  name: string;
  description: string;
}) => {
  return fetchWithAuth("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCategories = async () => {
  return fetchWithAuth("/categories");
};

export const getCategory = async (id: string) => {
  return fetchWithAuth(`/categories/${id}`);
};
