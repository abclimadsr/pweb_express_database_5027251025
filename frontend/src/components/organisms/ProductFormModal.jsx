import { useState } from "react";

// Ada prop product -> mode edit. Tidak ada -> mode tambah.
export default function ProductFormModal({ product, onSave, onClose }) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // cegah reload halaman
    if (name.trim() === "") return setError("Nama produk wajib diisi.");
    if (Number(price) <= 0) return setError("Harga harus lebih dari 0.");

    setSaving(true);
    // onSave mengembalikan pesan error dari API kalau gagal
    const message = await onSave({ name: name.trim(), price: Number(price) });
    if (message) {
      setError(message);
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold text-slate-900">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {isEdit
            ? "Perbarui informasi produk yang dipilih."
            : "Masukkan informasi produk baru."}
        </p>
        {isEdit && (
          <p className="mt-2 text-xs text-slate-500">ID: {product.id}</p>
        )}

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nama Produk
            </label>
            <input
              value={name}
              placeholder="Contoh: Pulpen"
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Harga (Rp)
            </label>
            <input
              type="number"
              value={price}
              placeholder="Contoh: 5000"
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              Harga harus lebih dari 0.
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}