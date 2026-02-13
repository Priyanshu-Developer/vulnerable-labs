import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-(--line) bg-[#fffdf8]/90 backdrop-blur">
      <div className="container-width flex items-center justify-between py-4">
        <Link href="/" className="font-black tracking-tight text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
          AURORA Market
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/signin">Sign in</Link>
          <Link href="/signup">Create account</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/signin" className="brand-button secondary text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="brand-button primary text-sm">
            Start shopping
          </Link>
        </div>
      </div>
    </header>
  );
}
