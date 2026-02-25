"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Chip, cn, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface MetadataRow {
  [key: string]: string | number | null;
}

enum Category {
  Electronics = "Electronics",
  Books = "Books",
  Clothing = "Clothing",
  Home = "Home",
  Sports = "Sports",
  Toys = "Toys",
}

export default function Lab4Page() {
  const [category, setCategory] = useState(Category.Electronics);
  const [payload, setPayload] = useState("");
  const [columnCount, setColumnCount] = useState("");
  const [dbMessage, setDbMessage] = useState("Start with ORDER BY probes to map column count.");
  const [rows, setRows] = useState<MetadataRow[]>([]);
  const [flagOutput, setFlagOutput] = useState("");
  const [flag, setFlag] = useState("");

  const liveInput = payload || category;
  const liveQuery = useMemo(
    () => `SELECT * FROM products WHERE category = '${liveInput}'`,
    [liveInput],
  );

  const runProbe = async () => {
    try {
      const response = await fetch(`/api/lab4?category=${encodeURIComponent(liveInput)}`);
      const data = await response.json();

      if (!response.ok) {
        setDbMessage(`Error: ${data.error || "Probe failed."}`);
        setRows([]);
        return;
      }

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setDbMessage(data.message || "Probe executed.");
    } catch {
      setDbMessage("Error: request failed.");
      setRows([]);
    }
  };

  const submitColumnCount = async () => {
    try {
      const response = await fetch("/api/lab4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnCount: Number(columnCount || 0) }),
      });
      const data = await response.json();

      if (!response.ok) {
        setDbMessage(`Error: ${data.error || "Invalid submission."}`);
        return;
      }

      setFlagOutput(data.flag || "");
      setDbMessage("Column count verified. Mission token generated.");
    } catch {
      setDbMessage("Error: request failed.");
    }
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput flag={flag} setFlag={setFlag} nextLabLink="/" labid="lab5" />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 4</p>
          <h1 className="lab-title">Finding Number of Columns</h1>
          <p className="lab-subtitle">
            Mission: Use ORDER BY injection to determine the number of columns in the query. Then submit that number to receive the mission token.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="lab-main-grid"
        >
          <Card className="login-card">
            <CardHeader className="login-card-head">Target: Product Search Service</CardHeader>
            <CardBody className="flex flex-col gap-6">
              <div className="flex flex-row gap-2 flex-wrap">
                {Object.values(Category).map((cat) => (
                  <Chip
                    key={cat}
                    variant="bordered"
                    onClick={() => {
                      setPayload(cat)
                    }}
                    classNames={{
                      base: cn(
                        "cursor-pointer text-green-400/80 border-green-500/30 hover:bg-green-500/10",
                        category === cat && "bg-green-500/20 border-green-400/50",
                      ),
                    }}
                  >
                    {cat}
                  </Chip>
                ))}
              </div>

              <Input
                variant="bordered"
                label="Injected Category Payload"
                placeholder="Electronics' ORDER BY 1 --"
                value={payload}
                onValueChange={setPayload}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />

              <Input
                variant="bordered"
                label="Discovered Column Count"
                placeholder="Enter discovered count"
                value={columnCount}
                onValueChange={setColumnCount}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
                endContent={
                  <Button size="sm" variant="light" className="text-xs text-amber-50" onPress={submitColumnCount}>
                    Submit Count
                  </Button>
                }
              />

              <div className="login-actions">
                <Button color="success" radius="sm" className="cta-primary" fullWidth onPress={runProbe}>
                  Run Query
                </Button>
                <Button
                  variant="bordered"
                  radius="sm"
                  className="cta-secondary"
                  fullWidth
                  onPress={() => {
                    setCategory(Category.Electronics);
                    setPayload("Electronics' ORDER BY 1 --");
                    setColumnCount("");
                    setRows([]);
                    setFlagOutput("");
                    setDbMessage("Payload reset. Increment ORDER BY index until behavior changes.");
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="w-full rounded-md border border-amber-300/40 bg-amber-950/30 px-3 py-2 text-sm font-medium text-amber-100 break-words min-h-12">
                <span className="block text-xs uppercase tracking-wide text-amber-300/80">Database Response</span>
                <span>{dbMessage}</span>
              </div>
              <div className="w-full rounded-md border border-cyan-300/35 bg-cyan-950/20 px-3 py-2 min-h-20">
                <span className="block text-xs uppercase tracking-wide text-cyan-300/80">Mission Token</span>
                <p className="mt-2 text-sm text-cyan-100 break-words">{flagOutput || "Token appears after correct column-count submission."}</p>
              </div>
            </CardBody>
          </Card>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="query-card"
          >
            <p className="query-title">Attack Plan</p>
            <p className="query-subtitle">Map query shape first. Exfiltration comes after column compatibility is known.</p>

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
                Suggested payload chain: <code>{"Electronics' ORDER BY 1 --"}</code> then increase index.
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
