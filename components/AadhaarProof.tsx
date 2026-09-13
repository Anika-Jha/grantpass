"use client";

import {
  LaunchProveModal,
  useAnonAadhaar,
} from "@anon-aadhaar/react";

interface AadhaarProofProps {
  signal: string;
  onProofReady: (proof: string) => void;
}

export function AadhaarProof({
  signal,
  onProofReady,
}: AadhaarProofProps) {
  const [anonAadhaar] = useAnonAadhaar();

  const status = anonAadhaar.status;

  if (
    status === "logged-in" &&
    anonAadhaar.serializedAnonAadhaarProof
  ) {
    onProofReady(
      anonAadhaar.serializedAnonAadhaarProof
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            ZK
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Prove your eligibility privately
            </h3>

            <p className="text-sm text-slate-400">
              Your Aadhaar QR is processed on your device.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex gap-3">
            <span className="text-emerald-400">✓</span>
            <span>Valid government-signed Aadhaar</span>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-400">✓</span>
            <span>Adult eligibility</span>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-400">✓</span>
            <span>One application per person</span>
          </div>

          <div className="flex gap-3">
            <span className="text-emerald-400">✓</span>
            <span>No Aadhaar number shared with GrantPass</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        {status !== "logged-in" ? (
          <LaunchProveModal
            signal={signal}
            nullifierSeed={2026091301}
            buttonTitle="Verify privately"
            buttonStyle={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: "12px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          />
        ) : (
          <div className="text-center">
            <div className="mb-3 text-emerald-400">
              ✓ Proof generated
            </div>

            <p className="text-sm text-slate-400">
              Your zero-knowledge proof is ready for
              verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}