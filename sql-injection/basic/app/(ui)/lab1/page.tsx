"use client";

import FlagInput from "@/components/FlagInput";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface QueryRow {
  [key: string]: string | number | null;
}

export default function Lab1Page() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Run payload to attempt login bypass.");
  const [flag, setFlag] = useState("");

  const query = useMemo(
    () =>
      `SELECT id, username FROM users WHERE username = '${username}' AND password = '${password}'`,
    [username, password],
  );

  const login = async () => {
    try {
      const res = await fetch("/api/lab1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log("API Response:", data);
      if (data.flag) {
        setStatus("Login bypass successful!  "+ data.flag);
        
      }
    } catch (error) {
      setStatus("An error occurred during login.");
      
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
        nextLabLink="lab2"
        labid="lab1"
      />

      <section className="lab-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lab-intro"
        >
          <p className="eyebrow">Lab 1</p>
          <h1 className="lab-title">Basic Login Bypass</h1>
          <p className="lab-subtitle">
            Mission: Bypass the login and extract the mission token.
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
              Target: Legacy Auth Comparator
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <Input
                variant="bordered"
                label="Username"
                value={username}
                onValueChange={setUsername}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={password}
                onValueChange={setPassword}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />
              <Button
                color="success"
                radius="sm"
                className="cta-primary"
                fullWidth
                onPress={login}
              >
                Submit
              </Button>

              <div className="w-full rounded-md border border-amber-300/40 bg-amber-950/30 px-3 py-2 text-sm font-medium text-amber-100 break-words min-h-12">
                <span className="block text-xs uppercase tracking-wide text-amber-300/80">
                  Operator Log
                </span>
                <span>{status}</span>
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
              Quoted values can be terminated with `'`, numeric expressions
              require boolean math.
            </p>

            <pre
              className="query-code"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              <code>{query}</code>
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
                Suggested payload: <code>{"' OR '1'='1' --"}</code>
              </span>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </main>
  );
}
