"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Chip, cn, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type LabMode = "string" | "numeric";

interface ResultRow {
  [key: string]: string | number | boolean | null;
}

const modeDefaults: Record<LabMode, string> = {
  string: "alice",
  numeric: "1",
};

export default function Lab6Page() {
  const [mode, setMode] = useState<LabMode>("string");
  const [input, setInput] = useState(modeDefaults.string);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [dbMessage, setDbMessage] = useState("Initializing lab...");
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab6", { method: "POST" });
        const data = await response.json();
        if (!response.ok) {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
          return;
        }
        setDbMessage("Lab ready. Compare payload behavior in string vs numeric contexts.");
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const liveQuery = useMemo(() => {
    if (mode === "string") {
      return `SELECT id, username, role FROM lab6_users WHERE username = '${input}'`;
    }
    return `SELECT id, username, role FROM lab6_users WHERE id = ${input}`;
  }, [mode, input]);

  const runPayload = async () => {
    try {
      const response = await fetch(
        `/api/lab6?mode=${encodeURIComponent(mode)}&input=${encodeURIComponent(input)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setDbMessage(`Error: ${data.error || "Execution failed."}`);
        setRows(Array.isArray(data.rows) ? data.rows : []);
        return;
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setDbMessage(data.message || "Payload executed.");
    } catch {
      setDbMessage("Error: request failed.");
      setRows([]);
    }
  };

  const resetState = () => {
    setMode("string");
    setInput(modeDefaults.string);
    setRows([]);
    setDbMessage("Reset complete. Start again with baseline payloads.");
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab6" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 6</p>
          <h1 className="lab-title">String vs Numeric Injection</h1>
          <p className="lab-subtitle">
            Mission: Understand how payload syntax changes between quoted string filters and raw numeric filters, then extract the flag.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">Target: Access Control Lookup</CardHeader>
            <CardBody className="flex flex-col gap-6">
              <div className="flex flex-row gap-2 flex-wrap">
                {(["string", "numeric"] as LabMode[]).map((item) => (
                  <Chip
                    key={item}
                    variant="bordered"
                    onClick={() => {
                      setMode(item);
                      setInput(modeDefaults[item]);
                      setRows([]);
                    }}
                    classNames={{
                      base: cn(
                        "cursor-pointer capitalize text-green-400/80 border-green-500/30 hover:bg-green-500/10",
                        mode === item && "bg-green-500/20 border-green-400/50",
                      ),
                    }}
                  >
                    {item} mode
                  </Chip>
                ))}
              </div>

              <Input
                variant="bordered"
                label={mode === "string" ? "username payload (string context)" : "id payload (numeric context)"}
                placeholder={mode === "string" ? "alice' OR '1'='1' --" : "1 OR 1=1 --"}
                value={input}
                onValueChange={setInput}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />

              <div className="login-actions">
                <Button color="success" radius="sm" className="cta-primary" fullWidth onPress={runPayload}>
                  Run Payload
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
                <span className="block text-xs uppercase tracking-wide text-amber-300/80">Database Response</span>
                <span>{dbMessage}</span>
              </div>

              <div className="w-full rounded-md border border-emerald-300/35 bg-emerald-950/25 px-3 py-2 min-h-24">
                <span className="block text-xs uppercase tracking-wide text-emerald-300/80">Result Rows</span>
                {rows.length > 0 ? (
                  <div className="mt-2 space-y-2 text-sm text-emerald-100">
                    {rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="rounded border border-emerald-400/20 px-2 py-1">
                        <p className="text-xs uppercase tracking-wide text-emerald-300/80">Row {rowIndex + 1}</p>
                        {Object.entries(row).map(([key, value]) => (
                          <p key={key} className="break-words">
                            <span className="text-emerald-300/85">{key}:</span>{" "}
                            {value === null ? "null" : String(value)}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-emerald-100/80">Rows will appear here after payload execution.</p>
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
            <p className="query-title">Context Comparison</p>
            <p className="query-subtitle">
              String context requires quote breaking. Numeric context does not use quotes.
            </p>

            <pre className="query-code">
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
                Try both styles:
                <code>{" alice' OR '1'='1' -- "}</code>
                and
                <code>{" 1 OR 1=1 -- "}</code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
