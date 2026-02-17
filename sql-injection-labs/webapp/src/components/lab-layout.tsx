"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Header from "./header";
import Footer from "./footer";

interface LabLayoutProps {
  children: ReactNode;
  labNumber: number;
  labTitle: string;
  labDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  hints: string[];
  sqlQuery?: string;
  sqlParams?: any[];
  isSecureMode: boolean;
  onSecureModeToggle: () => void;
}

export default function LabLayout({
  children,
  labNumber,
  labTitle,
  labDescription,
  difficulty,
  hints,
  sqlQuery,
  sqlParams,
  isSecureMode,
  onSecureModeToggle,
}: LabLayoutProps) {
  const [showHints, setShowHints] = useState(false);
  const [visibleHintCount, setVisibleHintCount] = useState(0);

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 border-green-300",
    Intermediate: "bg-amber-100 text-amber-800 border-amber-300",
    Advanced: "bg-red-100 text-red-800 border-red-300",
  };

  const formatSqlQuery = () => {
    if (!sqlQuery) return "No query executed yet";

    if (sqlParams && sqlParams.length > 0) {
      let formatted = sqlQuery;
      sqlParams.forEach((param, index) => {
        formatted = formatted.replace(`$${index + 1}`, `'${param}'`);
      });
      return formatted;
    }

    return sqlQuery;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container-width py-8">
        {/* Lab Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-(--brand) transition"
            >
              ← Back to Labs
            </Link>
          </div>

          <div className="surface p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-4 py-1.5 text-sm font-bold text-white">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Lab {labNumber}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${difficultyColors[difficulty]}`}
              >
                {difficulty}
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-black mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {labTitle}
            </h1>

            <p className="text-muted text-lg mb-6">{labDescription}</p>

            {/* Security Mode Toggle */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 rounded-xl border-2 border-(--line) bg-white px-4 py-2.5 shadow-sm">
                <span className="text-sm font-bold text-gray-700">
                  Security Mode:
                </span>
                <button
                  type="button"
                  onClick={onSecureModeToggle}
                  className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
                    isSecureMode ? "bg-green-500" : "bg-red-500"
                  }`}
                  aria-label="Toggle security mode"
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                      isSecureMode ? "left-[1.9rem]" : "left-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-bold ${isSecureMode ? "text-green-700" : "text-red-700"}`}
                >
                  {isSecureMode ? "🔒 Secured" : "🔓 Vulnerable"}
                </span>
              </div>

              {/* Hints Button */}
              <button
                onClick={() => setShowHints(!showHints)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-100 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                {showHints ? "Hide Hints" : "Show Hints"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Hints Panel */}
            {showHints && (
              <div className="surface p-6 bg-amber-50 border-amber-200">
                <h3 className="text-lg font-bold mb-4 text-amber-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hints ({visibleHintCount}/{hints.length})
                </h3>
                <div className="space-y-3">
                  {hints.slice(0, visibleHintCount).map((hint, index) => (
                    <div
                      key={index}
                      className="bg-white border border-amber-200 rounded-lg p-4"
                    >
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        Hint {index + 1}:
                      </p>
                      <p className="text-sm text-gray-700">{hint}</p>
                    </div>
                  ))}
                  {visibleHintCount < hints.length && (
                    <button
                      onClick={() => setVisibleHintCount(visibleHintCount + 1)}
                      className="w-full py-2 px-4 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg transition"
                    >
                      Reveal Next Hint ({visibleHintCount + 1}/{hints.length})
                    </button>
                  )}
                  {visibleHintCount > 0 && (
                    <button
                      onClick={() => setVisibleHintCount(0)}
                      className="w-full py-2 px-4 bg-white border border-amber-200 text-amber-900 font-semibold rounded-lg hover:bg-amber-50 transition"
                    >
                      Hide All Hints
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Lab Content */}
            <div className="surface p-6 md:p-8">{children}</div>
          </div>

          {/* SQL Query Monitor */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="surface p-6 bg-linear-to-br from-gray-900 to-gray-800 border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-white">
                  SQL Query Monitor
                </h3>
              </div>

              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded ${
                    isSecureMode
                      ? "bg-green-900 text-green-200"
                      : "bg-red-900 text-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSecureMode ? "bg-green-400" : "bg-red-400"
                    } animate-pulse`}
                  ></span>
                  {isSecureMode ? "Parameterized Query" : "Raw Concatenation"}
                </span>
              </div>

              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400 whitespace-pre-wrap break-all">
                  {formatSqlQuery()}
                </pre>
              </div>

              {sqlParams && sqlParams.length > 0 && isSecureMode && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-400 mb-2">
                    Parameters:
                  </p>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                    {sqlParams.map((param, index) => (
                      <div key={index} className="text-blue-300">
                        ${index + 1}: &quot;{String(param)}&quot;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  <span className="font-bold">Tip:</span> Watch how your input
                  affects the SQL query in real-time.
                  {isSecureMode
                    ? " The secure version uses parameterized queries."
                    : " Try injecting SQL to bypass the query logic!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
