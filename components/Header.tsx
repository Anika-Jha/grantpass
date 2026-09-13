import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Grant<span className="text-indigo-400">Pass</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link
            href="/apply"
            className="transition hover:text-white"
          >
            Apply
          </Link>

          <Link
            href="/dashboard"
            className="transition hover:text-white"
          >
            Volunteer view
          </Link>
        </nav>
      </div>
    </header>
  );
}