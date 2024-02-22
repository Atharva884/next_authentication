import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.redirect(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/admin") {
          return token?.user.role == "admin";
        }

        if (req.nextUrl.pathname === "/protected/client") {
          return token?.user.role == "user";
        }

        return Boolean(token);
      },
    },
  }
);

export const config = { matcher: ["/admin", "/profile", "/protected/:path*"] };
