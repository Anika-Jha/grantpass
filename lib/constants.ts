export const GRANT_CYCLE_ID = "vidarbha-2026";

export const GRANT_CYCLE = {
  id: GRANT_CYCLE_ID,
  name: "Vidarbha First-Generation Education Grant",
  description:
    "₹15,000 education support for first-generation college students across Vidarbha.",
  maxSlots: 60,
} as const;

/**
 * This value belongs to the application.
 *
 * It is intentionally NOT derived from:
 * - request body
 * - URL
 * - browser
 * - wallet
 * - session
 * - IP address
 */
export function getNullifierSeed(): number {
  const value = process.env.NULLIFIER_SEED;

  if (!value) {
    throw new Error("NULLIFIER_SEED is not configured.");
  }

  const seed = Number(value);

  if (!Number.isSafeInteger(seed) || seed <= 0) {
    throw new Error("NULLIFIER_SEED must be a positive safe integer.");
  }

  return seed;
}