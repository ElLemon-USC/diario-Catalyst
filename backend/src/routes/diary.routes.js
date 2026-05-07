import express from "express";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  createEntry,
  getEntries,
  deleteEntry,
  updateEntry,
  toggleFavorite
} from "../controllers/diary.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

//verificacion de token
router.post("/", verifyToken, createEntry);

//obtener las entradas
router.get("/", verifyToken, getEntries);

//eliminar la entrada
router.delete(
  "/:id",
  verifyToken,
  roleMiddleware("admin", "user"),
  deleteEntry
);

//actualizar la entrada
router.put("/:id", verifyToken, updateEntry);

//marcado favorito
router.put("/:id/favorite", verifyToken, toggleFavorite);

export default router;