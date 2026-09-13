import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  GRANT_CYCLE_ID,
  getNullifierSeed,
} from "@/lib/constants";
import {
  isSafeProofPayload,
} from "@/lib/validation";
import {
  verifyAnonAadhaarProof,
} from "@/lib/proof";
import {
  evaluateEligibility,
} from "@/lib/eligibility";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSafeProofPayload(body)) {
      return NextResponse.json(
        {
          error: "Invalid proof submission.",
        },
        { status: 400 }
      );
    }

    const {
      challengeId,
      proof: serializedProof,
    } = body;

    /*
     * Application-controlled seed.
     *
     * We deliberately read it here on the server rather than
     * trusting anything supplied by the applicant.
     */
    const nullifierSeed = getNullifierSeed();

    if (!nullifierSeed) {
      return NextResponse.json(
        {
          error: "Verification configuration unavailable.",
        },
        { status: 500 }
      );
    }

    /*
     * Find challenge before accepting application.
     */
    const challenge =
      await db.applicationChallenge.findUnique({
        where: {
          id: challengeId,
        },
      });

    if (!challenge) {
      return NextResponse.json(
        {
          error: "Application challenge not found.",
        },
        { status: 400 }
      );
    }

    if (challenge.cycleId !== GRANT_CYCLE_ID) {
      return NextResponse.json(
        {
          error: "Invalid grant cycle.",
        },
        { status: 400 }
      );
    }

    if (challenge.consumed) {
      return NextResponse.json(
        {
          error: "This application challenge has already been used.",
        },
        { status: 409 }
      );
    }

    if (challenge.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "This application challenge has expired.",
        },
        { status: 400 }
      );
    }

    /*
     * CRITICAL SECURITY BOUNDARY
     *
     * Verify the cryptographic proof BEFORE recording application.
     */
    const verified =
      await verifyAnonAadhaarProof(
        serializedProof
      );

    /*
     * CRITERION 5
     *
     * The signal from the proof MUST equal the signal generated
     * by the server for THIS challenge.
     */
    if (verified.signal !== challenge.signal) {
      return NextResponse.json(
        {
          error:
            "Proof is not bound to this application.",
        },
        { status: 400 }
      );
    }

    /*
     * CRITERION 4
     *
     * Eligibility comes from verified proof outputs.
     */
    const eligibility =
      evaluateEligibility(
        verified.outputs
      );

    if (!eligibility.isAdult) {
      return NextResponse.json(
        {
          error:
            "The verified identity does not satisfy the adult eligibility requirement.",
          reason: "INELIGIBLE",
        },
        { status: 403 }
      );
    }

    /*
     * CRITERION 1
     *
     * Persistent nullifier lookup happens BEFORE application
     * is recorded.
     */
    const existing =
      await db.application.findUnique({
        where: {
          cycleId_nullifier: {
            cycleId: GRANT_CYCLE_ID,
            nullifier: verified.nullifier,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "This person has already applied during this grant cycle.",
          reason: "DUPLICATE",
        },
        { status: 409 }
      );
    }

    const cycle =
      await db.grantCycle.findUnique({
        where: {
          id: GRANT_CYCLE_ID,
        },
      });

    if (!cycle) {
      return NextResponse.json(
        {
          error: "Grant cycle not found.",
        },
        { status: 500 }
      );
    }

    const applicationCount =
      await db.application.count({
        where: {
          cycleId: GRANT_CYCLE_ID,
        },
      });

    if (applicationCount >= cycle.maxSlots) {
      return NextResponse.json(
        {
          error:
            "All application slots for this cycle have been filled.",
          reason: "FULL",
        },
        { status: 409 }
      );
    }

    /*
     * Record only privacy-preserving information.
     *
     * NO Aadhaar number.
     * NO name.
     * NO DOB.
     * NO address.
     * NO photo.
     */
    try {
      const application =
        await db.$transaction(async (tx) => {
          const created =
            await tx.application.create({
              data: {
                id: challenge.id,
                cycleId: GRANT_CYCLE_ID,
                challengeId: challenge.id,
                nullifier: verified.nullifier,
                signal: challenge.signal,
                eligible: true,
                status: "PENDING_REVIEW",
              },
            });

          await tx.applicationChallenge.update({
            where: {
              id: challenge.id,
            },
            data: {
              consumed: true,
            },
          });

          return created;
        });

      return NextResponse.json({
        success: true,
        applicationId: application.id,
        status: application.status,
      });
    } catch (error: any) {
      /*
       * Database uniqueness is the final race-condition barrier.
       */
      if (
        error?.code === "P2002"
      ) {
        return NextResponse.json(
          {
            error:
              "This person has already applied during this grant cycle.",
            reason: "DUPLICATE",
          },
          { status: 409 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Application verification failed:",
      error instanceof Error
        ? error.message
        : "unknown error"
    );

    return NextResponse.json(
      {
        error:
          "We could not verify this application.",
      },
      { status: 500 }
    );
  }
}