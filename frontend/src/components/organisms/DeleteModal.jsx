import { useState } from "react";
import formatPrice from "../../utils/formatPrice";

export default function DeleteModal({ product, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Hapus Produk?</h2>
        <p className="mt-1 text-sm text-slate-600">
          Produk yang dihapus tidak dapat dikembalikan.
        </p>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">ID: {product.id}</p>
          <h3 className="mt-1 font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 font-semibold text-blue-600">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Menghapus..." : "Hapus Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}