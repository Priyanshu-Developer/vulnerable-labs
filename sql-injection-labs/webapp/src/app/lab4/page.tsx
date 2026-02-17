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

export default function Lab4Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "ORDER BY is used to sort results and can reveal the number of columns.",
    "Try: ' ORDER BY 1-- to sort by the first column. Increase the number until you get an error.",
    "When you ORDER BY a column number that doesn't exist, you'll get an error.",
    "Try: ' ORDER BY 6-- then ' ORDER BY 7-- to find where it breaks.",
    "Once you know the column count, you can craft proper UNION queries.",
  ];

  // Update query display when inputs change
  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE category = $1");
      setQueryParams([searchQuery]);
    } else {
      setExecutedQuery(
        `SELECT * FROM products WHERE category = '${searchQuery}'`,
      );
      setQueryParams([]);
    }
  }, [searchQuery, isSecureMode]);

  const handleSearch = async () => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab4/products/${isSecureMode ? "secure" : "unsecure"}?category=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
        if (data.params) {
          setQueryParams(data.params);
        }
      }

      if (data.success) {
        setProducts(data.data || []);
        setStatusMessage(`✅ Found ${data.data?.length || 0} products`);

        // Check if ORDER BY technique was used
        if (!isSecureMode && searchQuery.toUpperCase().includes("ORDER BY")) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab4" }),
          });
          setShowSuccess(true);
        }
      } else {
        setProducts([]);
        setStatusMessage("❌ " + data.error);
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE category = $1");
      setQueryParams([value]);
    } else {
      setExecutedQuery(`SELECT * FROM products WHERE category = '${value}'`);
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={4}
        labTitle="Finding Number of Columns"
        labDescription="Learn to use ORDER BY technique to determine the number of columns in a query result. This is essential for crafting successful UNION attacks."
        difficulty="Intermediate"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Category Search</h2>
          <p className="text-muted mb-6">
            Search products by category. Use the ORDER BY technique to discover
            how many columns are in the result set - a crucial step before UNION
            attacks.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Category<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Enter category (try: electronics' ORDER BY 1--)"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-8 py-3 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <p className="text-sm text-amber-900">
                <strong>💡 Tip:</strong> Try incrementing the ORDER BY column
                number (1, 2, 3, ...) until you get an error. The last
                successful number tells you how many columns exist.
              </p>
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

            {/* Products Display */}
            {products.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="surface p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted mt-1">
                      {product.category}
                    </p>
                    <p className="text-2xl font-black text-(--brand) mt-2">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>
                    {product.description && (
                      <p className="text-sm text-gray-700 mt-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                ))}
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
              Use the ORDER BY clause to determine the number of columns in the
              products table. This information is critical for constructing
              valid UNION queries in future attacks.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={4}
        title="Finding Number of Columns"
        message="Well done! You've used ORDER BY to discover the column count. This technique is essential for UNION-based SQL injection attacks."
      />
    </>
  );
}
