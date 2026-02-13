import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <main className="auth-bg">
      <section className="surface w-full max-w-md p-8">
        <Link href="/" className="text-xs font-semibold text-muted">
          Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-black" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-6 space-y-4">{children}</div>
        <p className="mt-6 text-sm text-muted">
          {footerText} <Link href={footerLinkHref} className="font-bold text-(--brand)">{footerLinkLabel}</Link>
        </p>
      </section>
    </main>
  );
}
