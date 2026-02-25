"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function Lab8Page() {
  const [idPayload, setIdPayload] = useState("1");
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [lastResponse, setLastResponse] = useState("No probe yet.");
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab8", { method: "POST" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }

        setDbMessage("Lab ready. Infer conditions by timing differences, not response content.");
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
      const start = performance.now();
      const response = await fetch(`/api/lab8?id=${encodeURIComponent(idPayload)}`);
      const duration = Math.round(performance.now() - start);
      const data = await response.json();

      setLastLatency(duration);
      setLastResponse(`${data.status ?? "processed"} | ${data.message ?? "Product request completed"}`);

      if (!response.ok) {
        setDbMessage(`Probe failed: ${data.error || "request error"} (${duration} ms)`);
        return;
      }

      setDbMessage(`Probe completed in ${duration} ms. Compare timings across payloads.`);
    } catch {
      setLastLatency(null);
      setLastResponse("No response captured.");
      setDbMessage("Probe failed: request error.");
    }
  };

  const resetState = () => {
    setIdPayload("1");
    setLastLatency(null);
    setLastResponse("No probe yet.");
    setDbMessage("Reset complete. Capture a baseline timing, then compare payload timings.");
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab8" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 8</p>
          <h1 className="lab-title">Time-Based Blind SQL Injection</h1>
          <p className="lab-subtitle">
            Mission: Use delay-based payloads to extract the flag from the `Flags` table.
            The endpoint always returns the same JSON, so timing is the signal. You should see a significant delay difference between TRUE and FALSE conditions.
            You should Use Burp Suite Intruder or a custom Python script To automate the extraction process.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">
              Target: Product Lookup Endpoint
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Input
                variant="bordered"
                label="id payload"
                placeholder="1 OR IF(1=1,SLEEP(2),0)"
                value={idPayload}
                onValueChange={setIdPayload}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />

              <div className="login-actions">
                <Button
                  color="success"
                  radius="sm"
                  className="cta-primary"
                  fullWidth
                  onPress={runProbe}
                >
                  Run Probe
                </Button>
                <Button
                  variant="bordered"
                  radius="sm"
                  className="cta-secondary"
                  fullWidth
                  onPress={resetState}
                >
                  Reset
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
                  Last API Response
                </span>
                <div className="mt-2 space-y-1 text-sm text-emerald-100">
                  <p>
                    <span className="text-emerald-300/85">body:</span> {lastResponse}
                  </p>
                  <p>
                    <span className="text-emerald-300/85">latency:</span>{" "}
                    {lastLatency === null ? "-" : `${lastLatency} ms`}
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
            <p className="query-title">Time-Based Extraction Flow</p>
            <p className="query-subtitle">
              API response body is intentionally constant. Use measured delay
              differences to evaluate TRUE/FALSE conditions.
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
                Example checks:{" "}
                <code>{"1 OR (SELECT CASE WHEN substring((SELECT flag FROM Flags LIMIT 1),1,1)='F' THEN pg_sleep(5) END) IS NULL--"}</code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
