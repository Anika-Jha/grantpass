import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  GRANT_CYCLE_ID,
} from "@/lib/constants";
import {
  createApplicationId,
  createApplicationSignal,
} from "@/lib/signal";

export async function POST() {
  const cycle = await db.grantCycle.findUnique({
    where: {
      id: GRANT_CYCLE_ID,
    },
  });

  if (!cycle || !cycle.active) {
    return NextResponse.json(
      {
        error: "This grant cycle is not accepting applications.",
      },
      { status: 400 }
    );
  }

  const applicationId = createApplicationId();

  const signal = createApplicationSignal(
    GRANT_CYCLE_ID,
    applicationId
  );

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  const challenge =
    await db.applicationChallenge.create({
      data: {
        id: applicationId,
        cycleId: GRANT_CYCLE_ID,
        signal,
        expiresAt,
      },
    });

  return NextResponse.json({
    challengeId: challenge.id,
    signal: challenge.signal,
    expiresAt: challenge.expiresAt,
  });
}