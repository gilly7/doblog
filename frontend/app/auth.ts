import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { signInSchema } from "@/lib/zod";
import { ZodError } from "zod";

class InvalidLoginError extends CredentialsSignin {
  code = "login response not Ok";
}

const isDev = process.env.ENV === "local" || process.env.ENV === "dev";
const isLive = process.env.ENV === "stage" || process.env.ENV === "prod";

export const authOptions: NextAuthConfig = {
  debug: isDev,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email 1" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password 1",
        },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const { user, error, token } = await response.json();

          if (!response.ok || !user) {
            throw new InvalidLoginError(error);
          }

          return {
            ...user,
            accessToken: token,
          };
        } catch (error: any) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        delete user.accessToken;
        token.user = user;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  cookies: {
    sessionToken: {
      name: isLive
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isLive,
      },
    },
  },
};

export default NextAuth(authOptions);

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
