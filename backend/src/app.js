import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

console.log("URI:", process.env.MONGO_URI);
connectDB();

//  PRIMERO middlewares
app.use(cors());
app.use(express.json());

//  DESPUÉS rutas
app.use("/api/auth", authRoutes);

// ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando ");
});

import { verifyToken } from "./middlewares/auth.middleware.js";

app.get("/api/protegido", verifyToken, (req, res) => {
  res.json({
    message: "Ruta protegida",
    user: req.user
  });
});

import diaryRoutes from "./routes/diary.routes.js";

app.use("/api/diary", diaryRoutes);

// puerto
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(errorMiddleware);