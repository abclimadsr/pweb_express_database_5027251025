import formatPrice from "../../utils/formatPrice";

export default function DeleteModal({ product, onConfirm, onClose }) {
  return (
    <div className="overlay">
      <div className="modal">
        <h2>Hapus Produk?</h2>
        <p>Produk yang dihapus tidak dapat dikembalikan.</p>
        <div className="card">
          <small>ID: {product.id}</small>
          <h3>{product.name}</h3>
          <p className="price">{formatPrice(product.price)}</p>
        </div>
        <div className="actions">
          <button className="btn-outline" onClick={onClose}>Batal</button>
          <button className="btn-danger" onClick={onConfirm}>Hapus Produk</button>
        </div>
      </div>
    </div>
  );
}