import Link from "next/link";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              ₹15,000 education grant · Vidarbha
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
              Prove you're eligible.
              <span className="block text-indigo-400">
                Don't hand over your identity.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              GrantPass lets Kavita's education grant verify
              eligibility and prevent duplicate applications
              without collecting Aadhaar numbers, names,
              addresses, or photos.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="rounded-xl bg-indigo-500 px-6 py-4 text-center font-semibold transition hover:bg-indigo-400"
              >
                Check eligibility
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-center font-semibold text-slate-200 transition hover:bg-white/[0.07]"
              >
                Volunteer dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto grid max-w-6xl gap-px bg-white/5 md:grid-cols-3">
            {[
              {
                title: "Your Aadhaar stays private",
                text: "The QR is processed in the applicant flow. GrantPass never asks you to type or upload your Aadhaar number.",
              },
              {
                title: "Prove only what's needed",
                text: "The system verifies the cryptographic proof and required eligibility signal instead of collecting your identity.",
              },
              {
                title: "One person, one application",
                text: "A persistent nullifier lets the grant detect another application from the same person during the cycle.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-950 p-8"
              >
                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}