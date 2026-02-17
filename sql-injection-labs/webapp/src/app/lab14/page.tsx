"use client";

import { useState, FormEvent, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab14Page() {
  const [username, setUsername] = useState("admin");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const hints = [
    "Conditional errors leak data through error messages without displaying query results.",
    "Use CASE statements to trigger errors only when conditions are TRUE.",
    "Example: CASE WHEN (1=1) THEN CAST('error' AS int) ELSE 0 END",
    "Extract data: CASE WHEN SUBSTRING(password,1,1)='a' THEN CAST('match' AS int) ELSE 0 END",
    "PostgreSQL: Use type casting errors. MySQL: Use functions like extractvalue(). SQL Server: Use CONVERT errors.",
  ];

  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM users WHERE username = $1");
      setQueryParams([username]);
    } else {
      setExecutedQuery(`SELECT * FROM users WHERE username = '${username}'`);
      setQueryParams([]);
    }
  }, [username, isSecureMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab14/user/${isSecureMode ? "secure" : "unsecure"}?username=${encodeURIComponent(username)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setStatusMessage(`✅ User ${data.exists ? "exists" : "not found"}`);
        setErrorDetails(null);
      } else {
        setStatusMessage("❌ Database Error");
        setErrorDetails({
          message: data.error,
          code: data.errorCode || "UNKNOWN",
          detail: data.errorDetail || "No additional details",
        });

        // Check if conditional error injection
        if (
          !isSecureMode &&
          (username.includes("CASE") ||
            username.includes("CAST") ||
            username.includes("CONVERT") ||
            username.includes("extractvalue"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab14" }),
          });
          setShowSuccess(true);
        }
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setUsername(value);
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM users WHERE username = $1");
      setQueryParams([value]);
    } else {
      setExecutedQuery(`SELECT * FROM users WHERE username = '${value}'`);
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={14}
        labTitle="Conditional Error SQLi"
        labDescription="Master conditional error-based SQL injection. Extract data by triggering database errors only when specific conditions are TRUE."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">User Lookup</h2>
          <p className="text-muted mb-6">
            This application only tells you if a user exists or not. Use
            conditional error-based SQLi to extract data by triggering errors
            when your conditions are TRUE.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Try: admin' AND (CASE WHEN (1=1) THEN CAST('x' AS int) ELSE 0 END)=0--"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none font-mono text-sm transition"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Checking..." : "Lookup"}
                </button>
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

            {/* Error Details */}
            {errorDetails && (
              <div className="p-5 bg-red-900 text-red-100 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-bold">Database Error Details</span>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-red-300">Error Code:</span>{" "}
                    <span className="text-white">{errorDetails.code}</span>
                  </div>
                  <div>
                    <span className="text-red-300">Message:</span>{" "}
                    <span className="text-white">{errorDetails.message}</span>
                  </div>
                  {errorDetails.detail && (
                    <div>
                      <span className="text-red-300">Detail:</span>{" "}
                      <span className="text-white">{errorDetails.detail}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-red-700">
                  <p className="text-xs text-red-200">
                    💡 Error occurred! This means your conditional statement
                    evaluated to TRUE.
                  </p>
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
                Use CASE statements to trigger type conversion errors only when
                your condition is TRUE. If no error occurs, your condition was
                FALSE. Extract data character by character.
              </p>
            </div>

            <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">
                🎯 Conditional Error Technique
              </h3>
              <div className="space-y-3 text-sm text-purple-900">
                <div>
                  <p className="font-bold mb-1">Step 1: Test Basic Injection</p>
                  <div className="bg-white p-2 rounded font-mono text-xs">
                    admin' AND (CASE WHEN (1=1) THEN CAST('x' AS int) ELSE 0
                    END)=0--
                  </div>
                  <p className="text-xs mt-1">
                    If this errors, you have SQL injection!
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1">
                    Step 2: Extract First Character
                  </p>
                  <div className="bg-white p-2 rounded font-mono text-xs">
                    admin' AND (CASE WHEN SUBSTRING(password,1,1)='a' THEN
                    CAST('x' AS int) ELSE 0 END)=0--
                  </div>
                  <p className="text-xs mt-1">
                    Error = first char is 'a', No error = it's not 'a'
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1">
                    Step 3: Repeat for Each Character
                  </p>
                  <p className="text-xs">
                    Continue testing characters until you extract the full
                    password
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
              <h3 className="font-bold text-orange-900 mb-2">
                🔥 Why Conditional Errors?
              </h3>
              <p className="text-sm text-orange-900 mb-2">
                This technique is powerful because:
              </p>
              <ul className="text-sm text-orange-900 space-y-1 list-disc list-inside">
                <li>
                  <strong>Works when boolean-based fails:</strong> No visible
                  difference in responses
                </li>
                <li>
                  <strong>Faster than time-based:</strong> No waiting for delays
                </li>
                <li>
                  <strong>Reliable:</strong> Error either happens or it doesn't
                </li>
                <li>
                  <strong>Bypasses filters:</strong> Doesn't look like typical
                  SQLi
                </li>
              </ul>
            </div>

            <div className="p-5 bg-gray-50 border-2 border-gray-300 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">
                🗄️ Database-Specific Payloads
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    PostgreSQL
                  </span>
                  <p className="font-mono text-xs mt-1 text-gray-700">
                    CAST('x' AS integer)
                  </p>
                </div>
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    MySQL
                  </span>
                  <p className="font-mono text-xs mt-1 text-gray-700">
                    extractvalue(1, concat('~', (SELECT password)))
                  </p>
                </div>
                <div>
                  <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                    SQL Server
                  </span>
                  <p className="font-mono text-xs mt-1 text-gray-700">
                    CONVERT(int, 'text')
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={14}
        title="Conditional Error SQLi"
        message="Phenomenal! You've mastered conditional error-based SQL injection. You now understand all major blind SQLi techniques!"
      />
    </>
  );
}
