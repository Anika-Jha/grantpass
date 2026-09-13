export interface VerifiedEligibility {
    isAdult: boolean;
  }
  
  /**
   * Eligibility MUST be derived from verified proof outputs.
   *
   * No application form field is allowed to decide eligibility.
   */
  export function evaluateEligibility(
    proofOutputs: Record<string, unknown>
  ): VerifiedEligibility {
    const possibleAgeSignals = [
      proofOutputs.ageAbove18,
      proofOutputs.isAbove18,
      proofOutputs.ageOver18,
    ];
  
    const isAdult = possibleAgeSignals.some(
      (value) => value === true || value === "true" || value === 1
    );
  
    return {
      isAdult,
    };
  }