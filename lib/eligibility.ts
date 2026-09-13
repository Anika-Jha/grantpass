export interface VerifiedEligibility {
  isAdult: boolean;
}

export function evaluateEligibility(
  proofOutputs: Record<string, unknown>
): VerifiedEligibility {
  return {
    isAdult: proofOutputs.ageAbove18 === true,
  };
}