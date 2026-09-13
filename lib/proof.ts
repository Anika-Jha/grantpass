import { AnonAadhaarCorePackage } from "@anon-aadhaar/core";

export interface VerifiedProof {
  valid: true;
  nullifier: string;
  nullifierSeed: string;
  signal: string;
  outputs: {
    ageAbove18: boolean;
    gender: string;
    pincode: string;
    state: string;
    timestamp: string;
    pubkeyHash: string;
  };
}

export async function verifyAnonAadhaarProof(
  serializedProof: string
): Promise<VerifiedProof> {
  if (!serializedProof || typeof serializedProof !== "string") {
    throw new Error("Missing serialized proof.");
  }

  let proof: any;

  try {
    proof = await AnonAadhaarCorePackage.deserialize(serializedProof);
  } catch {
    throw new Error("Invalid proof encoding.");
  }

  const valid = await AnonAadhaarCorePackage.verify(proof);

  if (!valid) {
    throw new Error("Zero-knowledge proof verification failed.");
  }

  const claim = proof.claim;

  if (!claim) {
    throw new Error("Verified proof contains no claim.");
  }

  const publicSignals = claim.publicSignals;

  if (!Array.isArray(publicSignals) || publicSignals.length < 7) {
    throw new Error("Verified proof has an invalid public signal set.");
  }

  const nullifier = String(publicSignals[1]);
  const timestamp = String(publicSignals[2]);

  const ageAbove18 =
    publicSignals[3] === true ||
    publicSignals[3] === 1 ||
    publicSignals[3] === "1" ||
    publicSignals[3] === "true";

  const gender = String(publicSignals[4]);
  const pincode = String(publicSignals[5]);
  const state = String(publicSignals[6]);
  const pubkeyHash = String(publicSignals[0]);

  const nullifierSeed = String(proof.proof?.nullifierSeed ?? "");

  if (!nullifier) {
    throw new Error("Proof did not contain a nullifier.");
  }

  if (!nullifierSeed) {
    throw new Error("Proof did not contain a nullifier seed.");
  }

  const signal = String(
    claim.signal ??
      proof.proof?.signal ??
      claim.publicSignals?.[7] ??
      ""
  );

  if (!signal) {
    throw new Error("Proof did not contain an application signal.");
  }

  return {
    valid: true,
    nullifier,
    nullifierSeed,
    signal,
    outputs: {
      ageAbove18,
      gender,
      pincode,
      state,
      timestamp,
      pubkeyHash,
    },
  };
}