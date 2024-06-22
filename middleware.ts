import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader == null) return false;

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  return (
    username === process.env.ADMIN_USERRNAME &&
    (await isValidPassword(
      password,
      process.env.HASHED_ADMIN_PASSWORD as string
    ))
  );
}

export const config = {
  matcher: "/admin/:path*",
};
