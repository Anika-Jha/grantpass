import Link from "next/link";
import { Header } from "@/components/Header";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-2xl text-emerald-400">
            ✓
          </div>

          <h1 className="text-3xl font-bold">
            Application received.
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
            Your eligibility was verified without sharing
            your Aadhaar number with the grant office.
          </p>

          {params.id && (
            <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Application reference
              </div>

              <div className="mt-2 break-all font-mono text-sm text-slate-300">
                {params.id}
              </div>
            </div>
          )}

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-slate-950"
          >
            Back to GrantPass
          </Link>
        </div>
      </main>
    </div>
  );
}