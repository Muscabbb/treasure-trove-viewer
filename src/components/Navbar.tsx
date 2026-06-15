import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";

function NavbarSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (value === q) return;
      const search = value ? `?q=${encodeURIComponent(value)}` : "";
      navigate(
        { pathname: "/products", search },
        { replace: location.pathname === "/products" }
      );
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        className="h-9 w-full rounded-full border border-border/60 bg-background/60 pl-9 pr-3 text-sm shadow-sm outline-none transition-all focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30">
            <Sparkles className="size-4" />
          </span>
          <span className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Catalog
          </span>
        </Link>
        <Link to="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Products
        </Link>
        <div className="ml-auto">
          <NavbarSearch />
        </div>
      </div>
    </nav>
  );
}
