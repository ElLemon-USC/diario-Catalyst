# =========================================
# SISTEMA DE AUDITORÍA / LOGS
# =========================================

# OBJETIVO:
# Guardar acciones importantes del sistema
# para que los admins puedan revisarlas.

# - quién baneó usuarios
# - quién eliminó entradas
# - quién bloqueó entradas
# - cuándo ocurrió
# - qué admin lo hizo

# audit.model.js
 import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  action: {
    type: String,
    enum: ["Usuario-baneado","usuario-desbaneado","entrada-bloqueada","entrada-desbloqueada","eliminar-entrada","hacer-admin"],
    required: true
  },

  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  targetEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diary",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Audit", auditSchema);

# audit.controller.js

import Audit from "../models/audit.model.js";

export const getAudits = async (req, res, next) => {
  try {

    const logs = await Audit.find()

      .populate("admin", "username")

      .populate("targetUser", "username")

      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    next(error);
  }
};

# audit.routes.js

import express from "express";
import { getAudits } from "../controllers/audit.controller.js";


import { verifyToken } from "../middlewares/verifyToken.js";


import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

// GET /api/audits
router.get("/audits",verifyToken,verifyAdmin,getAudits);

export default router;


# conexion de rutas app.js

import auditRoutes from "./routes/audit.routes.js";

app.use("/api", auditRoutes);

# conectar a diary.controller.js

import Audit from "../models/audit.model.js";

# baneo de usuarios

await user.save();

await Audit.create({
  admin: req.user.id,
  action: wasBlocked ? "usuario-baneado" : "usuario-desbaneado",
  targetUser: user._id
});

# bloqueo entradas
const wasBlocked = entry.blocked;

entry.blocked = !entry.blocked;

await entry.save();

await Audit.create({
  admin: req.user.id,
  action: wasBlocked ? "entrada-bloqeada" : "entrada-desbloqueada",
  targetEntry: entry._id
});


# ¿Por qué usar logs?
# -> para trazabilidad y seguridad

# ¿Por qué colección separada?
# -> organización y escalabilidad

# ¿Por qué enums?
# -> evitar acciones inválidas

# ¿Por qué guardar fechas?
# -> historial y auditoría
