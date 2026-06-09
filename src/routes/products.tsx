import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import productsData from "@/data/products.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

type Product = {
  name: string;
  reference: string | null;
  category: string | null;
  cost: number;
  price: number;
  maxPrice: number;
  quantity: number;
  unit: string | null;
  currency: string | null;
};

const products = productsData as Product[];

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products Catalog" },
      { name: "description", content: "Browse our product catalog with smart search by product name." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    const terms = q.split(/\s+/);
    return products.filter((p) => {
      const hay = p.name.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [query]);

  const fmt = (n: number, cur: string | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD" }).format(n);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length.toLocaleString()} of {products.length.toLocaleString()} items
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..."

              className="pl-9"
              aria-label="Search products"
            />
          </div>
        </header>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">
            No products match "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, 200).map((p, i) => {
              const margin = p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
              return (
                <Card key={`${p.reference}-${i}`} className="overflow-hidden transition hover:shadow-md">
                  <div className="flex aspect-square items-center justify-center bg-muted">
                    <Package className="size-16 text-muted-foreground/40" strokeWidth={1.25} />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-base">{p.name}</CardTitle>
                      {p.category && <Badge variant="secondary" className="shrink-0">{p.category}</Badge>}
                    </div>
                    {p.reference && (
                      <p className="font-mono text-xs text-muted-foreground">{p.reference}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-medium">{fmt(p.cost, p.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-foreground">{fmt(p.price, p.currency)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-xs text-muted-foreground">
                        {p.quantity} {p.unit || ""} in stock
                      </span>
                      {margin > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {margin.toFixed(0)}% margin
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {filtered.length > 200 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Showing first 200 results. Refine your search to see more.
          </p>
        )}
      </div>
    </main>
  );
}
