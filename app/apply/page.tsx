import { Header } from "@/components/Header";
import { ApplicationFlow } from "@/components/ApplicationFlow";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            Privacy-first application
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Apply without handing over your Aadhaar.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Prove that you are a real adult and haven't
            already applied this cycle. That's all GrantPass
            needs to know.
          </p>
        </div>

        <ApplicationFlow />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            [
              "01",
              "Aadhaar stays local",
              "Your QR is processed on your device.",
            ],
            [
              "02",
              "Only proof leaves",
              "The server receives a zero-knowledge proof.",
            ],
            [
              "03",
              "One person, one claim",
              "A cryptographic nullifier prevents duplicates.",
            ],
          ].map(
            ([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="mb-3 text-xs font-semibold text-indigo-400">
                  {number}
                </div>

                <h3 className="font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}