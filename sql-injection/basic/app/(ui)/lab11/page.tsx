"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function Lab11Page() {
  const [idPayload, setIdPayload] = useState("1");
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [lastResponse, setLastResponse] = useState("No probe yet.");
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab11", { method: "POST" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }

        setDbMessage("Lab ready. Use conditional error payloads to extract flag characters.");
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const liveQuery = useMemo(
    () => `SELECT * FROM products WHERE id = ${idPayload};`,
    [idPayload],
  );

  const runProbe = async () => {
    try {
      const response = await fetch(`/api/lab11?id=${encodeURIComponent(idPayload)}`);
      const data = await response.json();

      setLastStatus(response.status);
      setLastResponse(`${data.status ?? "processed"} | ${data.message ?? "Request completed"}`);

      if (response.status >= 500) {
        setDbMessage("Error signal detected (FALSE/TRUE depends on your CASE logic).");
        return;
      }

      if (!response.ok) {
        setDbMessage(`Probe failed: ${data.error || "request error"}`);
        return;
      }

      setDbMessage("No SQL error triggered (use as opposite signal).");
    } catch {
      setLastStatus(null);
      setLastResponse("No response captured.");
      setDbMessage("Probe failed: request error.");
    }
  };

  const resetState = async () => {
    setIdPayload("1");
    setLastStatus(null);
    setLastResponse("No probe yet.");
    setDbMessage("Resetting lab state...");

    try {
      const response = await fetch("/api/lab11", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setDbMessage(`Reset failed: ${data.error || "unknown error"}`);
        return;
      }
      setDbMessage("Reset complete. Capture a baseline before testing conditions.");
    } catch {
      setDbMessage("Reset failed: request error.");
    }
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab11" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 11</p>
          <h1 className="lab-title">Conditional Error SQLi</h1>
          <p className="lab-subtitle">
            Mission: trigger database errors only when a condition matches, then infer flag characters
            from status differences. Use Burp Suite Intruder or automate with a script.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">Target: `/api/lab11?id=...`</CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Input
                variant="bordered"
                label="id payload"
                placeholder="1 AND (CASE WHEN ... THEN 1 ELSE 1/0 END)=1--"
                value={idPayload}
                onValueChange={setIdPayload}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />

              <div className="login-actions">
                <Button color="success" radius="sm" className="cta-primary" fullWidth onPress={runProbe}>
                  Run Probe
                </Button>
                <Button
                  variant="bordered"
                  radius="sm"
                  className="cta-secondary"
                  fullWidth
                  onPress={resetState}
                >
                  Reset Lab
                </Button>
              </div>

              <div className="w-full rounded-md border border-amber-300/40 bg-amber-950/30 px-3 py-2 text-sm font-medium text-amber-100 break-words min-h-12">
                <span className="block text-xs uppercase tracking-wide text-amber-300/80">
                  Probe Result
                </span>
                <span>{dbMessage}</span>
              </div>

              <div className="w-full rounded-md border border-emerald-300/35 bg-emerald-950/25 px-3 py-2 min-h-24">
                <span className="block text-xs uppercase tracking-wide text-emerald-300/80">
                  Last API Signal
                </span>
                <div className="mt-2 space-y-1 text-sm text-emerald-100">
                  <p>
                    <span className="text-emerald-300/85">status:</span>{" "}
                    {lastStatus === null ? "-" : String(lastStatus)}
                  </p>
                  <p>
                    <span className="text-emerald-300/85">body:</span> {lastResponse}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="query-card"
          >
            <p className="query-title">Conditional Error Flow</p>
            <p className="query-subtitle">
              Build a condition that returns cleanly for one branch and throws a DB error for the other.
              Use HTTP status as the extraction oracle.
            </p>

            <pre
              className="query-code"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              <code>{liveQuery}</code>
            </pre>

            <div className="query-hint-bulb" role="note" aria-label="payload hint">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="bulb-icon">
                <path
                  d="M12 3a7 7 0 0 0-4.74 12.15c.7.62 1.16 1.43 1.28 2.36L8.72 19h6.56l.18-1.49c.12-.93.58-1.74 1.28-2.36A7 7 0 0 0 12 3Zm-2.2 18h4.4m-3.8 0v-2m3.2 2v-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Example branch:
                <code>
                  {"1 AND (SELECT CASE WHEN substring((SELECT flag FROM flags LIMIT 1),1,1)='F' THEN 1 ELSE 1/0 END)=1--"}
                </code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
