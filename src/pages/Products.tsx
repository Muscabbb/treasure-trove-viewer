import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import productsData from "@/data/products.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Sparkles, LayoutGrid, Rows3, Table as TableIcon } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type LayoutMode = "grid" | "list" | "table";

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

const palettes = [
  { from: "from-rose-400", via: "via-pink-500", to: "to-fuchsia-500" },
  { from: "from-amber-400", via: "via-orange-500", to: "to-red-500" },
  { from: "from-emerald-400", via: "via-teal-500", to: "to-cyan-500" },
  { from: "from-sky-400", via: "via-blue-500", to: "to-indigo-600" },
  { from: "from-violet-400", via: "via-purple-500", to: "to-fuchsia-600" },
  { from: "from-lime-400", via: "via-green-500", to: "to-emerald-600" },
  { from: "from-yellow-400", via: "via-amber-500", to: "to-orange-500" },
  { from: "from-cyan-400", via: "via-sky-500", to: "to-blue-600" },
];

function paletteFor(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return palettes[Math.abs(h) % palettes.length];
}

export default function Products() {
  useDocumentTitle("Products Catalog", "Browse our product catalog with smart search by product name.");
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [layout, setLayout] = useState<LayoutMode>("grid");


  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const indexed = products.map((p, i) => ({ p, i }));
    if (!query) return indexed;

    // Tokenize: split on whitespace/punctuation AND on digit↔letter boundaries
    // so "2MP" → ["2", "mp"] and "4mp" → ["4", "mp"].
    const tokenize = (s: string): string[] =>
      s
        .toLowerCase()
        .replace(/([a-z])(\d)/g, "$1 $2")
        .replace(/(\d)([a-z])/g, "$1 $2")
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

    const terms = tokenize(query);
    if (terms.length === 0) return indexed;

    return indexed.filter(({ p }) => {
      const tokens = tokenize(p.name);
      // Whole-token exact match for every term (search runs on submit).
      return terms.every((t) => tokens.includes(t));
    });
  }, [q]);

  const fmt = (n: number, cur: string | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD" }).format(n);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute top-40 -right-24 size-[28rem] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-fuchsia-500" />
            Curated collection
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} of {products.length.toLocaleString()} items
            {q && <span> matching “{q}”</span>}
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">View as</div>
          <div className="inline-flex rounded-xl border border-border/60 bg-background/60 p-1 backdrop-blur">
            {([
              { id: "grid", label: "Cards", Icon: LayoutGrid },
              { id: "list", label: "List", Icon: Rows3 },
              { id: "table", label: "Table", Icon: TableIcon },
            ] as { id: LayoutMode; label: string; Icon: typeof LayoutGrid }[]).map(({ id, label, Icon }) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={layout === id ? "default" : "ghost"}
                onClick={() => setLayout(id)}
                className="gap-1.5"
                aria-pressed={layout === id}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-20 text-center text-muted-foreground">
            No products match &ldquo;{q}&rdquo;
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, 200).map(({ p, i }, idx) => {
              const margin = p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
              const pal = paletteFor(p.reference || p.name);
              return (
                <Link
                  key={`${p.reference}-${i}`}
                  to={`/products/${i}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${Math.min(idx, 20) * 30}ms`, animationFillMode: "backwards" }}
                >
                  <article className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${pal.from} ${pal.via} ${pal.to}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                      <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                      <Package
                        className="relative size-20 text-white/90 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                        strokeWidth={1.25}
                      />
                      {p.category && (
                        <Badge className="absolute left-3 top-3 border-0 bg-white/90 text-foreground shadow-sm backdrop-blur">
                          {p.category}
                        </Badge>
                      )}
                      {margin > 0 && (
                        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                          <TrendingUp className="size-3" />
                          {margin.toFixed(0)}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-fuchsia-600">
                          {p.name}
                        </h3>
                        {p.reference && (
                          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{p.reference}</p>
                        )}
                      </div>

                      <div className="flex items-end justify-between border-t border-dashed pt-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Price</div>
                          <div className={`bg-gradient-to-r ${pal.from} ${pal.to} bg-clip-text text-lg font-bold text-transparent`}>
                            {fmt(p.price, p.currency)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Stock</div>
                          <div className="text-sm font-semibold">
                            {p.quantity}
                            <span className="ml-0.5 text-xs font-normal text-muted-foreground">{p.unit || ""}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : layout === "list" ? (
          <div className="flex flex-col gap-3">
            {filtered.slice(0, 200).map(({ p, i }, idx) => {
              const pal = paletteFor(p.reference || p.name);
              return (
                <Link
                  key={`${p.reference}-${i}`}
                  to={`/products/${i}`}
                  className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${Math.min(idx, 20) * 20}ms`, animationFillMode: "backwards" }}
                >
                  <div className={`flex size-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${pal.from} ${pal.via} ${pal.to}`}>
                    <Package className="size-7 text-white/90" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold group-hover:text-fuchsia-600">{p.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {p.reference && <span className="font-mono">{p.reference}</span>}
                      {p.category && <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Stock</div>
                    <div className="text-sm font-semibold">{p.quantity}<span className="ml-0.5 text-xs font-normal text-muted-foreground">{p.unit || ""}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Price</div>
                    <div className={`bg-gradient-to-r ${pal.from} ${pal.to} bg-clip-text font-bold text-transparent`}>
                      {fmt(p.price, p.currency)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Reference</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Cost</th>
                  <th className="px-4 py-3 text-right font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map(({ p, i }) => (
                  <tr key={`${p.reference}-${i}`} className="border-t border-border/60 transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link to={`/products/${i}`} className="font-medium hover:text-fuchsia-600">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.reference || "—"}</td>
                    <td className="px-4 py-3">{p.category ? <Badge variant="secondary">{p.category}</Badge> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(p.price, p.currency)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{fmt(p.cost, p.currency)}</td>
                    <td className="px-4 py-3 text-right">{p.quantity}<span className="ml-0.5 text-xs text-muted-foreground">{p.unit || ""}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 200 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Showing first 200 results. Refine your search to see more.
          </p>
        )}
      </div>
    </main>
  );
}
