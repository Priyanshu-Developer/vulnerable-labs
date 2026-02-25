"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function Lab2Page() {
  const [productId, setProductId] = useState("1");
  const [dbMessage, setDbMessage] = useState(
    "Run payload to inspect DB error feedback.",
  );
  const [result, setResult] = useState<{
    name: string;
    price: string;
    stock: string;
  } | null>(null);
  const [resultError, setResultError] = useState("");
  const [flag, setFlag] = useState("");

  const liveQuery = useMemo(
    () => `SELECT * FROM products WHERE id = '${productId}'`,
    [productId],
  );

  const runPayload = async () => {
    try {
      const res = await fetch(`/api/lab2?id=${encodeURIComponent(productId)}`);
      const data = await res.json();
      console.log("API Response:", data);
      if (data.error) {
        setDbMessage(`Error: ${data.error}`);
        setResult(null);
        setResultError(data.flag ? `Flag: ${data.flag}` : "No flag returned.");
      } else if (data.product) {
        setDbMessage("Product retrieved successfully.");
        setResult(data.product);
        setResultError("");
      } else {
        setDbMessage("No product found with the given ID.");
        setResult(null);
        setResultError("");
      }
    } catch (error) {
      setDbMessage("An error occurred while fetching the product.");
      setResult(null);
      setResultError(error instanceof Error ? error.message : "Unknown error");
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
        nextLabLink="lab3"
        labid="lab2"
      />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 2</p>
          <h1 className="lab-title">Error-Based SQL Injection</h1>
          <p className="lab-subtitle">
            Input crafted product IDs to trigger database errors and extract
            hidden flag information from error messages.
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
              URL Parameter Probe
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Input
                variant="bordered"
                label="id (URL Param)"
                placeholder="1"
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
                  onPress={runPayload}
                >
                  Run Payload
                </Button>
                <Button
                  variant="bordered"
                  radius="sm"
                  className="cta-secondary"
                  fullWidth
                  onPress={() => {
                    setProductId("1");
                    setDbMessage("Run payload to inspect DB error feedback.");
                    setResult(null);
                    setResultError("");
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
                  Result
                </span>
                {resultError ? (
                  <p className="mt-2 text-sm font-medium text-red-300 break-words">
                    {resultError}
                  </p>
                ) : result ? (
                  <div className="mt-2 space-y-1 text-sm text-emerald-100">
                    <p>
                      <span className="text-emerald-300/85">Name:</span>{" "}
                      {result.name}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">Price:</span>{" "}
                      {result.price}
                    </p>
                    <p>
                      <span className="text-emerald-300/85">Stock:</span>{" "}
                      {result.stock}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-emerald-100/80">
                    Product details will appear here after payload execution.
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
            <p className="query-title">SQL Query Construction</p>
            <p className="query-subtitle">
              Backend reads `id` from the URL and concatenates it into SQL
              without parameterization.
            </p>

            <pre
              className="query-code"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              <code>
                {`const query =
  "SELECT * FROM products WHERE id = '" + productId + "'";`}
              </code>
            </pre>

            <div className="query-preview">
              <p>Live vulnerable query output:</p>
              <code>{liveQuery}</code>
            </div>

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
                Hint:{" "}
                <code>
                  {"1 AND updatexml(1,concat(0x7e,database()),1)-- -"}
                </code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
