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

export default function Lab5Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "information_schema contains metadata about all database objects.",
    "Query tables: ' UNION SELECT NULL,table_name,NULL,NULL,NULL,NULL FROM information_schema.tables--",
    "Query columns: ' UNION SELECT NULL,column_name,NULL,NULL,NULL,NULL FROM information_schema.columns WHERE table_name='users'--",
    "Extract table names: ' UNION SELECT NULL,string_agg(table_name,','),NULL,NULL,NULL,NULL FROM information_schema.tables--",
    "Discover sensitive tables and their columns to plan your data extraction.",
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
      const endpoint = `/api/lab5/products/${isSecureMode ? "secure" : "unsecure"}?search=${encodeURIComponent(searchQuery)}`;
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
        setStatusMessage(`✅ Found ${data.data?.length || 0} results`);

        // Check if information_schema was queried
        if (
          !isSecureMode &&
          searchQuery.toUpperCase().includes("INFORMATION_SCHEMA")
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab5" }),
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
        labNumber={5}
        labTitle="Extracting Database Metadata"
        labDescription="Learn to extract database structure information using information_schema. Discover tables, columns, and relationships to plan comprehensive attacks."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Product Search</h2>
          <p className="text-muted mb-6">
            Search for products and use UNION queries to extract database
            metadata from information_schema. Learn what tables and columns
            exist in the database.
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
                  placeholder="Try: ' UNION SELECT NULL,table_name,NULL,NULL,NULL,NULL FROM information_schema.tables--"
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

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <p className="text-sm text-purple-900">
                <strong>💡 Metadata Tables:</strong> information_schema.tables,
                information_schema.columns, information_schema.table_constraints
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
              <div className="space-y-3">
                {products.map((product, idx) => (
                  <div key={product.id || idx} className="surface p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted font-semibold">ID</p>
                        <p className="font-mono text-sm">
                          {product.id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-semibold">Name</p>
                        <p className="font-mono text-sm">{product.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-semibold">
                          Category
                        </p>
                        <p className="font-mono text-sm">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-semibold">
                          Price
                        </p>
                        <p className="font-mono text-sm">{product.price}</p>
                      </div>
                    </div>
                    {product.description && (
                      <div className="mt-2">
                        <p className="text-xs text-muted font-semibold">
                          Description
                        </p>
                        <p className="text-sm">{product.description}</p>
                      </div>
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
              Use UNION queries with information_schema to discover all tables
              and columns in the database. This reconnaissance is crucial for
              identifying sensitive data locations.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={5}
        title="Extracting Database Metadata"
        message="Impressive! You've extracted database metadata using information_schema. This reconnaissance technique is essential for comprehensive SQL injection attacks."
      />
    </>
  );
}
