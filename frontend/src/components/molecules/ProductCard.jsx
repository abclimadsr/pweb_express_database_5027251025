import { Link } from "react-router";
import formatPrice from "../../utils/formatPrice";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs text-slate-500">ID: {product.id}</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          {product.name}
        </h2>
        <p className="mt-2 font-semibold text-blue-600">
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/products/${product.id}`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Detail
        </Link>
        <button
          onClick={() => onEdit(product)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Hapus
        </button>
      </div>
    </article>
  );
}