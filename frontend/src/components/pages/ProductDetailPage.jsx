import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getProductById } from "../../services/productApi";
import formatPrice from "../../utils/formatPrice"; // sesuaikan dengan cara export file-mu

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | notfound | error

  useEffect(() => {
    let ignore = false;
    (async () => {
      setStatus("loading");
      try {
        const data = await getProductById(id);
        if (ignore) return;
        setProduct(data);
        setStatus(data ? "success" : "notfound");
      } catch {
        if (!ignore) setStatus("error");
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const backLink = (
    <Link to="/products" className="text-blue-600 hover:underline">
      ← Kembali ke daftar produk
    </Link>
  );

  if (status === "loading") return <p className="text-slate-600">Memuat produk...</p>;

  if (status === "notfound")
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">Produk tidak ditemukan</h1>
        <p className="mt-2 text-slate-600">
          Tidak ada produk dengan ID <strong>{id}</strong>.
        </p>
        <div className="mt-4">{backLink}</div>
      </div>
    );

  if (status === "error")
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">Gagal memuat produk. Pastikan server Express menyala.</p>
        <div className="mt-4">{backLink}</div>
      </div>
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">ID: {product.id}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
      <p className="mt-4 text-xl font-semibold text-blue-600">
        {formatPrice(product.price)}
      </p>
      <div className="mt-6">{backLink}</div>
    </div>
  );
}