import { SignJWT, jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-fallback-secret-change-in-prod");

const COOKIE_NAME = "ps"; // pillcare session
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export { COOKIE_NAME, COOKIE_MAX_AGE };

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string }> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { userId: string; email: string };
}
