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

export default function Lab2Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "Error-based SQL injection reveals database structure through error messages.",
    "Try adding a single quote (') to break the SQL query and trigger an error.",
    "Use: test' to see the SQL error message that reveals the query structure.",
    "Try: ' OR 1=1-- to bypass the search and return all products.",
    "UNION attacks can extract data: ' UNION SELECT NULL,username,password,NULL,NULL,NULL FROM users--",
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
      const endpoint = `/api/lab2/products/${isSecureMode ? "secured" : "unsecured"}?search=${encodeURIComponent(searchQuery)}`;
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
      } else {
        // Error occurred - this is the vulnerability!
        setProducts([]);
        setStatusMessage("❌ " + data.error);

        // If error occurred in unsecure mode, vulnerability was exploited
        if (!isSecureMode && data.error) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab2" }),
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
        labNumber={2}
        labTitle="Error-Based SQL Injection"
        labDescription="Learn how SQL errors can reveal database structure and enable exploitation. Trigger SQL errors to understand the underlying query structure."
        difficulty="Beginner"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Search</h2>
          <p className="text-muted mb-6">
            Search for products by name. The application uses SQL ILIKE for
            case-insensitive search. Try injecting SQL to trigger errors and
            reveal information.
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
                  placeholder="Enter product name (e.g., laptop, phone...)"
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
              Trigger a SQL error by breaking the query with special characters.
              Observe the error message to understand the query structure, then
              exploit it to extract unauthorized data.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={2}
        title="Error-Based SQL Injection"
        message="Great job! You've successfully triggered a SQL error and exploited the vulnerability. Error messages can reveal critical information about the database structure."
      />
    </>
  );
}
