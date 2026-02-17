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

export default function Lab3Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "UNION-based injection combines results from multiple SELECT queries.",
    "First, determine the number of columns: ' ORDER BY 1-- then try 2, 3, etc.",
    "Try: ' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL-- to match column count.",
    "Extract data from other tables: ' UNION SELECT id,username,password,NULL,NULL,NULL FROM users--",
    "Use information_schema to discover tables: ' UNION SELECT NULL,table_name,NULL,NULL,NULL,NULL FROM information_schema.tables--",
  ];

  // Update query display when inputs change
  useEffect(() => {
    if (isSecureMode) {
      setExecutedQuery("SELECT * FROM products WHERE name ILIKE $1");
      setQueryParams([`%${searchQuery}%`]);
    } else {
      setExecutedQuery(
        `SELECT * FROM products WHERE name ILIKE '%${searchQuery}%'`,
      );
      setQueryParams([]);
    }
  }, [searchQuery, isSecureMode]);

  const handleSearch = async () => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      const endpoint = `/api/lab3/products/${isSecureMode ? "secure" : "unsecure"}?search=${encodeURIComponent(searchQuery)}`;
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

        // Check if UNION attack was successful
        if (!isSecureMode && searchQuery.toUpperCase().includes("UNION")) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab3" }),
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
      setExecutedQuery("SELECT * FROM products WHERE name ILIKE $1");
      setQueryParams([`%${value}%`]);
    } else {
      setExecutedQuery(`SELECT * FROM products WHERE name ILIKE '%${value}%'`);
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={3}
        labTitle="UNION-Based SQL Injection"
        labDescription="Master UNION-based attacks to combine results from multiple queries. Extract data from different tables by crafting UNION SELECT payloads."
        difficulty="Intermediate"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Search</h2>
          <p className="text-muted mb-6">
            Search for products and try UNION-based injection to retrieve data
            from other tables. You'll need to match the column count and data
            types correctly.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Search Query<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Enter search (try UNION SELECT...)"
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
                {products.map((product, idx) => (
                  <div key={product.id || idx} className="surface p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted mt-1">
                      {product.category}
                    </p>
                    <p className="text-2xl font-black text-(--brand) mt-2">
                      $
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : product.price || "0.00"}
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
              Use UNION SELECT to combine the product query results with data
              from other tables. First find the correct column count, then
              extract sensitive data like user credentials.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={3}
        title="UNION-Based SQL Injection"
        message="Excellent! You've successfully used UNION queries to extract data from other tables. This is a powerful technique for data exfiltration."
      />
    </>
  );
}
