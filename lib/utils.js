import { jwtVerify } from "jose";

export async function verifyToken(token) {
  try {
    if (!token) return null;

    const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const verified = await jwtVerify(token, encodedKey);

    return verified.payload && verified.payload?.issuer;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
