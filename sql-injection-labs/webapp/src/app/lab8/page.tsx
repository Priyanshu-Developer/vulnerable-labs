"use client";

import { useState, useEffect } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab8Page() {
  const [productId, setProductId] = useState("1");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "URL parameters can be vulnerable to SQL injection when not properly validated.",
    "Try modifying the ID parameter in the URL: ?id=1 OR 1=1",
    "You can use UNION queries to extract data from other tables: ?id=1 UNION SELECT NULL,username,password,NULL,NULL FROM users",
    "The number of columns must match. Count the columns in the original query first.",
    "Try: ?id=1' OR '1'='1 to bypass the WHERE clause.",
  ];

  useEffect(() => {
    // Update query display when productId or mode changes
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE id = $1");
      setQueryParams([productId]);
    } else {
      setExecutedQuery(`SELECT * FROM products WHERE id = ${productId}`);
      setQueryParams([]);
    }
  }, [productId, isSecureMode]);

  const fetchProduct = async () => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab8/products/${isSecureMode ? "secure" : "unsecure"}?id=${encodeURIComponent(productId)}`;
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

        if (
          !isSecureMode &&
          (productId.includes("OR") || productId.includes("UNION"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab8" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage("❌ " + data.error);
        setProduct(null);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleProductIdChange = (value: string) => {
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
        labNumber={8}
        labTitle="SQLi in URL Parameters"
        labDescription="Learn how URL parameters can be exploited through SQL injection. Manipulate the product ID in the URL to extract unauthorized data."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p className="text-muted mb-6">
            View product details by ID. The ID is passed via URL parameter and
            used directly in the SQL query.
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
                  onChange={(e) => handleProductIdChange(e.target.value)}
                  placeholder="Enter product ID (e.g., 1, 2, 3...)"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                />
                <button
                  onClick={fetchProduct}
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Loading..." : "Load"}
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

            {/* Product Display */}
            {product && (
              <div className="surface p-6 bg-linear-to-br from-white to-blue-50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 bg-linear-to-br from-blue-200 to-indigo-200 rounded-xl"></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {product.name || "Product Name"}
                    </h3>
                    <p className="text-sm text-muted mb-4">
                      {product.category || "Category"}
                    </p>
                    <p className="text-3xl font-black text-(--brand) mb-4">
                      ${product.price || "0.00"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {product.description || "No description available."}
                    </p>
                    {product.username && (
                      <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="text-xs font-bold text-red-900">
                          ⚠️ Data Leak Detected!
                        </p>
                        <p className="text-xs text-red-800 mt-1">
                          Username: {product.username}
                        </p>
                      </div>
                    )}
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
              Exploit the URL parameter to extract data beyond just product
              information. Try using UNION queries or logical operators to
              retrieve unauthorized data from the database.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={8}
        title="SQLi in URL Parameters"
        message="Outstanding! You've completed all SQL injection labs. You now understand various attack vectors!"
      />
    </>
  );
}
