"use client";

import { useState, FormEvent, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab9Page() {
  const [productId, setProductId] = useState("1");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [responseExists, setResponseExists] = useState(false);

  const hints = [
    "Boolean-based blind SQL injection relies on the application's different responses for TRUE vs FALSE conditions.",
    "Try: 1 AND 1=1 (returns product) vs 1 AND 1=2 (returns nothing). This confirms vulnerability.",
    "Extract data character by character: 1 AND SUBSTRING(username,1,1)='a' FROM users WHERE id=1",
    "Use CASE statements for more reliable boolean logic: 1 AND (CASE WHEN (1=1) THEN 1 ELSE 0 END)=1",
    "Automate extraction with binary search algorithm for faster data retrieval: check if ASCII(char) > 100, then narrow down.",
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

    try {
      const endpoint = `/api/lab9/products/${isSecureMode ? "secure" : "unsecure"}?id=${encodeURIComponent(productId)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        const exists = data.exists;
        setResponseExists(exists);
        setStatusMessage(
          exists ? "✅ Product exists!" : "❌ Product not found",
        );

        // Check if user is testing boolean conditions
        if (
          !isSecureMode &&
          (productId.includes("AND") || productId.includes("OR"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab9" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage("❌ " + data.error);
        setResponseExists(false);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
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
        labNumber={9}
        labTitle="Boolean-Based Blind SQLi"
        labDescription="Master blind SQL injection using boolean logic. Extract data character by character based on TRUE/FALSE responses from the application."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Existence Check</h2>
          <p className="text-muted mb-6">
            This endpoint only tells you if a product exists or not. Use boolean
            logic to extract information even though the application doesn't
            display the actual data.
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
                  placeholder="Try: 1 AND 1=1 or 1 AND 1=2"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Checking..." : "Check"}
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

            {/* Boolean Logic Indicator */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border-2 ${responseExists ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full ${responseExists ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="font-bold text-sm">TRUE Condition</span>
                </div>
                <p className="text-xs text-muted">
                  Product exists - query returned TRUE
                </p>
              </div>
              <div
                className={`p-4 rounded-xl border-2 ${!responseExists && statusMessage ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full ${!responseExists && statusMessage ? "bg-red-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="font-bold text-sm">FALSE Condition</span>
                </div>
                <p className="text-xs text-muted">
                  Product not found - query returned FALSE
                </p>
              </div>
            </div>
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
                Use boolean conditions to confirm the vulnerability. Test with
                conditions that return TRUE (product exists) vs FALSE (product
                doesn't exist) to verify you can control the query logic.
              </p>
            </div>

            <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">
                💡 Understanding Boolean Blind SQLi
              </h3>
              <p className="text-sm text-purple-900 mb-3">
                Unlike traditional SQL injection, blind SQLi doesn't show query
                results directly. Instead, you infer information from the
                application's behavior:
              </p>
              <ul className="text-sm text-purple-900 space-y-1 list-disc list-inside">
                <li>
                  <strong>TRUE condition:</strong> Product found → Application
                  behaves one way
                </li>
                <li>
                  <strong>FALSE condition:</strong> Product not found →
                  Application behaves differently
                </li>
                <li>
                  <strong>Data extraction:</strong> Test each character: "Is the
                  first letter 'a'?" (TRUE/FALSE)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={9}
        title="Boolean-Based Blind SQLi"
        message="Excellent! You've mastered boolean-based blind SQL injection. This technique is crucial for data extraction when direct output isn't available."
      />
    </>
  );
}
