import { createHash, randomUUID } from "crypto";

export function createApplicationId(): string {
  return randomUUID();
}

/**
 * The signal is bound to a specific application challenge.
 *
 * It is NOT:
 * - constant
 * - zero
 * - supplied by the browser
 * - based on email
 * - based on wallet address
 */
export function createApplicationSignal(
  cycleId: string,
  challengeId: string
): string {
  return createHash("sha256")
    .update(`${cycleId}:${challengeId}`)
    .digest("hex");
}