"use client";

import { useState, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export default function Lab6Page() {
  const [productId, setProductId] = useState("1");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "Numeric fields don't require quotes: WHERE id = 1 vs string fields: WHERE name = 'value'",
    "Try numeric injection: 1 OR 1=1 (no quotes needed)",
    "String injection requires escaping quotes: 1' OR '1'='1",
    "Test for numeric: id=1 AND 1=1 should work, id=1 AND 'a'='a' might fail",
    "UNION attacks differ: numeric uses 1 UNION SELECT..., string uses '1' UNION SELECT...",
  ];

  // Update query display when inputs change
  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE id = $1");
      setQueryParams([productId]);
    } else {
      // Check if productId looks numeric
      const isNumeric = /^\d+$/.test(productId.trim());
      if (isNumeric) {
        setExecutedQuery(`SELECT * FROM products WHERE id = ${productId}`);
      } else {
        setExecutedQuery(`SELECT * FROM products WHERE id = ${productId}`);
      }
      setQueryParams([]);
    }
  }, [productId, isSecureMode]);

  const handleFetch = async () => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab6/products/${isSecureMode ? "secure" : "unsecure"}?id=${encodeURIComponent(productId)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setProduct(data.data);
        setStatusMessage(`✅ Product loaded successfully`);

        // Check if injection was successful (OR or UNION in numeric context)
        if (
          !isSecureMode &&
          (productId.includes("OR") || productId.includes("UNION"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab6" }),
          });
          setShowSuccess(true);
        }
      } else {
        setProduct(null);
        setStatusMessage("❌ " + data.error);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdChange = (value: string) => {
    setProductId(value);
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE id = $1");
      setQueryParams([value]);
    } else {
      const isNumeric = /^\d+$/.test(value.trim());
      if (isNumeric || !value.trim()) {
        setExecutedQuery(`SELECT * FROM products WHERE id = ${value || "1"}`);
      } else {
        setExecutedQuery(`SELECT * FROM products WHERE id = ${value}`);
      }
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={6}
        labTitle="String vs Numeric Injection"
        labDescription="Understand the differences between SQL injection in numeric and string contexts. Learn when quotes are needed and how injection techniques vary."
        difficulty="Intermediate"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Details by ID</h2>
          <p className="text-muted mb-6">
            Fetch a product by its numeric ID. Notice how numeric fields behave
            differently from string fields in SQL injection attacks - no quotes
            needed!
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Product ID<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => handleIdChange(e.target.value)}
                  placeholder="Enter numeric ID (try: 1 OR 1=1)"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                />
                <button
                  onClick={handleFetch}
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Loading..." : "Fetch"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-xs font-bold text-blue-900 mb-2">
                  Numeric Injection
                </p>
                <code className="text-xs text-blue-800">1 OR 1=1</code>
                <p className="text-xs text-blue-700 mt-1">No quotes needed</p>
              </div>
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <p className="text-xs font-bold text-purple-900 mb-2">
                  String Injection
                </p>
                <code className="text-xs text-purple-800">
                  &apos;1&apos; OR &apos;1&apos;=&apos;1
                </code>
                <p className="text-xs text-purple-700 mt-1">
                  Requires quote escaping
                </p>
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

            {/* Product Display */}
            {product && (
              <div className="surface p-6 bg-gradient-to-br from-white to-blue-50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted mb-4">
                      {product.category}
                    </p>
                    <p className="text-3xl font-black text-(--brand) mb-4">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {product.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
              Exploit the numeric ID parameter using SQL injection without
              quotes. Compare how numeric injection differs from string-based
              injection in previous labs.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={6}
        title="String vs Numeric Injection"
        message="Great work! You've mastered the differences between numeric and string-based SQL injection. Understanding data types is crucial for successful attacks."
      />
    </>
  );
}
