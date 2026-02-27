"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface ProductRow {
  id?: number;
  name?: string;
  category?: string;
  price?: string | number;
}

export default function Lab9Page() {
  const [idPayload, setIdPayload] = useState("1");
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [result, setResult] = useState<ProductRow | null>(null);
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab9", { method: "POST" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }

        setDbMessage("Lab ready. Intercept requests and inject through the session cookie.");
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const liveQuery = useMemo(
    () => `SELECT * FROM sessions WHERE cookie='${"session_cookie"}';`,
    [],
  );

  const runProbe = async () => {
    try {
      const response = await fetch(`/api/lab9?id=${encodeURIComponent(idPayload)}`);
      const data = await response.json();

      if (!response.ok) {
        setResult(null);
        setDbMessage(`Probe failed: ${data.error || "request error"}`);
        return;
      }

      setResult(data.product || null);
      setDbMessage(
        data.product
          ? "Probe returned product data (session check evaluated TRUE)."
          : "Probe returned generic response (likely FALSE/error condition).",
      );
    } catch {
      setResult(null);
      setDbMessage("Probe failed: request error.");
    }
  };

  const resetState = async () => {
    setIdPayload("1");
    setResult(null);
    setDbMessage("Resetting lab and issuing a fresh session cookie...");

    try {
      const response = await fetch("/api/lab9", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setDbMessage(`Reset failed: ${data.error || "unknown error"}`);
        return;
      }
      setDbMessage("Reset complete. Start from a clean session and continue probing.");
    } catch {
      setDbMessage("Reset failed: request error.");
    }
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab9" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 9</p>
          <h1 className="lab-title">Blind SQL Injection via Cookies</h1>
          <p className="lab-subtitle">
            Mission: extract the flag by injecting payloads into the `session` cookie. Use Burp Suite
            Repeater/Intruder or an automated script to test TRUE/FALSE conditions and reconstruct the value.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">Target: `/api/lab9?id=...`</CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Input
                variant="bordered"
                label="id parameter"
                placeholder="1"
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
                  Send Request
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
                  Response Signal
                </span>
                {result ? (
                  <div className="mt-2 space-y-1 text-sm text-emerald-100">
                    <p>
                      <span className="text-emerald-300/85">id:</span> {String(result.id ?? "-")}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">name:</span> {String(result.name ?? "-")}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">category:</span> {String(result.category ?? "-")}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">price:</span> {String(result.price ?? "-")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-emerald-100/80">
                    No product returned. Compare this against injected cookie conditions.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="query-card"
          >
            <p className="query-title">Cookie Injection Workflow</p>
            <p className="query-subtitle">
              Intercept the request and modify the `session` cookie value. The backend builds SQL directly
              from that cookie.
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
                Example Boolean test:
                <code>
                  {" ' OR substring((SELECT flag FROM flags LIMIT 1),1,1)='F'-- "}
                </code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
