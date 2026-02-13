import AuthShell from "@/components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your account email and we will send a reset link."
      footerText="Remembered your password?"
      footerLinkLabel="Sign in"
      footerLinkHref="/signin"
    >
      <label className="block text-sm font-semibold">
        Account email
        <input
          type="email"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--brand)]"
          placeholder="you@example.com"
        />
      </label>
      <button className="brand-button primary w-full">Send reset link</button>
    </AuthShell>
  );
}
