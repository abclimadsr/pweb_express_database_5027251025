const API = "/api/products";
const JSON_HEADERS = { "Content-Type": "application/json" };

export async function getProducts() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Gagal memuat produk.");
  return res.json();
}

// Mengembalikan null jika produk tidak ada
export async function getProductById(id) {
  const res = await fetch(`${API}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal memuat produk.");
  return res.json();
}

// Mengembalikan pesan error (string) jika gagal, null jika berhasil
export async function saveProduct(data, existing) {
  const isEdit = Boolean(existing);
  const res = await fetch(API, {
    method: isEdit ? "PUT" : "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(isEdit ? { id: existing.id, ...data } : data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return err.message || "Gagal menyimpan produk.";
  }
  return null;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  return res.ok;
}