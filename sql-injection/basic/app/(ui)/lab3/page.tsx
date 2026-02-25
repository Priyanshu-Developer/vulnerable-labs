"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Chip, cn, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface SearchRow {
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

export default function Lab3Page() {
  const [searchTerm, setSearchTerm] = useState<string>(Category.Electronics);
  const [rows, setRows] = useState<SearchRow[]>([]);
  const [dbMessage, setDbMessage] = useState("Challenge bootstrapping...");
  const [flagLeak, setFlagLeak] = useState("");
  const [flag, setFlag] = useState("");

  const liveQuery = useMemo(
    () =>
      `SELECT * FROM products WHERE category = '${searchTerm}'`,
    [searchTerm],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/lab3/flag", { method: "POST" });
        const data = await response.json();
        if (response.ok && data.success) {
          setDbMessage(
            "Challenge initialized. Start injecting through search.",
          );
        } else {
          setDbMessage(`Init failed: ${data.error || "unknown error"}`);
        }
      } catch {
        setDbMessage("Init failed: request error.");
      }
    };

    init();
  }, []);

  const runSearch = async () => {
    try {
      const response = await fetch(
        `/api/lab3?category=${encodeURIComponent(searchTerm)}`,
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        setDbMessage(`Error: ${data.error || "Failed to execute search."}`);
        setRows([]);
        return;
      }

      const nextRows = Array.isArray(data) ? data : [];
      setRows(nextRows);
      setDbMessage(data.message || "Search executed.");

      const leaked = nextRows
        .flatMap((row: SearchRow) => Object.values(row))
        .find(
          (value: string | number | null) =>
            typeof value === "string" && value.startsWith("FLAG-"),
        );

      if (typeof leaked === "string") {
        setFlagLeak(leaked);
      }
    } catch {
      setDbMessage("Error: request failed.");
      setRows([]);
    }
  };

  return (
    <main className="lab-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <FlagInput
        flag={flag}
        setFlag={setFlag}
        nextLabLink="lab4"
        labid="lab3"
      />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 3</p>
          <h1 className="lab-title">UNION Based SQL Injection</h1>
          <p className="lab-subtitle">
            Mission: Exploit UNION injection to extract the flag. Schema and column
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
              Target: Product Search Service
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <div className=" flex flex-row flex-wrap gap-1">
                {Object.values(Category).map((cat) => (
                  <Chip
                    key={cat}
                    variant="bordered"
                    onClick={() => {
                      setSearchTerm(cat);
                    }}
                    classNames={{
                      base: cn(
                        "cursor-pointer text-green-400/80 border-green-500/30 hover:bg-green-500/10",
                        searchTerm === cat &&
                          "bg-green-500/20 border-green-400/50",
                      ),
                    }}
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
              <Input
                variant="bordered"
                label="Search Input"
                placeholder="e.g. Electronics"
                value={searchTerm}
                onValueChange={setSearchTerm}
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
                  onPress={runSearch}
                >
                  Execute Search Payload
                </Button>
                <Button
                  variant="bordered"
                  radius="sm"
                  className="cta-secondary"
                  fullWidth
                  onPress={() => {
                   
                    setFlagLeak("");
                    setDbMessage(
                      "Challenge reset. Inject through search input.",
                    );
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="w-full rounded-md border border-amber-300/40 bg-amber-950/30 px-3 py-2 text-sm font-medium text-amber-100 break-words min-h-12">
                <span className="block text-xs uppercase tracking-wide text-amber-300/80">
                  Database Response
                </span>
                <span>{dbMessage}</span>
              </div>

              <div className="w-full rounded-md border border-emerald-300/35 bg-emerald-950/25 px-3 py-2 min-h-24">
                <span className="block text-xs uppercase tracking-wide text-emerald-300/80">
                  Search Results
                </span>
                {rows.length === 0 ? (
                  <p className="mt-2 text-sm font-medium text-emerald-100">
                    No results to display.
                  </p>
                ) : (
                  rows.map((row, idx) => (
                    <div
                      key={idx}
                      className="mt-2 p-2 bg-emerald-900/30 rounded-md"
                    >
                      {Object.entries(row).map(([key, value]) => (
                        <p key={key} className="text-sm text-emerald-100">
                          <span className="text-emerald-300/85">{key}:</span>{" "}
                          {value}
                        </p>
                      ))}
                    </div>
                  ))
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
            <p className="query-title">Attack Plan</p>
            <p className="query-subtitle">
              Search filters are query fragments. Abuse UNION shape
              compatibility.
            </p>

            <pre
              className="query-code"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              <code>{liveQuery}</code>
            </pre>

            <div
              className="query-hint-bulb"
              role="note"
              aria-label="payload hint"
            >
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
                Suggested payload:{" "}
                <code>
                  {"x%' UNION SELECT id,flag,0 FROM flags --"}
                </code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
