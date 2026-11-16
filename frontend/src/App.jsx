import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";
import "./App.css";

const API = "/products"; // diteruskan Vite ke http://localhost:3000

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(null); // null | {type: "add"|"edit"|"delete", product}

  // GET /products
  async function loadProducts() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
      setLoadError("");
    } catch {
      setLoadError("Gagal memuat produk. Pastikan server Express menyala.");
    }
  }

  // [] = dijalankan sekali saat komponen pertama tampil
  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, []);

  // POST kalau tambah, PUT kalau edit (PUT membawa id di body sesuai API-mu)
  async function handleSave(data) {
    const isAdd = modal.type === "add";
    const res = await fetch(API, {
      method: isAdd ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isAdd ? data : { id: modal.product.id, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      return err.message; // ditampilkan di form
    }
    await loadProducts(); // ambil ulang supaya sama dengan isi database
    setModal(null);
  }

  // data turunan dari state, tidak perlu state terpisah
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Manajemen Produk</h1>
          <p>Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModal({ type: "add" })}
        >
          + Tambah Produk
        </button>
      </header>

      <div className="toolbar">
        <input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>{products.length} produk</span>
      </div>

      {loadError && <p className="error">{loadError}</p>}

      {filtered.length === 0 && !loadError ? (
        <p>Produk tidak ditemukan.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            // key harus unik dan stabil, pakai id dari database
            <ProductCard
              key={p.id}
              product={p}
              onEdit={(product) => setModal({ type: "edit", product })}
              onDelete={(product) => setModal({ type: "delete", product })}
            />
          ))}
        </div>
      )}

      <p className="footer">
        Menampilkan {filtered.length} dari {products.length} produk
      </p>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <ProductFormModal
          key={modal.product?.id ?? "new"} // form di-reset setiap dibuka
          product={modal.product}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}