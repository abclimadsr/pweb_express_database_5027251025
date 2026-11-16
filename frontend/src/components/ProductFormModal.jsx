import { useState } from "react";

// Ada prop product -> mode edit. Tidak ada -> mode tambah.
export default function ProductFormModal({ product, onSave, onClose }) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // cegah reload halaman
    if (name.trim() === "") return setError("Nama produk wajib diisi.");
    if (Number(price) <= 0) return setError("Harga harus lebih dari 0.");
    // onSave mengembalikan pesan error dari API kalau gagal
    const message = await onSave({ name: name.trim(), price: Number(price) });
    if (message) setError(message);
  }

  return (
    <div className="overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
        <p>{isEdit ? "Perbarui informasi produk yang dipilih." : "Masukkan informasi produk baru."}</p>
        {isEdit && <small>ID: {product.id}</small>}

        <label>Nama Produk</label>
        <input value={name} placeholder="Contoh: Pulpen"
               onChange={(e) => setName(e.target.value)} />

        <label>Harga (Rp)</label>
        <input type="number" value={price} placeholder="Contoh: 5000"
               onChange={(e) => setPrice(e.target.value)} />
        <small>Harga harus lebih dari 0.</small>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="submit" className="btn-primary">
            {isEdit ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}