import AuthShell from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Join AURORA Market for exclusive offers and faster checkout."
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/signin"
    >
      <label className="block text-sm font-semibold">
        Full name
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-(--line) bg-white px-3 py-2 outline-none focus:border-(--brand)"
          placeholder="Jane Doe"
        />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input
          type="email"
          className="mt-1 w-full rounded-xl border border-(--line) bg-white px-3 py-2 outline-none focus:border-(--brand)"
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-(--line) bg-white px-3 py-2 outline-none focus:border-(--brand)"
          placeholder="Create a secure password"
        />
      </label>
      <button className="brand-button primary w-full">Create account</button>
    </AuthShell>
  );
}
