

interface ProductCardProps {
  filteredProducts: {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    image_url?: string;
  }[];
  loading: boolean;
}

const ProductCard = ({ filteredProducts, loading }: ProductCardProps) => {
  return(
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
              <p className="mt-2 text-sm text-muted">Try a different search term or category.</p>
            </div>
          ) : null}
        </section>
  );
};

export default ProductCard;