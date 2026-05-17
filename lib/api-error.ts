import { NextResponse } from "next/server";

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function validateUserId(userId: string | null): string | null {
  if (!userId || typeof userId !== "string") return null;
  if (userId.length > 50) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) return null;
  return userId;
}

export function sanitizeString(str: unknown, maxLen = 200): string | null {
  if (typeof str !== "string") return null;
  const trimmed = str.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}
