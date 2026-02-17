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

export default function Lab7Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [queryParams, setQueryParams] = useState<any[]>([]);

  const hints = [
    "Multiple parameters can create complex queries with multiple injection points.",
    "Try injecting in the search field: ' OR 1=1--",
    "The price filters create additional WHERE conditions you can exploit.",
    "Try: minPrice=0&maxPrice=9999' OR '1'='1",
    "Combine UNION attacks with multiple conditions for maximum data extraction.",
  ];

  // Update query display when inputs change
  useEffect(() => {
    const conditions = [];
    const params = [];

    if (isSecureMode) {
      if (searchQuery) {
        conditions.push("name ILIKE $1");
        params.push(`%${searchQuery}%`);
      }
      if (minPrice) {
        conditions.push(`price >= $${params.length + 1}`);
        params.push(minPrice);
      }
      if (maxPrice) {
        conditions.push(`price <= $${params.length + 1}`);
        params.push(maxPrice);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      setExecutedQuery(`SELECT * FROM products ${whereClause}`.trim());
      setQueryParams(params);
    } else {
      if (searchQuery) {
        conditions.push(`name ILIKE '%${searchQuery}%'`);
      }
      if (minPrice) {
        conditions.push(`price >= ${minPrice}`);
      }
      if (maxPrice) {
        conditions.push(`price <= ${maxPrice}`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      setExecutedQuery(`SELECT * FROM products ${whereClause}`.trim());
      setQueryParams([]);
    }
  }, [searchQuery, minPrice, maxPrice, isSecureMode]);

  const handleSearch = async () => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const endpoint = `/api/lab7/products/${isSecureMode ? "secure" : "unsecure"}?${params.toString()}`;
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

        // Check if injection was successful
        if (
          !isSecureMode &&
          (searchQuery.includes("OR") ||
            searchQuery.includes("UNION") ||
            minPrice.includes("OR") ||
            maxPrice.includes("OR"))
        ) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab7" }),
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
    updateQueryDisplay(value, minPrice, maxPrice);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    updateQueryDisplay(searchQuery, value, maxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    updateQueryDisplay(searchQuery, minPrice, value);
  };

  const updateQueryDisplay = (search: string, min: string, max: string) => {
    const conditions = [];
    const params = [];

    if (isSecureMode) {
      if (search) {
        conditions.push("name ILIKE $1");
        params.push(`%${search}%`);
      }
      if (min) {
        conditions.push(`price >= $${params.length + 1}`);
        params.push(min);
      }
      if (max) {
        conditions.push(`price <= $${params.length + 1}`);
        params.push(max);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      setExecutedQuery(`SELECT * FROM products ${whereClause}`.trim());
      setQueryParams(params);
    } else {
      if (search) {
        conditions.push(`name ILIKE '%${search}%'`);
      }
      if (min) {
        conditions.push(`price >= ${min}`);
      }
      if (max) {
        conditions.push(`price <= ${max}`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      setExecutedQuery(`SELECT * FROM products ${whereClause}`.trim());
      setQueryParams([]);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={7}
        labTitle="Advanced Search Exploitation"
        labDescription="Master complex SQL injection with multiple parameters. Learn to exploit search functions that combine text and numeric filters."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={queryParams}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Advanced Product Search</h2>
          <p className="text-muted mb-6">
            Search products with multiple filters. Each parameter is an
            injection point. Combine techniques from previous labs to exploit
            this complex query.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name (try injection here)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Min Price
                </label>
                <input
                  type="text"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Max Price
                </label>
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  placeholder="9999"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) disabled:opacity-50 transition text-lg"
            >
              {isLoading ? "Searching..." : "Search Products"}
            </button>

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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
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
              Exploit the advanced search with multiple injection points. Try
              injecting in different parameters (name, minPrice, maxPrice) and
              combine techniques to extract sensitive data.
            </p>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={7}
        title="Advanced Search Exploitation"
        message="Outstanding! You've mastered complex SQL injection with multiple parameters. You can now identify and exploit SQL injection vulnerabilities in real-world applications."
      />
    </>
  );
}
