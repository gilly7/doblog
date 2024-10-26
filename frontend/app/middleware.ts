import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.ENV === "stage" || process.env.ENV === "prod"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  const isAuthenticated = !!token;

  const isPublicPage =
    req.nextUrl.pathname.startsWith("/auth") || req.nextUrl.pathname === "/";
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dash");

  if (isAuthenticated && isPublicPage) {
    return NextResponse.redirect(new URL("/dash", req.url));
  }

  if (!isAuthenticated && isDashboardPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dash/:path*"],
};
