import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/** Generate a cryptographically secure random token */
const generateToken = () => randomBytes(32).toString("hex");

/** Hash a token with SHA-256 for secure DB storage */
const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

/**
 * Create a verification token for a given identifier.
 * Deletes any existing tokens for the same identifier first (single-use).
 * Returns the raw (unhashed) token to be sent via email.
 */
export const createVerificationToken = async (identifier: string) => {
  // Clean up old tokens for this identifier
  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashedToken,
      expires: new Date(Date.now() + TOKEN_EXPIRY_MS),
    },
  });

  return rawToken;
};

/**
 * Verify a token against the DB.
 * Checks expiry, deletes on use (single-use), returns true if valid.
 */
export const verifyToken = async (identifier: string, rawToken: string) => {
  const hashedToken = hashToken(rawToken);

  const storedToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token: hashedToken,
      },
    },
  });

  if (!storedToken) {
    return { valid: false, error: "Invalid token" as const };
  }

  // Delete the token regardless (single-use)
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token: hashedToken,
      },
    },
  });

  if (storedToken.expires < new Date()) {
    return { valid: false, error: "Token expired" as const };
  }

  return { valid: true, error: null };
};
