import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-(--line) bg-[#fffdf8]/90 backdrop-blur">
      <div className="container-width flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-black tracking-tight text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-(--brand)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            SQL Injection Labs
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link href="/" className="hover:text-(--brand) transition">
            Home
          </Link>
          <Link href="/#labs" className="hover:text-(--brand) transition">
            Labs
          </Link>
          <Link href="/#about" className="hover:text-(--brand) transition">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/#labs" className="brand-button primary text-sm">
            Start Training
          </Link>
        </div>
      </div>
    </header>
  );
}
