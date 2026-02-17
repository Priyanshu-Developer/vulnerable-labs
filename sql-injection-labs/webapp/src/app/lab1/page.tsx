"use client";

import { useState, FormEvent } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab1Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "SQL comments can be used to ignore parts of a query. Try using -- or # at the end of your username.",
    "The query structure is: WHERE username = 'YOUR_INPUT' AND password = 'YOUR_INPUT'",
    "Try entering: admin' -- as the username. This will comment out the password check.",
    "Another approach: Use admin'# to comment out everything after the username.",
    "You can also try: admin' OR '1'='1 to make the condition always true.",
  ];

  // Update SQL query display based on inputs
  const updateQueryDisplay = () => {
    if (isSecureMode) {
      setExecutedQuery(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
      );
      setQueryParams([username, password]);
    } else {
      setExecutedQuery(
        `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
      );
      setQueryParams([]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    // Update query display before submission
    updateQueryDisplay();

    try {
      const endpoint = `/api/lab1/auth/${isSecureMode ? "secure" : "unsecure"}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Update with actual query from backend
      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (response.status === 200 && !isSecureMode) {
        // Update progress
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lab_name: "lab1" }),
        });
        setShowSuccess(true);
        setStatusMessage(data.message);
      } else if (response.status === 200 && isSecureMode) {
        setStatusMessage("✅ " + data.message);
      } else {
        setStatusMessage("❌ " + (data.error || data.message));
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update query display whenever inputs change
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setTimeout(() => {
      if (isSecureMode) {
        setExecutedQuery(
          "SELECT * FROM users WHERE username = $1 AND password = $2",
        );
        setQueryParams([value, password]);
      } else {
        setExecutedQuery(
          `SELECT * FROM users WHERE username = '${value}' AND password = '${password}'`,
        );
        setQueryParams([]);
      }
    }, 100);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setTimeout(() => {
      if (isSecureMode) {
        setExecutedQuery(
          "SELECT * FROM users WHERE username = $1 AND password = $2",
        );
        setQueryParams([username, value]);
      } else {
        setExecutedQuery(
          `SELECT * FROM users WHERE username = '${username}' AND password = '${value}'`,
        );
        setQueryParams([]);
      }
    }, 100);
  };

  return (
    <>
      <LabLayout
        labNumber={1}
        labTitle="Basic Login Bypass"
        labDescription="Learn how SQL injection can bypass authentication by manipulating login queries. Exploit the vulnerable login form to gain unauthorized access."
        difficulty="Beginner"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Login Form</h2>
          <p className="text-muted mb-6">
            Try to login as the admin user without knowing the password. The
            application uses a simple SQL query to verify credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter username (try: admin)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                required
              />
            </div>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl border-2 text-sm font-semibold ${
                  statusMessage.includes("✅")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : statusMessage.includes("❌")
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                {statusMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
            >
              {isSubmitting ? "Attempting Login..." : "Login"}
            </button>
          </form>

          <div className="mt-8 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
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
              Successfully login as &quot;admin&quot; without knowing the actual
              password by exploiting the SQL injection vulnerability in the
              login form.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={1}
        title="Basic Login Bypass"
        message="Excellent! You've successfully bypassed the authentication. You've learned how SQL injection can compromise login systems."
      />
    </>
  );
}
