"use client";

import { useState, FormEvent, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab12Page() {
  const [cookieValue, setCookieValue] = useState("user=guest");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const hints = [
    "Cookies are HTTP headers sent with every request. They can be vulnerable to SQL injection too!",
    "The application extracts user ID from the cookie and uses it in SQL queries.",
    "Try modifying the cookie value: user=1 OR 1=1-- to bypass authentication.",
    "Use browser DevTools (F12) → Application → Cookies to see and modify cookie values.",
    "Test with: user=1' UNION SELECT username,password,1,1,1 FROM users--",
  ];

  useEffect(() => {
    const param = cookieValue.split("=")[1] || "guest";
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM sessions WHERE user_id = $1");
      setQueryParams([param]);
    } else {
      setExecutedQuery(`SELECT * FROM sessions WHERE user_id = '${param}'`);
      setQueryParams([]);
    }
  }, [cookieValue, isSecureMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab12/session/${isSecureMode ? "secure" : "unsecure"}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookie: cookieValue }),
      });

      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setUserData(data.user);
        setStatusMessage(
          `✅ Session loaded for: ${data.user?.username || "Unknown"}`,
        );

        // Check if SQL injection through cookie
        if (
          !isSecureMode &&
          (cookieValue.includes("OR") ||
            cookieValue.includes("UNION") ||
            cookieValue.includes("--"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab12" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage("❌ " + data.error);
        setUserData(null);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookieChange = (value: string) => {
    setCookieValue(value);
    const param = value.split("=")[1] || "guest";
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM sessions WHERE user_id = $1");
      setQueryParams([param]);
    } else {
      setExecutedQuery(`SELECT * FROM sessions WHERE user_id = '${param}'`);
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={12}
        labTitle="Blind SQLi via Cookies"
        labDescription="Exploit SQL injection through HTTP cookies. Learn how cookie values can be used to inject malicious SQL when improperly validated."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Cookie-Based Session</h2>
          <p className="text-muted mb-6">
            This application uses cookies to track user sessions. The cookie
            value is directly used in SQL queries to retrieve session data. Can
            you exploit this?
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Session Cookie <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={cookieValue}
                  onChange={(e) => handleCookieChange(e.target.value)}
                  placeholder="user=value"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none font-mono text-sm transition"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition text-lg"
                >
                  {isLoading ? "Validating Session..." : "Load Session"}
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

            {/* User Data Display */}
            {userData && (
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-3">
                  👤 Session Data
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Username:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {userData.username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">User ID:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {userData.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Role:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {userData.role || "user"}
                    </span>
                  </div>
                  {userData.password && (
                    <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded">
                      <p className="text-xs font-bold text-red-900">
                        ⚠️ Sensitive Data Leaked!
                      </p>
                      <p className="text-xs text-red-800">
                        Password: {userData.password}
                      </p>
                    </div>
                  )}
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
                Inject SQL through the cookie value to extract unauthorized data
                or bypass authentication. The application trusts cookie values
                and uses them directly in SQL queries.
              </p>
            </div>

            <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">
                🍪 Cookie SQLi Attack Vectors
              </h3>
              <div className="space-y-2 text-sm text-purple-900">
                <div className="bg-white p-3 rounded font-mono text-xs">
                  user=admin' OR '1'='1
                </div>
                <p className="text-xs">
                  Bypass authentication by making condition always true
                </p>
                <div className="bg-white p-3 rounded font-mono text-xs">
                  user=1' UNION SELECT username,password,role FROM users--
                </div>
                <p className="text-xs">Extract user data using UNION query</p>
                <div className="bg-white p-3 rounded font-mono text-xs">
                  user=1'; DROP TABLE sessions--
                </div>
                <p className="text-xs">
                  ⚠️ Destructive attack (for demonstration only!)
                </p>
              </div>
            </div>

            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <h3 className="font-bold text-amber-900 mb-2">
                🔍 Testing Cookies
              </h3>
              <p className="text-sm text-amber-900 mb-3">
                In real scenarios, you'd use browser DevTools or tools like Burp
                Suite to intercept and modify cookies:
              </p>
              <ol className="text-sm text-amber-900 space-y-1 list-decimal list-inside">
                <li>Open DevTools (F12) → Application tab</li>
                <li>Navigate to Cookies section</li>
                <li>Find the session cookie</li>
                <li>Edit the value with SQL payloads</li>
                <li>Refresh the page to see results</li>
              </ol>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={12}
        title="Blind SQLi via Cookies"
        message="Brilliant! You've exploited SQL injection through cookies. This attack vector is often overlooked but can be just as dangerous!"
      />
    </>
  );
}
