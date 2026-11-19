import { NavLink } from "react-router";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "font-semibold text-blue-600"
      : "text-slate-600 hover:text-blue-600";

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6">
        <span className="text-lg font-bold text-slate-900">Manajemen Produk</span>
        <NavLink to="/products" className={linkClass}>
          Produk
        </NavLink>
      </nav>
    </header>
  );
}