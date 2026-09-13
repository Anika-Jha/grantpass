export function isSafeProofPayload(
    body: unknown
  ): body is {
    challengeId: string;
    proof: string;
  } {
    if (!body || typeof body !== "object") {
      return false;
    }
  
    const value = body as Record<string, unknown>;
  
    return (
      typeof value.challengeId === "string" &&
      value.challengeId.length >= 10 &&
      value.challengeId.length <= 100 &&
      typeof value.proof === "string" &&
      value.proof.length > 0 &&
      value.proof.length < 2_000_000
    );
  }