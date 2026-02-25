"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

const tracks = [
  {
    title: "Lab 1: String vs Numeric Injection",
    detail:
      "Exploit login string boundaries and compare with numeric clause behavior.",
    href: "/lab1",
    tier: "Easy",
  },
  {
    title: "Lab 2: SQLi in URL Parameters",
    detail:
      "Inject into query-string parameters and expand backend result scope.",
    href: "/lab2",
    tier: "Easy+",
  },
  {
    title: "Lab 3: SQLi in Search Function",
    detail:
      "Poison search filters, pivot to UNION, and leak hidden table content.",
    href: "/lab3",
    tier: "Medium",
  },
  {
    title: "Lab 4: Extracting Database Metadata",
    detail:
      "Enumerate column shape with ORDER BY and submit the discovered schema count.",
    href: "/lab4",
    tier: "Medium+",
  },
  {
    title: "Lab 5: Advanced Schema Enumeration",
    detail:
      "Query information_schema to discover hidden tables, enumerate columns, and extract sensitive data.",
    href: "/lab5",
    tier: "Hard",
  },
  {
    title: "Lab 6: SQL Injection WAF Bypass",
    detail:
      "Work around basic input filters and craft payload variants that still execute.",
    href: "/lab6",
    tier: "Hard+",
  },
  {
    title: "Lab 7: Blind SQL Injection",
    detail:
      "Use boolean conditions and response behavior to infer hidden data bit by bit.",
    href: "/lab7",
    tier: "Expert",
  },
  {
    title: "Lab 8: Time-Based Blind SQL Injection",
    detail:
      "Extract hidden values by measuring delay-based responses when content stays constant.",
    href: "/lab8",
    tier: "Expert+",
  },
];

const stats = [
  { label: "Track", value: "HTB Style SQLi" },
  { label: "Labs", value: "8 Missions" },
  { label: "Flow", value: "Progressive" },
];

export default function MainPage() {
  return (
    <main className="landing-shell">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="scan-grid" />

      <section className="landing-wrap">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          SQL Injection Operations Center
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="title"
        >
          Eight offensive labs.
          <span> One guided exploitation path.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="subtitle"
        >
          This track recreates Hack The Box style mission flow: brief, exploit,
          extract token, submit flag, unlock next target.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="cta-row"
        >
          <Button
            as={Link}
            href="/lab1"
            color="success"
            radius="sm"
            size="lg"
            className="cta-primary"
          >
            Start Mission Chain
          </Button>
          <Button
            as={Link}
            href="/lab2"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 2
          </Button>
          <Button
            as={Link}
            href="/lab3"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 3
          </Button>
          <Button
            as={Link}
            href="/lab4"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 4
          </Button>
          <Button
            as={Link}
            href="/lab5"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 5
          </Button>
          <Button
            as={Link}
            href="/lab6"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 6
          </Button>
          <Button
            as={Link}
            href="/lab7"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 7
          </Button>
          <Button
            as={Link}
            href="/lab8"
            variant="bordered"
            radius="sm"
            size="lg"
            className="cta-secondary"
          >
            Open Lab 8
          </Button>
        </motion.div>

        <div className="stats-row">
          {stats.map((item, index) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.08, duration: 0.45 }}
              className="stat-card"
            >
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </motion.article>
          ))}
        </div>

        <div className="track-grid">
          {tracks.map((track, index) => (
            <motion.article
              key={track.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.09, duration: 0.5 }}
              className="track-card"
            >
              <h2>{track.title}</h2>
              <p>{track.detail}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-emerald-300/80">
                Difficulty: {track.tier}
              </p>
              <Link
                href={track.href}
                className="inline-block mt-3 text-sm text-[#7cffbb] hover:underline"
              >
                Enter Lab
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="terminal-card"
        >
          <div className="terminal-head">
            <span />
            <span />
            <span />
          </div>
          <code className="terminal-line">
            {"GET /api/challenges/url-parameters?id=1 OR 1=1 --"}
          </code>
        </motion.div>
      </section>
    </main>
  );
}
