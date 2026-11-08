import express from "express";
import type { Request, Response, NextFunction } from "express";
import { requestLogger } from "./middleware/request-logger.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/products", productRouter);

// route yang tidak ada
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

// penanganan error
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if ((err as { type?: string }).type === "entity.parse.failed") {
    return res.status(400).json({ message: "Body JSON tidak valid" });
  }
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

export default app;