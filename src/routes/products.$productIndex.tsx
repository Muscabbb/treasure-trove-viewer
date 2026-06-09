import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import productsData from "@/data/products.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";

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

export const Route = createFileRoute("/products/$productIndex")({
  head: ({ params }) => {
    const idx = Number(params.productIndex);
    const product = products[idx];
    return {
      meta: [
        { title: product ? `${product.name} — Product Details` : "Product Not Found" },
        { name: "description", content: product ? `Details for ${product.name}` : "Product not found" },
      ],
    };
  },
  loader: ({ params }) => {
    const idx = Number(params.productIndex);
    if (Number.isNaN(idx) || idx < 0 || idx >= products.length) {
      throw notFound();
    }
    return { product: products[idx], index: idx };
  },
  component: ProductDetailPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">
          <p className="text-lg font-medium">Product not found</p>
          <p className="mt-1 text-sm">The product you are looking for does not exist.</p>
          <div className="mt-6">
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back to products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductDetailPage() {
  const { product, index } = Route.useLoaderData();
  const fmt = (n: number, cur: string | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD" }).format(n);

  const margin = product.price > 0 ? ((product.price - product.cost) / product.price) * 100 : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-1 size-4" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image placeholder */}
          <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted">
            <Package className="size-32 text-muted-foreground/30" strokeWidth={1} />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                {product.category && <Badge variant="secondary">{product.category}</Badge>}
                {margin > 0 && <Badge variant="outline">{margin.toFixed(0)}% margin</Badge>}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
              {product.reference && (
                <p className="mt-1 font-mono text-sm text-muted-foreground">Ref: {product.reference}</p>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-medium">{fmt(product.cost, product.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-foreground">{fmt(product.price, product.currency)}</span>
                </div>
                {product.maxPrice > product.price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Price</span>
                    <span className="font-medium">{fmt(product.maxPrice, product.currency)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity in stock</span>
                  <span className="font-semibold">{product.quantity} {product.unit || ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{product.currency || "USD"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
