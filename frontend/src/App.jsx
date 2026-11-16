import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
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
  useEffect(() => { loadProducts(); }, []);

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
        <button className="btn-primary" onClick={() => setModal({ type: "add" })}>
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
    </div>
  );
}