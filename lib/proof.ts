import {
    AnonAadhaarCorePackage,
  } from "@anon-aadhaar/core";
  
  export interface VerifiedProof {
    valid: boolean;
    nullifier: string;
    signal: string;
    outputs: Record<string, unknown>;
  }
  
  /**
   * The serialized proof is the ONLY Aadhaar-derived value accepted
   * by the application server.
   *
   * Raw QR data is deliberately not accepted here.
   */
  export async function verifyAnonAadhaarProof(
    serializedProof: string
  ): Promise<VerifiedProof> {
    if (!serializedProof || typeof serializedProof !== "string") {
      throw new Error("Missing serialized proof.");
    }
  
    let proof;
  
    try {
      proof =
        await AnonAadhaarCorePackage.deserialize(
          serializedProof
        );
    } catch {
      throw new Error("Invalid proof encoding.");
    }
  
    const valid =
      await AnonAadhaarCorePackage.verify(proof);
  
    if (!valid) {
      throw new Error("Zero-knowledge proof verification failed.");
    }
  
    /*
     * Anon Aadhaar proof objects contain the cryptographic claim.
     * We intentionally do not accept a client-supplied `valid` flag.
     *
     * The exact claim structure is normalized here so the rest of
     * the application never deals with raw PCD internals.
     */
  
    const claim = (proof as any).claim ?? proof;
  
    const nullifier =
      String(
        claim.nullifier ??
        claim.identityNullifier ??
        claim.publicSignals?.nullifier ??
        ""
      );
  
    const signal =
      String(
        claim.signal ??
        claim.publicSignals?.signal ??
        ""
      );
  
    const outputs =
      (claim.revealedFields ??
        claim.fields ??
        claim.publicSignals ??
        {}) as Record<string, unknown>;
  
    if (!nullifier) {
      throw new Error("Proof did not contain a nullifier.");
    }
  
    if (!signal) {
      throw new Error("Proof did not contain an application signal.");
    }
  
    return {
      valid: true,
      nullifier,
      signal,
      outputs,
    };
  }