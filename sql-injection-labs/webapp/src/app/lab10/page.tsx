"use client";

import { useState, FormEvent, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab10Page() {
  const [productId, setProductId] = useState("1");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [requestStartTime, setRequestStartTime] = useState<number>(0);

  const hints = [
    "Time-based blind SQL injection uses database sleep functions to create deliberate delays.",
    "PostgreSQL: Use pg_sleep(5) to pause execution for 5 seconds. Try: 1; SELECT pg_sleep(5)--",
    "If response takes longer, the injection worked! Normal: <1s, Injected: 5+ seconds.",
    "Extract data using conditionals: 1 AND (CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END)=0",
    "Combine with SUBSTRING to extract: 1 AND (CASE WHEN SUBSTRING(username,1,1)='a' THEN pg_sleep(5) END) FROM users",
  ];

  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE id = $1");
      setQueryParams([productId]);
    } else {
      setExecutedQuery(`SELECT * FROM products WHERE id = ${productId}`);
      setQueryParams([]);
    }
  }, [productId, isSecureMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    const startTime = Date.now();
    setRequestStartTime(startTime);

    try {
      const endpoint = `/api/lab10/products/${isSecureMode ? "secure" : "unsecure"}?id=${encodeURIComponent(productId)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      const endTime = Date.now();
      const duration = endTime - startTime;
      setResponseTime(duration);

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setStatusMessage(`✅ Response received in ${duration}ms`);

        // Check if time-based injection was successful (delay > 4 seconds)
        if (
          !isSecureMode &&
          duration > 4000 &&
          (productId.toLowerCase().includes("sleep") ||
            productId.toLowerCase().includes("delay"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab10" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage(`❌ Error after ${duration}ms: ` + data.error);
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      setResponseTime(duration);
      setStatusMessage(`❌ Request failed after ${duration}ms`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setProductId(value);
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE id = $1");
      setQueryParams([value]);
    } else {
      setExecutedQuery(`SELECT * FROM products WHERE id = ${value}`);
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={10}
        labTitle="Time-Based Blind SQLi"
        labDescription="Learn time-based blind SQL injection by creating deliberate delays in database responses. Extract data by measuring response times."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Lookup</h2>
          <p className="text-muted mb-6">
            This endpoint doesn't show differences in responses. Use time delays
            to confirm SQL injection and extract data by measuring how long
            queries take to execute.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Product ID <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Try: 1; SELECT pg_sleep(5)--"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>

            {/* Response Time Indicator */}
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-900">
                  ⏱️ Response Time Monitor
                </h3>
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-700">
                      Measuring...
                    </span>
                  </div>
                )}
              </div>
              <div className="text-4xl font-black text-purple-900 mb-2">
                {responseTime > 0
                  ? `${(responseTime / 1000).toFixed(2)}s`
                  : "0.00s"}
              </div>
              <div className="flex gap-2">
                <div
                  className={`flex-1 h-2 rounded-full ${responseTime < 1000 ? "bg-green-400" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex-1 h-2 rounded-full ${responseTime >= 1000 && responseTime < 3000 ? "bg-yellow-400" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex-1 h-2 rounded-full ${responseTime >= 3000 && responseTime < 5000 ? "bg-orange-400" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex-1 h-2 rounded-full ${responseTime >= 5000 ? "bg-red-400" : "bg-gray-200"}`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-purple-700 mt-1">
                <span>Fast</span>
                <span>Normal</span>
                <span>Slow</span>
                <span>Delayed</span>
              </div>
            </div>

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
                Inject a time delay function (like pg_sleep) to make the
                response take 5+ seconds. If successful, the response time will
                be significantly longer than normal.
              </p>
            </div>

            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <h3 className="font-bold text-amber-900 mb-2">
                🕐 Database Sleep Functions
              </h3>
              <div className="space-y-2 text-sm text-amber-900">
                <div className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    PostgreSQL:
                  </span>
                  <span>pg_sleep(seconds)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    MySQL:
                  </span>
                  <span>SLEEP(seconds)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    SQL Server:
                  </span>
                  <span>WAITFOR DELAY '00:00:05'</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={10}
        title="Time-Based Blind SQLi"
        message="Perfect! You've successfully exploited time-based blind SQL injection. This technique is powerful when no visual feedback is available."
      />
    </>
  );
}
