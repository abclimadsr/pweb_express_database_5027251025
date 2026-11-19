import { useState, useEffect } from "react";
import ProductCard from "../molecules/ProductCard";
import ProductFormModal from "../organisms/ProductFormModal";
import DeleteModal from "../organisms/DeleteModal";
import {
  getProducts,
  saveProduct,
  deleteProduct,
} from "../../services/productApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {type: "add"|"edit"|"delete", product}

  async function loadProducts() {
    try {
      setProducts(await getProducts());
      setLoadError("");
    } catch {
      setLoadError("Gagal memuat produk. Pastikan server Express menyala.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, []);

  async function handleSave(data) {
    const errMessage = await saveProduct(data, modal.product);
    if (errMessage) return errMessage; // ditampilkan di form
    await loadProducts();
    setModal(null);
  }

  async function handleDelete() {
    if (await deleteProduct(modal.product.id)) {
      await loadProducts();
      setModal(null);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Produk</h1>
          <p className="text-slate-600">
            Kelola daftar produk dan harga dalam satu tempat.
          </p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-sm"
        />
        <span className="whitespace-nowrap text-sm text-slate-500">
          {products.length} produk
        </span>
      </div>

      {loadError && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{loadError}</p>
      )}

      {loading ? (
        <p className="mt-6 text-slate-600">Memuat produk...</p>
      ) : filtered.length === 0 && !loadError ? (
        <p className="mt-6 text-slate-600">Produk tidak ditemukan.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={(product) => setModal({ type: "edit", product })}
              onDelete={(product) => setModal({ type: "delete", product })}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-slate-500">
        Menampilkan {filtered.length} dari {products.length} produk
      </p>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <ProductFormModal
          key={modal.product?.id ?? "new"}
          product={modal.product}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "delete" && (
        <DeleteModal
          product={modal.product}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}