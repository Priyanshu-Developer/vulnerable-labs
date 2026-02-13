"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

const categoryOptions = ["all", "electronics", "clothing", "books", "home", "toys"];

const unionPayloads = [
  {
    label: "Valid search",
    value: "wireless",
    note: "Baseline product search",
  },
  {
    label: "UNION probe",
    value: "' UNION SELECT 9999, current_user, 0, version(), NULL, 'system'--",
    note: "Attempts to union DB metadata into product rows",
  },
  {
    label: "Column mismatch",
    value: "' UNION SELECT current_user--",
    note: "Triggers SQL error to learn required column count",
  },
];

export default function Lab3Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [sortDraft, setSortDraft] = useState("featured");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("featured");
  const [isSecuredMode, setIsSecureMode] = useState(false);
  const [showBothQueries, setShowBothQueries] = useState(true);

  const fetchProducts = useCallback(
    async (search: string) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/lab3/products/${isSecuredMode ? "secure" : "unsecure"}?${params.toString()}`,
          { method: "GET" },
        );
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to fetch products");
        }

        setProducts(payload.data || []);
      } catch (fetchError) {
        console.error(fetchError);
        setProducts([]);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    },
    [isSecuredMode],
  );

  useEffect(() => {
    fetchProducts(searchDraft);
  }, [fetchProducts, searchDraft]);

  const filteredProducts = useMemo(() => {
    const byCategory = products.filter((item) => {
      if (activeCategory === "all") {
        return true;
      }
      return item.category.toLowerCase() === activeCategory;
    });

    if (activeSort === "price-low") {
      return [...byCategory].sort((a, b) => a.price - b.price);
    }

    if (activeSort === "price-high") {
      return [...byCategory].sort((a, b) => b.price - a.price);
    }

    if (activeSort === "name") {
      return [...byCategory].sort((a, b) => a.name.localeCompare(b.name));
    }

    return byCategory;
  }, [activeCategory, activeSort, products]);

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const category = String(formData.get("category") || "all");
    setActiveCategory(category);
    setActiveSort(sortDraft);
    fetchProducts(searchDraft);
  };

  const searchValue = searchDraft.trim();
  const secureQuery = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${searchValue ? "WHERE name ILIKE $1" : ""}
  `.trim();
  const secureParams = searchValue ? [`%${searchValue}%`] : [];
  const unsecureQuery = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${searchValue ? `WHERE name ILIKE '%${searchValue}%'` : ""}
  `.trim();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-width py-12">
        <section className="surface p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-black" style={{ fontFamily: "var(--font-playfair)" }}>
                Lab 3: UNION-Based Product SQLi
              </h1>
              <p className="mt-2 text-muted">
                Inject payloads into product search and compare unsecure string interpolation vs parameterized queries.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-2 py-1 text-xs font-bold">
              <span className={`${isSecuredMode ? "text-(--brand)" : "text-muted"}`}>Secured</span>
              <button
                type="button"
                aria-label="Toggle secured and unsecured mode"
                aria-pressed={!isSecuredMode}
                onClick={() => setIsSecureMode((prev) => !prev)}
                className={`relative h-6 w-11 rounded-full transition ${
                  isSecuredMode ? "bg-(--brand)" : "bg-amber-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    isSecuredMode ? "left-0.5" : "left-[1.4rem]"
                  }`}
                />
              </button>
              <span className={`${!isSecuredMode ? "text-amber-700" : "text-muted"}`}>Unsecured</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-(--line) bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-(--brand)">UNION payload helpers</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {unionPayloads.map((payload) => (
                <button
                  key={payload.label}
                  type="button"
                  onClick={() => {
                    setSearchDraft(payload.value);
                    fetchProducts(payload.value);
                  }}
                  className="rounded-full border border-(--line) bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  title={payload.note}
                >
                  {payload.label}
                </button>
              ))}
            </div>
          </div>

          <form className="mt-6 grid gap-3 md:grid-cols-4" onSubmit={applyFilters}>
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none focus:border-(--brand)"
              placeholder="Search / inject payload"
            />
            <select
              name="category"
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
              className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none focus:border-(--brand)"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={sortDraft}
              onChange={(event) => setSortDraft(event.target.value)}
              className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none focus:border-(--brand)"
            >
              <option value="featured">Most popular</option>
              <option value="name">Name: A-Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <button type="submit" className="brand-button primary">
              Apply filters
            </button>
          </form>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowBothQueries((prev) => !prev)}
              className="rounded-full border border-(--line) bg-white px-3 py-1 text-xs font-bold text-(--brand)"
            >
              {showBothQueries ? "Show active query only" : "Show both queries"}
            </button>
          </div>

          <section className="mt-3 space-y-2 rounded-xl border border-(--line) bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-(--brand)">Realtime SQL Preview</p>
            {(showBothQueries || isSecuredMode) && (
              <div
                className={`rounded-lg border px-3 py-2 ${
                  isSecuredMode ? "border-(--brand) bg-[#f3fbf9]" : "border-(--line)"
                }`}
              >
                <p className="mb-1 text-xs font-semibold text-(--brand)">Secured query</p>
                <code className="block whitespace-pre-wrap wrap-break-words text-xs">{secureQuery}</code>
                <p className="mt-2 text-xs text-muted">Params: [{secureParams.map((value) => `"${value}"`).join(", ")}]</p>
              </div>
            )}
            {(showBothQueries || !isSecuredMode) && (
              <div
                className={`rounded-lg border px-3 py-2 ${
                  !isSecuredMode ? "border-amber-400 bg-amber-50" : "border-(--line)"
                }`}
              >
                <p className="mb-1 text-xs font-semibold text-amber-700">Unsecured query</p>
                <code className="block whitespace-pre-wrap wrap-break-words text-xs">{unsecureQuery}</code>
              </div>
            )}
          </section>

          <p className="mt-4 text-sm text-muted">Showing {filteredProducts.length} products</p>
          {loading ? <p className="mt-2 text-sm text-muted">Loading products...</p> : null}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((item) => (
            <article key={item.id} className="surface overflow-hidden">
              <img
                src={item.image_url || "/book.png"}
                alt={item.name}
                className="h-40 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/book.png";
                }}
              />
              <div className="p-4">
                <p className="text-xs font-bold uppercase text-(--brand)">{item.category}</p>
                <h2 className="mt-2 font-bold">{item.name}</h2>
                {item.description ? <p className="mt-2 text-sm text-muted">{item.description}</p> : null}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-black">${item.price.toFixed(2)}</p>
                  <button className="brand-button secondary px-3! py-2! text-xs">Add</button>
                </div>
              </div>
            </article>
          ))}
          {!loading && filteredProducts.length === 0 ? (
            <div className="surface col-span-full p-10 text-center">
              <p className="text-lg font-bold">No products found</p>
              <p className="mt-2 text-sm text-muted">Try a different search term or payload.</p>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
