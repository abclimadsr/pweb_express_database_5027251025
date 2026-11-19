import formatPrice from "../../utils/formatPrice";

// Props: product (data), onEdit dan onDelete (fungsi dari parent)
export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="card">
      <small>ID: {product.id}</small>
      <h3>{product.name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      <div className="actions">
        <button className="btn-outline" onClick={() => onEdit(product)}>Edit</button>
        <button className="btn-danger-outline" onClick={() => onDelete(product)}>Hapus</button>
      </div>
    </div>
  );
}