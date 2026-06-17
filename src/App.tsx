import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import WavyBackground from "./components/WavyBackground";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <>
      <WavyBackground />
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productIndex" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
