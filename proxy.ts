import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "./lib/auth";

// ---------------------------------------------------------------------------
// In-memory rate-limit store: IP → { count, windowStart }
// Simple sliding-window: 60 requests per 60 000 ms per IP
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false; // not limited
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return true; // limited
  }

  return false;
}

// ---------------------------------------------------------------------------
// CSP
// ---------------------------------------------------------------------------
const CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com data:; " +
  "img-src 'self' data: blob: https:; " +
  "connect-src 'self' wss: https:; " +
  "worker-src 'self' blob:; " +
  "manifest-src 'self'; " +
  "frame-ancestors 'none'";

// ---------------------------------------------------------------------------
// Protected and auth-only routes
// ---------------------------------------------------------------------------
const PROTECTED = ["/dashboard", "/medications", "/calendar", "/history", "/settings"];
const AUTH_PAGES = ["/login", "/register"];

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------
export async function proxy(request: NextRequest) {
  const { pathname, method } = Object.assign(request.nextUrl, {
    method: request.method,
  });
  const isProduction = process.env.NODE_ENV === "production";

  // ---- Auth guard for protected routes ------------------------------------
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      await verifyToken(token);
    } catch {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // ---- Redirect already-logged-in users away from auth pages -------------
  if (AUTH_PAGES.some((p) => pathname === p)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {}
    }
  }

  // ---- Rate limiting for /api/* routes ------------------------------------
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (rateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }

    // ---- Block non-JSON content-type on mutating requests -----------------
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        return new NextResponse(
          JSON.stringify({ error: "Unsupported Media Type" }),
          {
            status: 415,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  }

  // ---- Build response with security headers --------------------------------
  const response = NextResponse.next();
  const headers = response.headers;

  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()"
  );
  headers.set("Content-Security-Policy", CSP);

  if (isProduction) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

// ---------------------------------------------------------------------------
// Matcher — skip static assets and PWA files
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icons/|sw\\.js|workbox|manifest\\.json).*)",
  ],
};
