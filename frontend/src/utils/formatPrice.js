// 5000 -> "Rp5.000"
export default function formatPrice(price) {
  return "Rp" + Number(price).toLocaleString("id-ID");
}