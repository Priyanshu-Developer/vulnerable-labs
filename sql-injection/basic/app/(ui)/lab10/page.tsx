"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type HeaderTarget = "user-agent" | "referer" | "x-lab-probe";

interface ProductRow {
  id?: number;
  name?: string;
  category?: string;
  price?: string | number;
}

export default function Lab10Page() {
  const [idPayload, setIdPayload] = useState("1");
  const [headerTarget, setHeaderTarget] = useState<HeaderTarget>("user-agent");
  const [headerPayload, setHeaderPayload] = useState("baseline-value");
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [result, setResult] = useState<ProductRow | null>(null);
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab10", { method: "POST" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }

        setDbMessage("Lab ready. Inject through User-Agent, Referer, or X-Lab-Probe.");
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const runProbe = async () => {
    try {
      const headers = new Headers();
      headers.set(headerTarget, headerPayload);

      const response = await fetch(`/api/lab10?id=${encodeURIComponent(idPayload)}`, {
        method: "GET",
        headers,
      });
      const data = await response.json();

      if (!response.ok) {
        setResult(null);
        setDbMessage(`Probe failed: ${data.error || "request error"}`);
        return;
      }

      setResult(data.product || null);
      setDbMessage(
        data.product
          ? "TRUE signal: product returned."
          : "FALSE signal: generic response only.",
      );
    } catch {
      setResult(null);
      setDbMessage("Probe failed: request error.");
    }
  };

  const resetState = async () => {
    setIdPayload("1");
    setHeaderPayload("baseline-value");
    setResult(null);
    setDbMessage("Resetting lab state...");

    try {
      const response = await fetch("/api/lab10", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setDbMessage(`Reset failed: ${data.error || "unknown error"}`);
        return;
      }
      setDbMessage("Reset complete. Continue with new header payload probes.");
    } catch {
      setDbMessage("Reset failed: request error.");
    }
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/lab11" labid="lab10" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 10</p>
          <h1 className="lab-title">Blind SQLi in HTTP Headers</h1>
          <p className="lab-subtitle">
            Mission: exploit SQL injection through HTTP headers. Attack `User-Agent`, `Referer`,
            or `X-Lab-Probe` and use boolean response differences to extract the flag.
            Automate using Burp Suite Intruder or your own extraction script.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">Target: `/api/lab10?id=...`</CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Select
                label="header target"
                selectedKeys={[headerTarget]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (typeof selected === "string") {
                    setHeaderTarget(selected as HeaderTarget);
                  }
                }}
                classNames={{
                  trigger: "lab-input-wrap",
                  label: "lab-input-label",
                }}
              >
                <SelectItem key="user-agent">User-Agent</SelectItem>
                <SelectItem key="referer">Referer</SelectItem>
                <SelectItem key="x-lab-probe">X-Lab-Probe (custom)</SelectItem>
              </Select>

              <input
                className="lab-input-wrap lab-input rounded-lg px-3 py-2"
                value={headerPayload}
                onChange={(event) => setHeaderPayload(event.target.value)}
                placeholder="' OR substring((SELECT flag FROM flags LIMIT 1),1,1)='F'--"
              />

              <input
                className="lab-input-wrap lab-input rounded-lg px-3 py-2"
                value={idPayload}
                onChange={(event) => setIdPayload(event.target.value)}
                placeholder="1"
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
                    Generic response only. Compare TRUE/FALSE payload outcomes.
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
            <p className="query-title">Header Attack Flow</p>
            <p className="query-subtitle">
              Intercept request headers in Burp and inject into User-Agent/Referer/custom header.
              Signal is product returned (TRUE) vs generic response (FALSE).
            </p>

            <pre
              className="query-code"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              <code>{"SELECT * FROM sessions WHERE cookie='<header-value>';"}</code>
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
                Example check:
                <code>{" ' OR substring((SELECT flag FROM flags LIMIT 1),1,1)='F'-- "}</code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
