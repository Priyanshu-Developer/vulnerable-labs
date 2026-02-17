"use client";

import { useState, FormEvent, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab13Page() {
  const [userAgent, setUserAgent] = useState(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  );
  const [referer, setReferer] = useState("https://google.com");
  const [customHeader, setCustomHeader] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [logData, setLogData] = useState<any>(null);

  const hints = [
    "HTTP headers like User-Agent, Referer, and X-Forwarded-For can be logged in databases.",
    "If the application logs headers without sanitization, they become SQL injection vectors.",
    "Try: Mozilla/5.0' OR '1'='1 in the User-Agent field.",
    "Test Referer header: https://evil.com' UNION SELECT username,password FROM users--",
    "Custom headers are often overlooked but can be just as vulnerable!",
  ];

  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery(
        "INSERT INTO logs (user_agent, referer, ip) VALUES ($1, $2, $3)",
      );
      setQueryParams([userAgent, referer, "127.0.0.1"]);
    } else {
      setExecutedQuery(
        `INSERT INTO logs (user_agent, referer, ip) VALUES ('${userAgent}', '${referer}', '127.0.0.1')`,
      );
      setQueryParams([]);
    }
  }, [userAgent, referer, isSecureMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    try {
      const headers: any = {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        Referer: referer,
      };

      if (customHeader) {
        const [key, value] = customHeader.split(":");
        if (key && value) {
          headers[key.trim()] = value.trim();
        }
      }

      const endpoint = `/api/lab13/log/${isSecureMode ? "secure" : "unsecure"}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ test: true }),
      });

      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setLogData(data.log);
        setStatusMessage(`✅ Request logged successfully`);

        // Check if SQL injection through headers
        if (
          !isSecureMode &&
          (userAgent.includes("'") ||
            referer.includes("'") ||
            userAgent.includes("UNION") ||
            referer.includes("UNION") ||
            userAgent.includes("--") ||
            referer.includes("--"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab13" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage("❌ " + data.error);
        setLogData(null);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={13}
        labTitle="Blind SQLi in HTTP Headers"
        labDescription="Exploit SQL injection through HTTP headers. Learn how User-Agent, Referer, and custom headers can become attack vectors when logged to databases."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">HTTP Request Logger</h2>
          <p className="text-muted mb-6">
            This application logs HTTP headers to track visitors. The headers
            are inserted directly into the database. Can you exploit the logging
            mechanism?
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                User-Agent Header
              </label>
              <input
                type="text"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                placeholder="Mozilla/5.0 ..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none font-mono text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Referer Header
              </label>
              <input
                type="text"
                value={referer}
                onChange={(e) => setReferer(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none font-mono text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Custom Header (Optional)
                <span className="text-xs text-muted ml-2">
                  Format: Header-Name: value
                </span>
              </label>
              <input
                type="text"
                value={customHeader}
                onChange={(e) => setCustomHeader(e.target.value)}
                placeholder="X-Forwarded-For: 192.168.1.1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none font-mono text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition text-lg"
            >
              {isLoading ? "Logging Request..." : "Send Request"}
            </button>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl border-2 text-sm font-semibold ${
                  statusMessage.includes("✅")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Log Data Display */}
            {logData && (
              <div className="p-5 bg-gray-900 text-green-400 rounded-xl font-mono text-sm">
                <div className="flex items-center gap-2 mb-3 text-white">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-bold">Request Log Entry</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-gray-500">ID:</span> {logData.id}
                  </div>
                  <div>
                    <span className="text-gray-500">User-Agent:</span>{" "}
                    {logData.user_agent}
                  </div>
                  <div>
                    <span className="text-gray-500">Referer:</span>{" "}
                    {logData.referer}
                  </div>
                  <div>
                    <span className="text-gray-500">IP:</span> {logData.ip}
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp:</span>{" "}
                    {logData.created_at}
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 space-y-4">
            <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
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
                Your Objective
              </h3>
              <p className="text-sm text-blue-900">
                Inject SQL through HTTP headers that are logged to the database.
                The application inserts User-Agent and Referer values directly
                into INSERT statements without sanitization.
              </p>
            </div>

            <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">
                📡 Common Vulnerable Headers
              </h3>
              <div className="space-y-3 text-sm text-purple-900">
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    User-Agent
                  </span>
                  <p className="mt-1 text-xs">
                    Browser identification - frequently logged
                  </p>
                </div>
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    Referer
                  </span>
                  <p className="mt-1 text-xs">
                    Previous page URL - used for analytics
                  </p>
                </div>
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    X-Forwarded-For
                  </span>
                  <p className="mt-1 text-xs">
                    Client IP through proxy - logged for tracking
                  </p>
                </div>
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    Accept-Language
                  </span>
                  <p className="mt-1 text-xs">
                    Language preference - sometimes stored
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <h3 className="font-bold text-amber-900 mb-2">
                ⚠️ Real-World Impact
              </h3>
              <p className="text-sm text-amber-900">
                Header-based SQL injection is particularly dangerous because:
              </p>
              <ul className="text-sm text-amber-900 mt-2 space-y-1 list-disc list-inside">
                <li>Headers are often trusted and not validated</li>
                <li>Automated tools and bots send headers unnoticed</li>
                <li>Applications log headers for analytics/debugging</li>
                <li>Difficult to detect in standard security scans</li>
              </ul>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={13}
        title="Blind SQLi in HTTP Headers"
        message="Impressive! You've exploited SQL injection through HTTP headers. This sophisticated technique bypasses many security measures!"
      />
    </>
  );
}
