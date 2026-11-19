import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="mt-4 text-lg text-slate-600">Halaman tidak ditemukan.</p>
      <div className="mt-6 flex justify-center gap-6">
        <Link to="/" className="text-blue-600 hover:underline">Ke halaman utama</Link>
        <Link to="/products" className="text-blue-600 hover:underline">Ke daftar produk</Link>
      </div>
    </section>
  );
}