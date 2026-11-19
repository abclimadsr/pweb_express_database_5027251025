import { Routes, Route, Navigate } from "react-router";
import PageLayout from "./components/templates/PageLayout";
import ProductsPage from "./components/pages/ProductsPage";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import NotFoundPage from "./components/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}