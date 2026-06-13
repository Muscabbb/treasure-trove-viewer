import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products Catalog" },
      { name: "description", content: "Browse our product catalog with smart search by product name." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();

  const filtered = useMemo(() => {
    const query = (q || "").trim().toLowerCase();
    const indexed = products.map((p, i) => ({ p, i }));
    if (!query) return indexed;
    const terms = query.split(/\s+/);
    return indexed.filter(({ p }) => {
      const hay = p.name.toLowerCase();
      return terms.every((t: string) => hay.includes(t));
    });
  }, [q]);

  const fmt = (n: number, cur: string | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD" }).format(n);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} of {products.length.toLocaleString()} items
          </p>
        </header>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">
            No products match &ldquo;{q}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, 200).map(({ p, i }) => {
              const margin = p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
              return (
                <Link
                  key={`${p.reference}-${i}`}
                  to="/products/$productIndex"
                  params={{ productIndex: String(i) }}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden transition hover:shadow-md">
                    <div className="flex aspect-square items-center justify-center bg-muted">
                      <Package className="size-16 text-muted-foreground/40 transition group-hover:text-muted-foreground/60" strokeWidth={1.25} />
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
                </Link>
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
