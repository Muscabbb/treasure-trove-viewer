import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle("Product Catalog", "Browse the product catalog.");
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight">Product Catalog</h1>
        <p className="mt-3 text-muted-foreground">Browse and search the full inventory.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View products
        </Link>
      </div>
    </main>
  );
}
