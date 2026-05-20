import Diary from "../models/diary.model.js";
import User from "../models/user.model.js";

// Crear entrada
export const createEntry = async (req, res, next) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    if (
      visibility === "public" &&
      content.length > 333
    ) {
      return res.status(400).json({
        message: "La entrada pública no puede superar los 333 caracteres"
      });
    }

    if (
      visibility === "shared" &&
      content.length > 120
    ) {
      return res.status(400).json({
        message: "La entrada compartida no puede superar los 120 caracteres"
      });
    }

    let usersShared = [];

   if (
       visibility === "shared" &&
       sharedWith &&
       sharedWith.length
      ) {
      const users = await User.find({
        username: { $in: sharedWith }
      });

      usersShared = users.map(user => user._id);
    }

    const entry = new Diary({
      user: req.user.id,
      content,
      fontFamily,
      visibility,
      sharedWith: usersShared
    });

    await entry.save();

    res.json({ message: "Entrada guardada" });

  } catch (error) {
    next(error);
  }
};

// Ver entradas
export const getEntries = async (req, res, next) => {
  try {
    const entries = await Diary.find({
      $or: [
        { user: req.user.id },
        { visibility: "public" },
        {
          visibility: "shared",
          sharedWith: req.user.id
        }
      ]
    })
    .populate("user", "username")
    .sort({ createdAt: -1 });

    res.json(entries);

  } catch (error) {
   next(error);
  }
};

// Eliminar SOLO del usuario dueño
export const deleteEntry = async (req, res, next) => {
  try {
    await Diary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Entrada eliminada" });

  } catch (error) {
    next(error);
  }
};

// Editar-actualizar las entradas 
export const updateEntry = async (req, res, next) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    if (visibility === "public" &&
      content.length > 333
    ) {
      return res.status(400).json({
        message: "La entrada pública no puede superar los 333 caracteres"
      });
    }

    if (visibility === "shared" &&
      content.length > 120
    ) {
      return res.status(400).json({
        message: "La entrada compartida no puede superar los 120 caracteres"
      });
    }

    let usersShared = [];

    if (
      visibility === "shared" &&
      sharedWith &&
      sharedWith.length
    ) {
      const users = await User.find({
        username: { $in: sharedWith }
      });

      usersShared = users.map(user => user._id);
    }

    await Diary.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        content,
        fontFamily,
        visibility,
        sharedWith: usersShared
      }
    );

    res.json({ message: "Entrada actualizada" });

  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const entry = await Diary.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entrada no encontrada"
      });
    }

    entry.favorite = !entry.favorite;

    await entry.save();

    res.json({
      message: "Favorito actualizado",
      favorite: entry.favorite
    });

  } catch (error) {
    next(error);
  }
};