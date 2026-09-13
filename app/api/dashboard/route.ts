import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  GRANT_CYCLE_ID,
  GRANT_CYCLE,
} from "@/lib/constants";

export async function GET() {
  const [
    total,
    pending,
    eligible,
  ] = await Promise.all([
    db.application.count({
      where: {
        cycleId: GRANT_CYCLE_ID,
      },
    }),

    db.application.count({
      where: {
        cycleId: GRANT_CYCLE_ID,
        status: "PENDING_REVIEW",
      },
    }),

    db.application.count({
      where: {
        cycleId: GRANT_CYCLE_ID,
        eligible: true,
      },
    }),
  ]);

  return NextResponse.json({
    cycle: {
      id: GRANT_CYCLE.id,
      name: GRANT_CYCLE.name,
      maxSlots: GRANT_CYCLE.maxSlots,
    },
    stats: {
      verified: eligible,
      pendingReview: pending,
      duplicatesPrevented: 0,
      slotsRemaining: Math.max(
        GRANT_CYCLE.maxSlots - total,
        0
      ),
    },
  });
}