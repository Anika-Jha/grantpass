"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";

type DashboardData = {
  cycle: {
    name: string;
    maxSlots: number;
  };

  stats: {
    verified: number;
    pendingReview: number;
    duplicatesPrevented: number;
    slotsRemaining: number;
  };
};

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-indigo-400">
            Volunteer view
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Grant applications
          </h1>

          <p className="mt-2 text-slate-500">
            Review application status without collecting
            applicant identity data.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <div className="flex gap-4">
            <div className="text-emerald-400">🔒</div>

            <div>
              <h2 className="font-semibold text-white">
                Privacy boundary
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                This dashboard intentionally does not display
                names, Aadhaar numbers, addresses, phone
                numbers, photographs, or other identity data.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Verified",
              data?.stats.verified ?? "—",
            ],
            [
              "Pending review",
              data?.stats.pendingReview ?? "—",
            ],
            [
              "Duplicates prevented",
              data?.stats.duplicatesPrevented ?? "—",
            ],
            [
              "Slots remaining",
              data?.stats.slotsRemaining ?? "—",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm text-slate-500">
                {label}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold">
            What remains to review
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            GrantPass verifies the identity proof and
            duplicate status automatically. Volunteers only
            need to review eligible application entries
            according to the grant's selection process.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-slate-500">
              Application review records are privacy-preserving.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}