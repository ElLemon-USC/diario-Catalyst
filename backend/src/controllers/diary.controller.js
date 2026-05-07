import Diary from "../models/diary.model.js";
import User from "../models/user.model.js";

// Crear entrada
export const createEntry = async (req, res) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    let usersShared = [];

    if (visibility === "shared" && sharedWith.length) {
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
    res.status(500).json({ error: error.message });
  }
};

// Ver entradas
export const getEntries = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

// Eliminar SOLO del usuario dueño
export const deleteEntry = async (req, res) => {
  try {
    await Diary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Entrada eliminada" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar-actualizar las entradas 
export const updateEntry = async (req, res) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    let usersShared = [];

    if (visibility === "shared" && sharedWith.length) {
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
    res.status(500).json({ error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
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
    res.status(500).json({
      error: error.message
    });
  }
};