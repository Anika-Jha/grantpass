"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AadhaarProof } from "./AadhaarProof";
import { StepIndicator } from "./StepIndicator";

type Challenge = {
  challengeId: string;
  signal: string;
  expiresAt: string;
};

export function ApplicationFlow() {
  const router = useRouter();

  const [challenge, setChallenge] =
    useState<Challenge | null>(null);

  const [proof, setProof] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function createChallenge() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await fetch("/api/challenge", {
          method: "POST",
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Could not start application."
        );
      }

      setChallenge(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    createChallenge();
  }, []);

  async function submitApplication() {
    if (!challenge || !proof) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response =
        await fetch("/api/application", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            challengeId:
              challenge.challengeId,

            proof,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        if (data.reason === "DUPLICATE") {
          throw new Error(
            "This person has already applied during this grant cycle."
          );
        }

        if (data.reason === "INELIGIBLE") {
          throw new Error(
            "The verified proof does not satisfy the adult eligibility requirement."
          );
        }

        throw new Error(
          data.error ??
            "Application verification failed."
        );
      }

      router.push(
        `/success?id=${encodeURIComponent(
          data.applicationId
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

        <p className="text-slate-400">
          Preparing your private application...
        </p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="mb-5 text-red-300">
          {error ??
            "Unable to start an application."}
        </p>

        <button
          onClick={createChallenge}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator
        current={proof ? 2 : 1}
      />

      {!proof ? (
        <AadhaarProof
          signal={challenge.signal}
          onProofReady={setProof}
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-2 text-emerald-400">
              ✓ Eligibility proof ready
            </div>

            <h2 className="text-xl font-semibold text-white">
              Your Aadhaar stayed private
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              GrantPass received a cryptographic proof,
              not your Aadhaar number or identity details.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 font-semibold text-white">
              Ready to submit?
            </h3>

            <p className="mb-6 text-sm leading-6 text-slate-400">
              The server will verify your proof, check
              whether this person has already applied
              this cycle, and then record the application.
            </p>

            <button
              disabled={submitting}
              onClick={submitApplication}
              className="w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Verifying application..."
                : "Submit application"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}