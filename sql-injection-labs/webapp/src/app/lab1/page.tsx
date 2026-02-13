"use client";
import Link from "next/link";
import AuthShell from "@/components/auth-shell";
import { useState, type FormEventHandler } from "react";
import Greeting from "@/components/greeting";

export default function SignInMain() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [showBothQueries, setShowBothQueries] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const secureQuery = "SELECT * FROM users WHERE username = $1 AND password = $2";
  const secureParams = [username, password];
  const unsecureQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  const handleSignIn: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const endpoint = `/api/lab1/auth/${isSecureMode ? "secure" : "unsecure"}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 200 && isSecureMode === false) {
        const response2 = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lab_name: "lab1" }),
        });
        await response2.text();
        setStatusMessage(`${data.message}`);
        setOpenDialog(true);
        return;
      }
      setStatusMessage(data.message || data.error || "Request completed.");
    } catch {
      setStatusMessage("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your orders, wishlists, and account settings."
      footerText="Don't have an account?"
      footerLinkLabel="Create one"
      footerLinkHref="/signup"
    >
      <div className="relative mb-2 flex justify-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-2 py-1 text-xs font-bold">
          <span className={`${isSecureMode ? "text-(--brand)" : "text-muted"}`}>Secured</span>
          <button
            type="button"
            aria-label="Toggle secured and unsecured mode"
            aria-pressed={!isSecureMode}
            onClick={() => setIsSecureMode((prev) => !prev)}
            className={`relative h-6 w-11 rounded-full transition ${
              isSecureMode ? "bg-(--brand)" : "bg-amber-400"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                isSecureMode ? "left-0.5" : "left-[1.4rem]"
              }`}
            />
          </button>
          <span className={`${!isSecureMode ? "text-amber-700" : "text-muted"}`}>Unsecured</span>
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowBothQueries((prev) => !prev)}
          className="rounded-full border border-(--line) bg-white px-3 py-1 text-xs font-bold text-(--brand)"
        >
          {showBothQueries ? "Show active query only" : "Show both queries"}
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSignIn}>
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-(--line) bg-white px-3 py-2 outline-none focus:border-(--brand)"
            placeholder="you@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-(--line) bg-white px-3 py-2 outline-none focus:border-(--brand)"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="brand-button primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : `Sign in (${isSecureMode ? "Secured" : "Unsecured"})`}
        </button>
      </form>
      <section className="space-y-2 rounded-xl border border-(--line) bg-white p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-(--brand)">Realtime SQL Preview</p>
        {(showBothQueries || isSecureMode) && (
          <div className={`rounded-lg border px-3 py-2 ${isSecureMode ? "border-(--brand) bg-[#f3fbf9]" : "border-(--line)"}`}>
            <p className="mb-1 text-xs font-semibold text-(--brand)">Secured query</p>
            <code className="block whitespace-pre-wrap wrap-break-words text-xs">{secureQuery}</code>
            <p className="mt-2 text-xs text-muted">Params: [{secureParams.map((value) => `"${value}"`).join(", ")}]</p>
          </div>
        )}
        {(showBothQueries || !isSecureMode) && (
          <div className={`rounded-lg border px-3 py-2 ${!isSecureMode ? "border-amber-400 bg-amber-50" : "border-(--line)"}`}>
            <p className="mb-1 text-xs font-semibold text-amber-700">Unsecured query</p>
            <code className="block whitespace-pre-wrap wrap-break-words text-xs">{unsecureQuery}</code>
          </div>
        )}
      </section>
      {statusMessage && (
        <p className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm text-muted">
          {statusMessage}
        </p>
      )}
      <Link href="/forgot-password" className="block text-center text-sm font-semibold text-(--brand)">
        Forgot your password?
      </Link>
      <Greeting open={openDialog} onOpenChange={setOpenDialog} link={"/lab2"}/>
    </AuthShell>
  );
}
