"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface ProductRow {
  id?: number;
  name?: string;
  price?: string | number;
  stock?: string | number;
  category?: string;
}

export default function Lab7Page() {
  const [productId, setProductId] = useState("1");
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [result, setResult] = useState<ProductRow | null>(null);
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab7", { method: "POST" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }

        setDbMessage("Lab ready. Infer true/false conditions from response behavior.");
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const liveQuery = useMemo(
    () => `SELECT * FROM products WHERE id = ${productId}`,
    [productId],
  );

  const runProbe = async () => {
    try {
      const response = await fetch(
        `/api/lab7?productId=${encodeURIComponent(productId)}`,
      );
      const data = await response.json();

      if (response.status === 404) {
        setResult(null);
        setDbMessage("Condition evaluated FALSE (no matching row).");
        return;
      }

      if (!response.ok) {
        setResult(null);
        setDbMessage(`Probe failed: ${data.error || "request error"}`);
        return;
      }

      setResult(data.product || null);
      setDbMessage("Condition evaluated TRUE (row returned).");
    } catch {
      setResult(null);
      setDbMessage("Probe failed: request error.");
    }
  };

  const resetState = () => {
    setProductId("1");
    setResult(null);
    setDbMessage("Reset complete. Run a baseline request, then compare payload outcomes.");
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab7" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 7</p>
          <h1 className="lab-title">Blind SQL Injection</h1>
          <p className="lab-subtitle">
            Mission: Use boolean-based payloads to extract the flag from the `Flags` table. 
            Automate the process using Burp Suite Intruder or a custom Python script.
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
                label="productId payload"
                placeholder="1 AND 1=1"
                value={productId}
                onValueChange={setProductId}
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
                  Returned Row
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
                      <span className="text-emerald-300/85">price:</span> {String(result.price ?? "-")}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">stock:</span> {String(result.stock ?? "-")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-emerald-100/80">
                    No row displayed. Compare TRUE/FALSE payload responses.
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
            <p className="query-title">Blind Extraction Flow</p>
            <p className="query-subtitle">
              API returns either a row (TRUE) or not found (FALSE). Use this
              signal to extract hidden values one condition at a time.
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
                Example checks: <code>{"1 AND substring((SELECT flag FROM flags LIMIT 1),1,1)='F'"}</code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
