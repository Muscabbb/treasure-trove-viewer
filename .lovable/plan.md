
# Migrate to React + Vite + TypeScript with react-router-dom

Replace TanStack Start / TanStack Router with a standard Vite SPA using `react-router-dom`. Same three pages, same design, same product data — just a simpler stack.

## Heads up (important)

Lovable's template is built around TanStack Start, and its hosting (`.lovable.app`) is wired for it. After this migration:
- The local preview will keep working (Vite dev server).
- Publishing to `treasure-trove-viewer.lovable.app` may break or behave oddly, because the Lovable build pipeline expects the TanStack Start entry. If that happens, the realistic path is to push to GitHub and deploy on Vercel/Netlify (Vite SPA preset, zero config).

If you'd rather not risk Lovable publishing, say the word and I'll stop. Otherwise I'll proceed.

## Pages to keep (identical UX/design)

1. `/` — landing with "View products" CTA
2. `/products` — grid with gradient cards, `?q=` search synced to URL
3. `/products/:productIndex` — product detail page

## Changes

### Add
- `bun add react-router-dom`
- `src/main.tsx` — Vite entry: `ReactDOM.createRoot` + `<BrowserRouter>` + `<QueryClientProvider>`
- `src/App.tsx` — `<Routes>` table with the 3 routes + 404 fallback + shared `<Navbar />`
- `src/components/Navbar.tsx` — extracted from current `__root.tsx` (logo + Products link + search input that updates `?q=` via `useNavigate` + `useSearchParams`)
- `src/pages/Home.tsx` — current `routes/index.tsx` body
- `src/pages/Products.tsx` — current `routes/products.index.tsx` body, using `useSearchParams` for `q` and `<Link to={`/products/${i}`}>`
- `src/pages/ProductDetail.tsx` — current `routes/products.$productIndex.tsx`, using `useParams<{ productIndex: string }>()`; redirect to `/products` if index is invalid
- `src/pages/NotFound.tsx` — 404 page
- `index.html` at project root — standard Vite SPA HTML with `<div id="root">` and `<script type="module" src="/src/main.tsx">`, plus the meta tags currently in `__root.tsx` `head()`
- Per-page titles via a tiny `useDocumentTitle(title, description?)` hook called from each page

### Remove
- `src/routes/` (entire directory)
- `src/routeTree.gen.ts`
- `src/router.tsx`, `src/server.ts`, `src/start.ts`
- TanStack-related deps from `package.json`: `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-router-devtools`, `@tanstack/router-plugin`, `@tanstack/router-devtools`
- TanStack plugin entries from `vite.config.ts` — replace with a minimal `defineConfig({ plugins: [react()] })`

### Keep unchanged
- `src/styles.css` (Tailwind theme/tokens)
- `src/components/ui/*` (shadcn)
- `src/data/products.json`
- `src/lib/*`
- `@tanstack/react-query` (still used for QueryClientProvider, harmless to keep)

## Technical details

- Vite SPA entry pattern:
  ```tsx
  // src/main.tsx
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
  ```
- Routing:
  ```tsx
  <Routes>
    <Route element={<NavbarLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productIndex" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
  ```
- Search input in navbar: `const [params, setParams] = useSearchParams()`; debounced `setParams({ q })`.
- Product detail: parse `useParams().productIndex` → number; if NaN or out of range, render `NotFound`.
- For SPA deep-link refresh, add `public/_redirects` with `/* /index.html 200` so any static host (Netlify-style) serves `index.html`. Vercel needs no config for Vite SPA.

## After implementation

I'll start the dev server, click through `/`, `/products`, `/products/0`, and `/products/999999` to verify routing, search-param sync, and 404 all work. Then I'll let you know the publish status.
