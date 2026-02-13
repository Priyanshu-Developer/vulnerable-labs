import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-(--line) bg-[#fff8eb]">
      <div className="container-width grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-black" style={{ fontFamily: "var(--font-playfair)" }}>
            AURORA Market
          </p>
          <p className="mt-2 text-sm text-muted">Curated essentials, premium quality, delivery you can trust.</p>
        </div>
        <div>
          <p className="font-bold">Quick links</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/signin">Sign in</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Need help?</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <p>support@auroramarket.com</p>
            <p>Mon-Sat, 8:00 AM - 8:00 PM</p>
            <Link href="/forgot-password">Forgot password</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
