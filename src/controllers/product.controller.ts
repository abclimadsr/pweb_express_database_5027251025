import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateBody(body: any): { name: string; price: number } | null {
  if (typeof body?.name !== "string" || body.name.trim() === "") return null;
  if (!Number.isInteger(body?.price) || body.price < 0) return null;
  return { name: body.name.trim(), price: body.price };
}

function isNotFound(err: unknown) {
  return (err as { code?: string }).code === "P2025";
}

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.status(200).json(products);
}

export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response) {
  const data = validateBody(req.body);
  if (!data) {
    return res.status(400).json({ message: "name wajib diisi dan price harus bilangan bulat >= 0" });
  }
  const product = await prisma.product.create({ data });
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const id = parseId(req.body?.id);
  const data = validateBody(req.body);
  if (id === null || !data) {
    return res.status(400).json({ message: "id, name, dan price wajib diisi dengan benar" });
  }
  try {
    const product = await prisma.product.update({ where: { id }, data });
    res.status(200).json(product);
  } catch (err) {
    if (isNotFound(err)) return res.status(404).json({ message: "Produk tidak ditemukan" });
    throw err;
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  try {
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    if (isNotFound(err)) return res.status(404).json({ message: "Produk tidak ditemukan" });
    throw err;
  }
}