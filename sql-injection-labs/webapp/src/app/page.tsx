import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldIcon, SparklesIcon, TruckIcon } from "@/components/icons";

const featuredProducts = [
  { name: "Aero Mesh Running Shoes", price: "$129", tag: "Best Seller" },
  { name: "Coastal Linen Shirt", price: "$74", tag: "New Arrival" },
  { name: "Smart Hydration Bottle", price: "$39", tag: "Top Rated" },
  { name: "Urban Carry Backpack", price: "$95", tag: "Limited" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="container-width grid gap-8 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="inline-flex rounded-full border border-(--line) bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--brand)">
              Crafted for everyday luxury
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Curated goods that feel premium from first click to delivery.
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              AURORA Market brings boutique quality to everyday shopping. Explore elevated essentials for home,
              style, and wellness with reliable shipping and easy returns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="brand-button primary">Shop products</Link>
              <Link href="/signup" className="brand-button secondary">Create your account</Link>
            </div>
          </div>
          <div className="surface-strong p-6 md:p-8">
            <p className="text-sm font-semibold text-(--brand)">Today only</p>
            <h2 className="mt-2 text-3xl font-black" style={{ fontFamily: "var(--font-playfair)" }}>
              30% off signature bundles
            </h2>
            <p className="mt-3 text-sm text-muted">Exclusive member deal on our most-loved starter kits.</p>
            <div className="mt-8 grid gap-3 text-sm">
              <div className="surface flex items-center justify-between px-4 py-3">
                <span>Home Refresh Set</span>
                <span className="font-bold">$89</span>
              </div>
              <div className="surface flex items-center justify-between px-4 py-3">
                <span>Daily Fitness Kit</span>
                <span className="font-bold">$72</span>
              </div>
              <div className="surface flex items-center justify-between px-4 py-3">
                <span>Travel Light Pack</span>
                <span className="font-bold">$64</span>
              </div>
            </div>
          </div>
        </section>
        <section className="container-width py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: ShieldIcon, title: "Secure checkout", text: "Encrypted payments and transparent billing." },
              { icon: TruckIcon, title: "Fast shipping", text: "2-4 business day delivery on most orders." },
              { icon: SparklesIcon, title: "Premium quality", text: "Carefully selected products with warranty." },
            ].map((item) => (
              <div key={item.title} className="surface p-5">
                <item.icon className="h-6 w-6 text-(--brand)" />
                <p className="mt-3 font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-width py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-(--brand)">Featured collection</p>
              <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-playfair)" }}>
                Best sellers this week
              </h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-(--brand)">View all products</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((item) => (
              <article key={item.name} className="surface overflow-hidden">
                <div className="h-44 bg-linear-to-br from-[#fcd9b5] via-[#f7f2e6] to-[#95d8d9]" />
                <div className="p-4">
                  <p className="text-xs font-bold uppercase text-(--brand)">{item.tag}</p>
                  <h3 className="mt-2 font-bold">{item.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-black">{item.price}</p>
                    <button className="brand-button secondary px-3! py-2! text-xs">Add to cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
