import { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "./auth";

export async function getSessionUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}
