"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Greeting from "@/components/greeting";
import QuerySection from "./query-section";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

const categoryOptions = ["electronics", "clothing", "books", "home", "toys"];

export default function Lab2Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("all");
  const [sortDraft, setSortDraft] = useState("featured");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("featured");
  const [isSecuredMode, setIsSecureMode] = useState(false);
  const [showBothQueries, setShowBothQueries] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchProducts = useCallback(async (search: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`/api/lab2/products/${isSecuredMode ? "secured" : "unsecured"}?${params.toString()}`, { method: "GET" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to fetch products");
      }

      setProducts(payload.data || []);
    } catch (fetchError) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lab_name: "lab2" }),
      }).catch((err) => {
        console.error("Failed to update progress:", err);
      }).then(() => {
        setOpenDialog(true);
      });

      setProducts([]);
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  }, [isSecuredMode]);

  useEffect(() => {
    fetchProducts("");
  }, [fetchProducts]);

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
    setActiveCategory(categoryDraft);
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
          <div className="flex flex-row justify-between">
            <div>
              <h1 className="text-4xl font-black" style={{ fontFamily: "var(--font-playfair)" }}>
                Product Catalog
              </h1>
              <p className="mt-2 text-muted">Explore curated products ready to ship. Free shipping over $75.</p>
            </div>
            <div className="inline-flex items-center gap-2  bg-white px-2 py-1 text-xs font-bold">
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
          <form className="mt-6 grid gap-3 md:grid-cols-4" onSubmit={applyFilters}>
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none focus:border-(--brand)"
              placeholder="Search products"
            />
            <select
              value={categoryDraft}
              onChange={(event) => setCategoryDraft(event.target.value)}
              className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none focus:border-(--brand)"
            >
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
          <QuerySection showBothQueries={showBothQueries} isSecuredMode={isSecuredMode} secureQuery={secureQuery} unsecureQuery={unsecureQuery} secureParams={secureParams} />
          <p className="mt-4 text-sm text-muted">
            Showing {filteredProducts.length} products
          </p>
          {loading ? <p className="mt-2 text-sm text-muted">Loading products...</p> : null}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </section>

      </main>
      <Footer />
      <Greeting open={openDialog} onOpenChange={setOpenDialog} link="/lab3"/>
    </div>
  );
}
